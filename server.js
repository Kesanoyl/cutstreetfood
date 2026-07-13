/* ============================================================
   CUT Streetfood — Server (Express + Stripe + PostgreSQL)
   Click & Collect avec paiement en ligne
   ============================================================ */
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import Stripe from 'stripe';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import {
  initDB, getOrCreateCustomer, getCustomerByPhone,
  createOrder, getOrdersByPhone, getOrderBySession,
  updateOrderStatus, getActiveOrders, getOrderByNumber,
  saveFCMToken
} from './db.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3000;
const PUBLIC_URL = process.env.PUBLIC_URL || `http://localhost:${PORT}`;

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy');

// ─── OneSignal (notifications push) ───────────────────────
// Renseigner ONESIGNAL_APP_ID + ONESIGNAL_REST_API_KEY (vars d'env Render) pour activer.
const ONESIGNAL_APP_ID = process.env.ONESIGNAL_APP_ID || '';
const ONESIGNAL_REST_KEY = process.env.ONESIGNAL_REST_API_KEY || '';
// La notif de confirmation part dans la seconde qui suit le retour de Stripe.
// Si l'alias (n° de tel) vient tout juste d'être rattache a l'abonnement,
// OneSignal peut ne pas encore le voir et repondre « All included players are
// not subscribed ». Dans CE cas precis on retente une fois : c'est une course,
// pas un vrai desabonnement. (Ne jamais « reparer » un abonnement cote serveur,
// cf. memoire onesignal-push-gotchas.)
const NOT_SUBSCRIBED = /not subscribed/i;

async function postPush(phone, title, message) {
  const res = await fetch('https://onesignal.com/api/v1/notifications', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Key ' + ONESIGNAL_REST_KEY },
    body: JSON.stringify({
      app_id: ONESIGNAL_APP_ID,
      include_aliases: { external_id: [String(phone).replace(/\s/g, '')] },
      target_channel: 'push',
      headings: { en: title, fr: title },
      contents: { en: message, fr: message },
      url: PUBLIC_URL,
    }),
  });
  return res.json();
}

async function sendPush(phone, title, message, retries = 2) {
  if (!ONESIGNAL_APP_ID || !ONESIGNAL_REST_KEY || !phone) return;
  try {
    const j = await postPush(phone, title, message);
    if (j.id) { console.log('[OneSignal] →', phone, 'envoyée ' + j.id); return; }

    const errs = JSON.stringify(j.errors || j);
    if (retries > 0 && NOT_SUBSCRIBED.test(errs)) {
      console.log('[OneSignal] →', phone, 'alias pas encore visible, nouvel essai dans 5s');
      setTimeout(() => sendPush(phone, title, message, retries - 1), 5000);
      return;
    }
    console.log('[OneSignal] →', phone, errs);
  } catch (e) { console.error('[OneSignal] erreur', e.message); }
}

// Passage « en attente » → « payée ». Point de passage UNIQUE : la notif de
// confirmation part ici, donc exactement une fois, que la commande soit
// confirmée par le webhook Stripe (client parti) ou par la page de confirmation
// (client revenu). La transition depuis 'pending' sert de garde anti-doublon.
async function markOrderPaid(order, via) {
  if (!order || order.status !== 'pending') return false;
  await updateOrderStatus(order.order_number, 'paid');
  order.status = 'paid';
  console.log('[Commande]', order.order_number, 'payée (' + via + ')');
  sendPush(
    order.customer_phone,
    `✅ Commande #${order.order_number} confirmée !`,
    `Prête dans ~${order.prep_minutes || 15} min. Merci !`
  );
  return true;
}

const app = express();

// ─── MIDDLEWARE ───────────────────────────────────────────
app.use(cors());
app.use(express.static(resolve(__dirname, 'public')));

