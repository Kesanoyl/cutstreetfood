/* ============================================================
   CUT Streetfood — Database (PostgreSQL / JSON fallback)
   ============================================================ */
import pg from 'pg';
import dotenv from 'dotenv';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

dotenv.config();
const __dirname = dirname(fileURLToPath(import.meta.url));

const DB_URL = process.env.DATABASE_URL;
const DATA_FILE = resolve(__dirname, 'data.json');

let pool = null;
if (DB_URL) {
  pool = new pg.Pool({ connectionString: DB_URL, ssl: { rejectUnauthorized: false } });
}

function jsonDb() {
  if (!existsSync(DATA_FILE)) writeFileSync(DATA_FILE, JSON.stringify({ orders:[], customers:[], seq:1000 }, null, 2));
  return JSON.parse(readFileSync(DATA_FILE, 'utf8'));
}
function saveJson(data) { writeFileSync(DATA_FILE, JSON.stringify(data, null, 2)); }

async function initDB() {
  if (!pool) return;
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS customers (
        id SERIAL PRIMARY KEY,
        phone TEXT UNIQUE NOT NULL,
        name TEXT,
        fcm_token TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        order_number INTEGER NOT NULL,
        customer_id INTEGER REFERENCES customers(id),
        customer_phone TEXT NOT NULL,
        customer_name TEXT,
        items JSONB NOT NULL,
        subtotal_cents INTEGER NOT NULL,
        total_cents INTEGER NOT NULL,
        stripe_session_id TEXT UNIQUE,
        status TEXT DEFAULT 'pending',
        prep_minutes INTEGER DEFAULT 15,
        delivery_type TEXT DEFAULT 'pickup',
        delivery_address TEXT DEFAULT '',
        delivery_fee INTEGER DEFAULT 0,
        ready_at TIMESTAMPTZ,
        picked_up_at TIMESTAMPTZ,
        notes TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
      ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_type TEXT DEFAULT 'pickup';
      ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_address TEXT DEFAULT '';
      ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_fee INTEGER DEFAULT 0;
      CREATE INDEX IF NOT EXISTS idx_orders_phone ON orders(customer_phone);
      CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
    `);
    console.log('[DB] PostgreSQL ready');
  } finally { client.release(); }
}

export async function getOrCreateCustomer(phone, name) {
  phone = phone.replace(/\s/g, '');
  if (pool) {
    const { rows } = await pool.query(
      `INSERT INTO customers (phone, name) VALUES ($1,$2)
       ON CONFLICT (phone) DO UPDATE SET name = COALESCE($2, customers.name)
       RETURNING *`, [phone, name]
    );
    return rows[0];
  } else {
    const db = jsonDb();
    let c = db.customers.find(c => c.phone === phone);
    if (!c) {
      c = { id: Date.now(), phone, name: name || '', fcm_token: null, created_at: new Date().toISOString() };
      db.customers.push(c);
      saveJson(db);
    } else if (name) { c.name = name; saveJson(db); }
    return c;
  }
}

export async function getCustomerByPhone(phone) {
  phone = phone.replace(/\s/g, '');
  if (pool) { const { rows } = await pool.query('SELECT * FROM customers WHERE phone = $1', [phone]); return rows[0] || null; }
  return jsonDb().customers.find(c => c.phone === phone) || null;
}

export async function saveFCMToken(phone, token) {
  phone = phone.replace(/\s/g, '');
  if (pool) { await pool.query('UPDATE customers SET fcm_token = $1 WHERE phone = $2', [token, phone]); }
  else { const db = jsonDb(); const c = db.customers.find(c => c.phone === phone); if (c) { c.fcm_token = token; saveJson(db); } }
}

export async function createOrder({ phone, name, items, subtotalCents, totalCents, stripeSessionId, prepMinutes, deliveryType, deliveryAddress, deliveryFee }) {
  phone = phone.replace(/\s/g, '');
  if (pool) {
    const { rows } = await pool.query(
      `INSERT INTO orders (order_number, customer_phone, customer_name, items, subtotal_cents, total_cents, stripe_session_id, status, prep_minutes, delivery_type, delivery_address, delivery_fee)
       VALUES ((SELECT COALESCE(MAX(order_number),1000)+1 FROM orders), $1,$2,$3,$4,$5,$6,'pending',$7,$8,$9,$10)
       RETURNING *`,
      [phone, name, JSON.stringify(items), subtotalCents, totalCents, stripeSessionId, prepMinutes, deliveryType||'pickup', deliveryAddress||'', deliveryFee||0]
    );
    return rows[0];
  } else {
    const db = jsonDb();
    const order = {
      id: Date.now(), order_number: db.seq || 1001, customer_phone: phone, customer_name: name,
      items, subtotal_cents: subtotalCents, total_cents: totalCents, stripe_session_id: stripeSessionId,
      status: 'pending', prep_minutes: prepMinutes,
      deliveryType: deliveryType || 'pickup', deliveryAddress: deliveryAddress || '', deliveryFee: deliveryFee || 0,
      ready_at: null, picked_up_at: null, notes: '', created_at: new Date().toISOString()
    };
    db.seq = (db.seq || 1000) + 1;
    db.orders.push(order);
    saveJson(db);
    return order;
  }
}

export async function getOrdersByPhone(phone) {
  phone = phone.replace(/\s/g, '');
  if (pool) { const { rows } = await pool.query('SELECT * FROM orders WHERE customer_phone = $1 ORDER BY created_at DESC LIMIT 50', [phone]); return rows; }
  return jsonDb().orders.filter(o => o.customer_phone === phone).sort((a,b) => b.id - a.id);
}

export async function getOrderBySession(sessionId) {
  if (pool) { const { rows } = await pool.query('SELECT * FROM orders WHERE stripe_session_id = $1', [sessionId]); return rows[0] || null; }
  return jsonDb().orders.find(o => o.stripe_session_id === sessionId) || null;
}

export async function updateOrderStatus(orderNumber, status) {
  if (pool) {
    const updates = ['status = $1']; const vals = [status];
    if (status === 'ready') { updates.push('ready_at = NOW()'); }
    if (status === 'picked_up') { updates.push('picked_up_at = NOW()'); }
    const { rows } = await pool.query(`UPDATE orders SET ${updates.join(', ')} WHERE order_number = $${vals.length+1} RETURNING *`, [...vals, orderNumber]);
    return rows[0] || null;
  } else {
    const db = jsonDb(); const o = db.orders.find(o => o.order_number === orderNumber);
    if (o) { o.status = status; if (status === 'ready') o.ready_at = new Date().toISOString(); if (status === 'picked_up') o.picked_up_at = new Date().toISOString(); saveJson(db); }
    return o;
  }
}

export async function getActiveOrders() {
  if (pool) { const { rows } = await pool.query("SELECT * FROM orders WHERE status IN ('paid','preparing','ready') ORDER BY created_at DESC"); return rows; }
  return jsonDb().orders.filter(o => ['paid','preparing','ready'].includes(o.status)).sort((a,b) => b.id - a.id);
}

export async function getOrderByNumber(orderNumber) {
  if (pool) { const { rows } = await pool.query('SELECT * FROM orders WHERE order_number = $1', [orderNumber]); return rows[0] || null; }
  return jsonDb().orders.find(o => o.order_number === orderNumber) || null;
}

export { initDB, pool };