// Stripe webhook needs raw body
app.post('/api/stripe-webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET || 'whsec_dummy');
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    console.log('[Stripe] Paiement confirmé:', session.id);
    // Marque la commande payée côté serveur ET envoie la notif de confirmation —
    // même si le client a fermé l'onglet sans revenir sur la page de confirmation.
    try {
      const order = await getOrderBySession(session.id);
      await markOrderPaid(order, 'webhook Stripe');
    } catch (e) { console.error('[Stripe webhook] maj statut:', e.message); }
  }
  res.json({ received: true });
});

app.use(express.json());

// ─── API: Créer une session Stripe Checkout ──────────────
app.post('/api/create-checkout', async (req, res) => {
  try {
    const { cart, phone, name, deliveryType, deliveryAddress, deliveryFee } = req.body;
    if (!cart || !cart.length) return res.status(400).json({ error: 'Panier vide' });
    if (!phone) return res.status(400).json({ error: 'Téléphone requis' });

    const customer = await getOrCreateCustomer(phone, name);

    const subtotalCents = cart.reduce((sum, item) => sum + Math.round(item.price * 100) * item.qty, 0);
    const deliveryFeeCents = Math.round((deliveryFee || 0) * 100);
    const totalCents = subtotalCents + deliveryFeeCents;

    const line_items = cart.map(item => ({
      price_data: {
        currency: 'eur',
        product_data: { name: item.name, description: item.label || undefined },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.qty,
    }));

    if (deliveryFeeCents > 0) {
      line_items.push({
        price_data: {
          currency: 'eur',
          product_data: { name: 'Livraison 🛵' },
          unit_amount: deliveryFeeCents,
        },
        quantity: 1,
      });
    }

    const totalItems = cart.reduce((s, i) => s + i.qty, 0);
    const prepMinutes = Math.max(10, Math.min(35, totalItems * 2 + 8 + (deliveryType === 'delivery' ? 10 : 0)));

    // URL de base derivee de la requete reelle (robuste si PUBLIC_URL non defini sur Render)
    const fwdHost = req.headers['x-forwarded-host'] || req.headers.host;
    const fwdProto = req.headers['x-forwarded-proto'] || 'https';
    const baseUrl = fwdHost ? `${fwdProto}://${fwdHost}` : PUBLIC_URL;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items,
      metadata: {
        phone: phone.replace(/\s/g, ''),
        name: name || '',
        deliveryType: deliveryType || 'pickup',
        deliveryAddress: deliveryAddress || '',
      },
      success_url: `${baseUrl}/confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/#menu`,
    });

    const order = await createOrder({
      phone: phone.replace(/\s/g, ''),
      name: name || '',
      items: cart.map(i => ({ name: i.name, label: i.label, comp: i.comp || [], extras: i.extras || '', price: i.price, qty: i.qty })),
      subtotalCents,
      totalCents,
      stripeSessionId: session.id,
      prepMinutes,
      deliveryType: deliveryType || 'pickup',
      deliveryAddress: deliveryAddress || '',
      deliveryFee: deliveryFeeCents,
    });

    res.json({
      url: session.url,
      orderNumber: order.order_number,
      prepMinutes,
    });
  } catch (err) {
    console.error('[Checkout]', err);
    res.status(500).json({ error: err.message });
  }
});

// ─── API: Statut par session Stripe ──────────────────────
app.get('/api/order-by-session/:sessionId', async (req, res) => {
  try {
    const order = await getOrderBySession(req.params.sessionId);
    if (!order) return res.status(404).json({ error: 'Commande introuvable' });
    // No-op si le webhook Stripe est déjà passé (la notif a alors déjà été envoyée).
    await markOrderPaid(order, 'page de confirmation');
    res.json({
      orderNumber: order.order_number,
      status: order.status,
      prepMinutes: order.prep_minutes,
      readyAt: order.ready_at,
      items: order.items,
      totalCents: order.total_cents,
      createdAt: order.created_at,
      deliveryType: order.deliveryType || order.delivery_type || 'pickup',
      deliveryAddress: order.deliveryAddress || order.delivery_address || '',
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── API: Statut d'une commande ──────────────────────────
app.get('/api/order/:number', async (req, res) => {
  try {
    const num = parseInt(req.params.number);
    const order = await getOrderByNumber(num);
    if (!order) return res.status(404).json({ error: 'Commande introuvable' });
    res.json({
      orderNumber: order.order_number,
      status: order.status,
      prepMinutes: order.prep_minutes,
      readyAt: order.ready_at,
      items: order.items,
      totalCents: order.total_cents,
      createdAt: order.created_at,
      deliveryType: order.deliveryType || order.delivery_type || 'pickup',
      deliveryAddress: order.deliveryAddress || order.delivery_address || '',
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── API: Historique client ──────────────────────────────
app.get('/api/orders', async (req, res) => {
  try {
    const { phone } = req.query;
    if (!phone) return res.status(400).json({ error: 'Téléphone requis' });
    const orders = await getOrdersByPhone(phone.replace(/\s/g, ''));
    res.json(orders.map(o => ({
      orderNumber: o.order_number,
      status: o.status,
      totalCents: o.total_cents,
      items: o.items,
      createdAt: o.created_at,
      prepMinutes: o.prep_minutes,
      deliveryType: o.deliveryType || o.delivery_type || 'pickup',
      deliveryAddress: o.deliveryAddress || o.delivery_address || '',
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/customer', async (req, res) => {
  try {
    const { phone } = req.query;
    if (!phone) return res.status(400).json({ error: 'Téléphone requis' });
    const c = await getCustomerByPhone(phone.replace(/\s/g, ''));
    res.json({ exists: !!c, name: c?.name, orderCount: 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/fcm-token', async (req, res) => {
  try {
    const { phone, token } = req.body;
    if (!phone || !token) return res.status(400).json({ error: 'phone + token requis' });
    await saveFCMToken(phone.replace(/\s/g, ''), token);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── PAGES ────────────────────────────────────────────────
app.get('/confirmation', (req, res) => res.sendFile(resolve(__dirname, 'public/confirmation.html')));
app.get('/admin', (req, res) => res.sendFile(resolve(__dirname, 'public/admin.html')));
app.get('/cuisine', (req, res) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  res.sendFile(resolve(__dirname, 'public/cuisine.html'));
});

// ─── API: Admin ───────────────────────────────────────────
app.get('/api/admin/orders', async (req, res) => {
  try {
    const orders = await getActiveOrders();
    res.json(orders.map(o => ({
      orderNumber: o.order_number,
      status: o.status,
      phone: o.customer_phone,
      name: o.customer_name,
      items: o.items,
      totalCents: o.total_cents,
      prepMinutes: o.prep_minutes,
      deliveryType: o.deliveryType || o.delivery_type || 'pickup',
      deliveryAddress: o.deliveryAddress || o.delivery_address || '',
      createdAt: o.created_at,
      readyAt: o.ready_at,
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/order/:number/status', async (req, res) => {
  try {
    const { status } = req.body;
    if (!['preparing','ready','picked_up'].includes(status)) {
      return res.status(400).json({ error: 'Statut invalide' });
    }
    const order = await updateOrderStatus(parseInt(req.params.number), status);
    if (!order) return res.status(404).json({ error: 'Commande introuvable' });
    const num = order.order_number;
    if (status === 'preparing') sendPush(order.customer_phone, '👨‍🍳 En préparation', `Votre commande #${num} est en cours de préparation.`);
    else if (status === 'ready') sendPush(order.customer_phone, '🎉 Votre commande est prête !', `Commande #${num} — venez la récupérer.`);
    res.json({ ok: true, status: order.status });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── START ────────────────────────────────────────────────
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`[CUT Streetfood] Serveur prêt sur ${PUBLIC_URL}`);
  });
});
