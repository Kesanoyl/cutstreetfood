/* ============================================================
   CUT STREETFOOD — app.js
   Menu · Cart · Checkout · Tracking
   ============================================================ */

// ═══ DATA ═══════════════════════════════════════════════════
// Carte CUT® — Grill Street Food · Maison de viandes · Paris 10 & Paris 11

// Les 2 adresses (retrait click & collect)
const RESTOS = [
  { id:'paris11', name:'Paris 11', addr:'4 rue Saint-Bernard, 75011 Paris',              tel:'09 87 16 25 11' },
  { id:'paris10', name:'Paris 10', addr:'33 rue du Faubourg Saint-Martin, 75010 Paris',  tel:'09 78 81 09 00' }
];

// Les 4 sauces maison (1 offerte avec la barquette, 2 avec la double/triple)
const SAUCES_CUT = ['Sauce Oignons Confits','Sauce Poivres','Sauce Tzatziki','Sauce du Chef'];

// Les sauces des Tenders
const SAUCES_TENDERS = ['Sauce Korean Style','Sauce Spicy','Sauce BBQ','Nature'];

// Les viandes slicées des barquettes
const VIANDES_CUT = [
  { name:'Onglet de bœuf 130 g',      price:0 },
  { name:'Poulet pané maison 130 g',  price:0 },
  { name:'Magret de canard 150 g',    price:1.00 }
];

// Cuisson (viandes rouges)
const CUISSONS = ['Bleue','Saignante','À point','Bien cuit'];

// Les accompagnements maison
const ACCOMPS = ['Fries persillées','Patates douces & poivrons','Hasselback parmesan/amandes/persil'];

// Boissons (incluses dans la Formule Midi)
const DRINKS = ['Citronnade Maison','Coca-Cola','Coca-Cola Zéro','Ice Tea','Oasis Tropical','San Pellegrino','Cristaline'];

// Suppléments payants
const SUPPS_CUT = [
  { name:'Cheddar fondu', price:1.00 },
  { name:'Raclette fondue', price:1.80 },
  { name:'Croquettes Chèvre-Miel (3 pièces)', price:6.00 },
  { name:'Brochettes de Poulet Satay', price:6.00 },
  { name:'DuckCheese', price:6.00 },
  { name:'Tenders Maison (3 pièces)', price:6.50 },
  { name:'Popcorn Chicken', price:6.50 }
];

// Consts héritées du moteur (composer générique) — non utilisées ici
const VIANDES = VIANDES_CUT.map(v => v.name);
const SAUCES = SAUCES_CUT;
const GRATINAGES = [];
const CRUDITES = [];

const MENU = [
  // ── formule midi (lun–ven, le midi) ──
  { id:'barquette-midi', cat:'midi', name:'Barquette Midi', desc:'Onglet de bœuf 130 g 🇫🇷, fries persillées, salade, une sauce maison et une boisson offerte. Du lundi au vendredi, le midi uniquement.', price:14.00, emoji:'☀️', img:'barquette-midi.webp', tag:'Formule Midi', tagClass:'tag-top' },

  // ── smart formules ──
  { id:'formule-solo', cat:'formules', name:'Formule SOLO', desc:'Es-tu prêt pour ce combat ? 🥊 Une entrée + une barquette + une boisson + un dessert.', price:25.00, emoji:'🥊', img:'formule-solo.webp', tag:'-3,10 €', tagClass:'tag-new' },
  { id:'formule-duo', cat:'formules', name:'Formule DUO', desc:'Trouve ton partenaire pour ce combat ⚔️ 2 entrées + 2 barquettes + 2 boissons + 2 desserts.', price:50.00, emoji:'⚔️', img:'formule-duo.webp', tag:'-6,20 €', tagClass:'tag-new' },
  { id:'chicken-fire', cat:'formules', name:'Chicken Fire 🐔🔥', desc:'Uniquement pour les adorateurs de poulet 😍 Ta formule 100 % poulet : 2 entrées de poulet + 1 barquette poulet pané.', price:22.00, emoji:'🔥', img:'chicken-fire.webp', tag:'-6,00 €', tagClass:'tag-new' },

  // ── barquettes (la signature CUT) ──
  { id:'barquette-simple', cat:'barquettes', name:'Barquette Simple', desc:'Le grand classique de chez CUT®. Une viande slicée, assaisonnée et nappée d\'une sauce maison, servie avec un accompagnement, salade et une sauce au choix.', price:15.00, emoji:'🥩', img:'barquette-simple.webp', tag:'Signature', tagClass:'tag-top' },
  { id:'barquette-double', cat:'barquettes', name:'Barquette Double', desc:'Deux viandes délicatement slicées et nappées de sauce maison, avec un accompagnement, salade et 2 sauces au choix.', price:20.00, emoji:'🥩', img:'barquette-double.webp' },
  { id:'barquette-triple', cat:'barquettes', name:'Barquette Triple', desc:'Pour les vrais meat lovers : trois viandes slicées, un accompagnement, salade et 2 sauces au choix.', price:25.00, emoji:'🔥', img:'barquette-triple.webp' },
  { id:'veggie-barquette', cat:'barquettes', name:'Veggie Barquette', desc:'Taboulé maison, patates douces fondantes, gaufre de patate douce et croquettes de chèvre-miel. La vie sans viande, c\'est pas mal aussi 🍃', price:13.00, emoji:'🍃', img:'veggie-barquette.webp' },

  // ── burger ──
  { id:'burger-poulet', cat:'burger', name:'Le Burger Poulet', desc:'Buns du boulanger, poulet crunchy, cheddar mature, salade et sauce CUT® secret 🤫. Servi avec un accompagnement au choix.', price:15.00, emoji:'🍔', img:'burger-poulet.webp' },

  // ── accompagnements (vendus seuls) ──
  { id:'fries-persillees', cat:'accompagnements', name:'Fries Persillées', desc:'Nos fries maison, avec une persillade maison.', price:6.00, emoji:'🍟', img:'fries-persillees.webp', tag:'Populaire', tagClass:'tag-top' },
  { id:'patates-douces', cat:'accompagnements', name:'Patates Douces', desc:'Patates douces fondantes, avec des poivrons rouges.', price:6.00, emoji:'🍠', img:'patates-douces.webp' },
  { id:'hasselback', cat:'accompagnements', name:'Hasselback', desc:'Pommes de terre suédoises, subtil mélange parmesan, persillade et amandes.', price:6.00, emoji:'🥔', img:'hasselback.webp' },

  // ── munchies ──
  { id:'tenders', cat:'munchies', name:'Tenders', desc:'3 tenders maison, panure cornflakes-granola-muesli, avec la sauce de ton choix.', price:6.50, emoji:'🍗', img:'tenders.webp', tag:'Populaire', tagClass:'tag-top' },
  { id:'croquettes-de-chevre-miel', cat:'munchies', name:'Croquettes de Chèvre-Miel', desc:'3 belles croquettes de chèvre et miel avec une panure maison aux céréales.', price:6.50, emoji:'🍯', img:'croquettes-de-chevre-miel.webp' },
  { id:'duckcheese', cat:'munchies', name:'DuckCheese', desc:'Aiguillettes de canard, cheddar et sauce yakitori.', price:6.50, emoji:'🦆', img:'duckcheese.webp' },
  { id:'brochettes-de-poulet-satay', cat:'munchies', name:'Brochettes de Poulet Satay', desc:'2 brochettes de poulet au satay, avec une sauce tzatziki maison.', price:6.50, emoji:'🍢', img:'brochettes-de-poulet-satay.webp' },
  { id:'popcorn-chicken', cat:'munchies', name:'Popcorn Chicken', desc:'Émincés de poulet panés, sirop d\'érable et sucre glace.', price:6.50, emoji:'🍿', img:'popcorn-chicken.webp', tag:'Nouveau', tagClass:'tag-new' },

  // ── desserts ──
  { id:'cookies-maison', cat:'desserts', name:'Cookies Maison', desc:'Fait maison chaque jour, au chocolat noir.', price:3.30, emoji:'🍪', img:'cookies-maison.webp' },
  { id:'granola-cut', cat:'desserts', name:'Granola CUT', desc:'Granola maison, délicieux et croquant.', price:4.40, emoji:'☀️', img:'granola-cut.webp' },
  { id:'tiramisu-oreo', cat:'desserts', name:'Tiramisù Oréo', desc:'Tiramisù maison aux éclats d\'Oreo.', price:4.40, emoji:'🍰', img:'tiramisu-oreo.webp' },
  { id:'tiramisu-speculoos', cat:'desserts', name:'Tiramisù Spéculoos', desc:'Tiramisù maison aux éclats de spéculoos.', price:4.40, emoji:'🍮', img:'tiramisu-speculoos.webp' },

  // ── boissons ──
  { id:'citronnade-maison', cat:'boissons', name:'Citronnade Maison', desc:'Préparée chaque matin.', price:3.30, emoji:'🍋', img:'citronnade-maison.webp', tag:'Maison', tagClass:'tag-new' },
  { id:'coca-cola', cat:'boissons', name:'Coca-Cola', desc:'Canette 33 cl.', price:3.30, emoji:'🥤', img:'coca-cola.webp' },
  { id:'coca-cola-zero', cat:'boissons', name:'Coca-Cola Zéro', desc:'Canette 33 cl.', price:3.30, emoji:'🥤', img:'coca-cola-zero.webp' },
  { id:'ice-tea', cat:'boissons', name:'Ice Tea', desc:'Canette 33 cl.', price:3.30, emoji:'🧊', img:'ice-tea.webp' },
  { id:'oasis-tropical', cat:'boissons', name:'Oasis Tropical', desc:'Canette 33 cl.', price:3.30, emoji:'🌴', img:'oasis-tropical.webp' },
  { id:'san-pellegrino', cat:'boissons', name:'San Pellegrino', desc:'Eau gazeuse 50 cl.', price:3.30, emoji:'💧', img:'san-pellegrino.webp' },
  { id:'cristaline', cat:'boissons', name:'Cristaline', desc:'Eau plate 50 cl.', price:3.30, emoji:'💧', img:'cristaline.webp' }
];

const CAT_NAMES = {
  'midi':'☀️ Formule Midi',
  'formules':'🧮 Smart Formules',
  'barquettes':'🥩 Les Barquettes',
  'burger':'🍔 Le Burger',
  'munchies':'🧀 Starters',
  'accompagnements':'🍟 Les Accompagnements',
  'desserts':'🍰 Desserts Maison',
  'boissons':'🥤 Boissons'
};
const CAT_ORDER = ['midi','formules','barquettes','burger','munchies','accompagnements','desserts','boissons'];

// ═══ OVERRIDES d'options par produit (survivent à une régénération du MENU) ═══
(function applyMenuOverrides(){
  const byId=Object.fromEntries(MENU.map(m=>[m.id,m]));
  // Suppléments + sauces en plus (1 € l'unité) — communs aux plats
  const extras={ sauces:true, sauceList:SAUCES_CUT, saucePrice:1.00, supps:SUPPS_CUT };

  // 1) Les Barquettes : viande(s) au choix + cuisson + accompagnement.
  //    ⚠️ UNE SEULE sauce offerte, quelle que soit la barquette — la 2e est un extra
  //    payant (règle confirmée par le commerçant, cf. leur carte Deliveroo).
  const barquette=(nbViandes)=>({
    viandeChoice:VIANDES_CUT, viandeMax:nbViandes,
    cuisson:CUISSONS,
    accompagnement:ACCOMPS,
    sauces:{ list:SAUCES_CUT, count:1 },
    extrasConfig:extras
  });
  byId['barquette-simple'].custom = barquette(1);
  byId['barquette-double'].custom = barquette(2);
  byId['barquette-triple'].custom = barquette(3);

  // 2) Veggie Barquette : pas de viande, juste sauce + suppléments
  byId['veggie-barquette'].custom = { sauces:{ list:SAUCES_CUT, count:1 }, extrasConfig:extras };

  // 3) Le Burger : accompagnement au choix + sauce + suppléments
  byId['burger-poulet'].custom = { accompagnement:ACCOMPS, sauces:{ list:SAUCES_CUT, count:1 }, extrasConfig:extras };

  // 4) Formule Midi : onglet de bœuf (cuisson) + sauce + boisson offerte
  byId['barquette-midi'].custom = { cuisson:CUISSONS, sauces:{ list:SAUCES_CUT, count:1 }, boissonMenu:DRINKS, extrasConfig:extras };

  // 5) Tenders : sauce dédiée
  byId['tenders'].custom = { sauces:{ list:SAUCES_TENDERS, count:1 } };

  // 6) Les autres starters : sauce maison en plus (payante)
  ['croquettes-de-chevre-miel','duckcheese','brochettes-de-poulet-satay','popcorn-chicken'].forEach(id=>{
    byId[id].custom = { extrasConfig:{ sauces:true, sauceList:SAUCES_CUT, saucePrice:1.00 } };
  });

  // 7) Les accompagnements vendus seuls : sauce en plus (payante)
  ['fries-persillees','patates-douces','hasselback'].forEach(id=>{
    byId[id].custom = { extrasConfig:{ sauces:true, sauceList:SAUCES_CUT, saucePrice:1.00 } };
  });

  // 8) Les Smart Formules : on fait composer chaque élément de la formule.
  const ENTREES=['Tenders','Croquettes de Chèvre-Miel','DuckCheese','Brochettes de Poulet Satay','Popcorn Chicken'];
  const ENTREES_POULET=['Tenders','Brochettes de Poulet Satay','Popcorn Chicken'];
  const DESSERTS=['Cookies Maison','Granola CUT','Tiramisù Oréo','Tiramisù Spéculoos'];
  const g=(key,label,short,icon,list)=>({key,label,short,icon,list});

  byId['formule-solo'].custom = { choices:[
    g('entree',  '🍗 Entrée au choix',        'Entrée',       '🍗', ENTREES),
    g('viande',  '🥩 Viande de la barquette', 'Viande',       '🥩', VIANDES_CUT),
    g('accomp',  '🍟 Accompagnement',         'Accomp.',      '🍟', ACCOMPS),
    g('sauce',   '🥫 Sauce au choix',         'Sauce',        '🥫', SAUCES_CUT),
    g('boisson', '🥤 Boisson',                'Boisson',      '🥤', DRINKS),
    g('dessert', '🍰 Dessert',                'Dessert',      '🍰', DESSERTS)
  ], cuisson:CUISSONS, extrasConfig:extras };

  byId['formule-duo'].custom = { choices:[
    g('entree',   '🍗 Entrée n°1',             'Entrée 1',    '🍗', ENTREES),
    g('entree2',  '🍗 Entrée n°2',             'Entrée 2',    '🍗', ENTREES),
    g('viande',   '🥩 Viande — barquette n°1', 'Viande 1',    '🥩', VIANDES_CUT),
    g('accomp',   '🍟 Accompagnement n°1',     'Accomp. 1',   '🍟', ACCOMPS),
    g('sauce',    '🥫 Sauce n°1',              'Sauce 1',     '🥫', SAUCES_CUT),
    g('viande2',  '🥩 Viande — barquette n°2', 'Viande 2',    '🥩', VIANDES_CUT),
    g('accomp2',  '🍟 Accompagnement n°2',     'Accomp. 2',   '🍟', ACCOMPS),
    g('sauce2',   '🥫 Sauce n°2',              'Sauce 2',     '🥫', SAUCES_CUT),
    g('boisson',  '🥤 Boisson n°1',            'Boisson 1',   '🥤', DRINKS),
    g('boisson2', '🥤 Boisson n°2',            'Boisson 2',   '🥤', DRINKS),
    g('dessert',  '🍰 Dessert n°1',            'Dessert 1',   '🍰', DESSERTS),
    g('dessert2', '🍰 Dessert n°2',            'Dessert 2',   '🍰', DESSERTS)
  ], cuisson:CUISSONS, extrasConfig:extras };

  byId['chicken-fire'].custom = { choices:[
    g('entree',  '🍗 Entrée poulet n°1', 'Entrée 1', '🍗', ENTREES_POULET),
    g('entree2', '🍗 Entrée poulet n°2', 'Entrée 2', '🍗', ENTREES_POULET),
    g('accomp',  '🍟 Accompagnement',    'Accomp.',  '🍟', ACCOMPS),
    g('sauce',   '🥫 Sauce au choix',    'Sauce',    '🥫', SAUCES_CUT)
  ], extrasConfig:extras };
})();

// ═══ STATE ═══════════════════════════════════════════════════
let cart = JSON.parse(localStorage.getItem('cutstreetfood_cart') || '[]');
let activeCat = 'all';
let editing = null, editState = {}, editQty = 1, editingCartIdx = -1;

// Composer state
let composerState = {
  type: 'tacos', viandes: [], gratinage: null,
  sauces: [], crudites: null, extras: [], menu: false, boisson: null
};
let viandeCount = 1, maxViandes = 2;

function saveCart() { localStorage.setItem('cutstreetfood_cart', JSON.stringify(cart)); }
function fmt(n) { return (Math.round(n*100)/100).toFixed(2).replace('.',',') + '€'; }

// ═══ INIT ════════════════════════════════════════════════════
const $ = id => document.getElementById(id);

if ('scrollRestoration' in history) { history.scrollRestoration = 'manual'; }
// Toujours arriver tout en haut au (re)chargement : on neutralise un eventuel
// hash (#menu, #hero...) qui ferait sauter le navigateur vers une section.
if (location.hash) { history.replaceState(null, '', location.pathname + location.search); }
window.scrollTo(0, 0);
window.addEventListener('load', () => window.scrollTo(0, 0));
document.addEventListener('DOMContentLoaded', () => {
  window.scrollTo(0, 0);
  renderMenu();
  initLoader();
  initNav();
  initCart();
  initProductModal();
  initComposer();
  initReveal();
  initCounters();
  initParticles();
  updateCartUI();
  // Fiabilise le ciblage des notifs : lie l'abonnement push au numéro déjà connu
  try{ const sc=JSON.parse(localStorage.getItem('cutstreetfood_customer')||'null'); if(sc&&sc.phone){(window.OneSignalDeferred=window.OneSignalDeferred||[]).push(o=>o.login(sc.phone.replace(/\s/g,''))); } }catch(e){}
  // Appareil de test : ouvrir le site une fois avec ?test=1 pour le taguer
  // "role=test" dans OneSignal (permet d'envoyer une notif à soi seul, même avec
  // des centaines de clients abonnés). ?test=0 retire le marquage.
  // addTag() ne crée aucun abonnement et n'appelle pas optIn() — sans effet de bord.
  try{
    const t = new URLSearchParams(location.search).get('test');
    if(t==='1') localStorage.setItem('cutstreetfood_tester','1');
    if(t==='0') localStorage.removeItem('cutstreetfood_tester');
    if(localStorage.getItem('cutstreetfood_tester')==='1'){
      (window.OneSignalDeferred=window.OneSignalDeferred||[]).push(o=>o.User.addTag('role','test'));
    }
  }catch(e){}
});

// ═══ LOADER ══════════════════════════════════════════════════
function initLoader() {
  // Fallback CSS gère déjà la disparition après 5s
  // Le JS accélère juste le processus
  const loader = $('loader');
  if (!loader) return;
  const hide = () => { loader.classList.add('hidden'); };
  window.addEventListener('load', () => setTimeout(hide, 300));
  // Fallback JS si window.load ne se déclenche pas
  setTimeout(hide, 4000);
}

// ═══ NAV ═════════════════════════════════════════════════════
function initNav() {
  // Scroll : un seul listener throttlé via requestAnimationFrame (évite les à-coups)
  const navEl = $('nav'), prog = $('scroll-progress'), backBtn = document.getElementById('back-to-top');
  let scrollTicking = false;
  function onScroll() {
    const y = window.scrollY;
    navEl.classList.toggle('scrolled', y > 40);
    prog.style.width = (y / (document.body.scrollHeight - innerHeight) * 100) + '%';
    if (backBtn) backBtn.classList.toggle('visible', y > 500);
    scrollTicking = false;
  }
  window.addEventListener('scroll', () => { if (!scrollTicking) { scrollTicking = true; requestAnimationFrame(onScroll); } }, {passive:true});

  const burger = $('nav-burger'), menu = $('nav-menu');
  const closeMenu = () => { burger.classList.remove('active'); menu.classList.remove('open'); document.body.classList.remove('nav-open'); };
  burger.addEventListener('click', e => { e.stopPropagation(); const open = menu.classList.toggle('open'); burger.classList.toggle('active', open); document.body.classList.toggle('nav-open', open); });
  menu.addEventListener('click', e => { if(e.target === menu) closeMenu(); });
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  $('nav-track').addEventListener('click', e => { e.preventDefault(); openTrack(); });
}

// ═══ RENDER MENU ═════════════════════════════════════════════
function renderMenu(filter = 'all') {
  activeCat = filter;
  const items = filter === 'all' ? MENU : MENU.filter(m => m.cat === filter);
  if (filter === 'all') {
    $('menu-grid').innerHTML = CAT_ORDER.map(cat => {
      const ci = items.filter(m => m.cat === cat);
      if (!ci.length) return '';
      return '<div class="menu-cat-header"><h3 class="menu-cat-title">'+CAT_NAMES[cat]+'</h3></div>' + ci.map((m,i) => card(m,i)).join('');
    }).join('');
  } else {
    $('menu-grid').innerHTML = items.map((m,i) => card(m,i)).join('');
  }
  $('menu-filters').querySelectorAll('.filter-pill').forEach(b => b.classList.toggle('active', b.dataset.cat === filter));
  // Ramène la pastille active dans la vue (la barre défile horizontalement)
  const activePill = $('menu-filters').querySelector('.filter-pill.active');
  if (activePill) activePill.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  $('menu-grid').querySelectorAll('.menu-card').forEach(el => {
    el.addEventListener('click', () => openModal(el.dataset.id));
  });
}

function card(m, i) {
  const img = m.img ? '<img src="img/menu/'+m.img+'" alt="'+m.name+'" loading="lazy" />' : '';
  const hasMenu = m.custom && m.custom.menu;
  const priceStr = hasMenu
    ? '<span class="menu-card-price">'+fmt(m.price)+' <small style="font-weight:400;color:var(--text-muted);">/ '+fmt(m.price + m.custom.menu)+' menu</small></span>'
    : '<span class="menu-card-price">'+fmt(m.price)+'</span>';
  return '<div class="menu-card" style="animation: cardIn 0.5s var(--ease-out) both; animation-delay:'+Math.min(i*0.03,0.5)+'s" data-id="'+m.id+'">'+
    '<div class="menu-card-img">'+(img||'<span class="menu-card-emoji">'+m.emoji+'</span>')+
    (m.tag?'<span class="menu-card-tag '+m.tagClass+'">'+m.tag+'</span>':'')+'</div>'+
    '<div class="menu-card-body"><h3>'+m.name+'</h3><p class="menu-card-desc">'+(m.desc||'&nbsp;')+'</p>'+
    '<div class="menu-card-footer">'+priceStr+
    '<span class="menu-card-add">+</span></div></div></div>';
}

$('menu-filters').addEventListener('click', e => {
  const pill = e.target.closest('.filter-pill');
  if (!pill) return;
  const cat = pill.dataset.cat;
  renderMenu(cat);
  // Scroll to the top of the menu grid (just under sticky nav+filters)
  setTimeout(() => {
    const grid = $('menu-grid');
    if (grid) {
      const el = grid.getBoundingClientRect();
      const stickyOffset = 130; // nav(56) + filters(~50) + margin
      window.scrollTo({ top: window.scrollY + el.top - stickyOffset, behavior: 'smooth' });
    }
  }, 100);
});

// ═══ VISUAL TACO COMPOSER ════════════════════════════════════
const MEAT_COLORS = {
  'Escalope Crème':'#e8d8c0','Escalope Curry':'#daa050','Escalope Tandoori':'#c4754a',
  'Escalope 4 Épices':'#b8956b','Steak':'#8b5a3c','Chicken Épicé':'#c46030',
  'Merguez':'#a0523b','Cordon Bleu':'#d4b896','Nuggets':'#daa06d','Fish':'#f0e0c0'
};
const GRATIN_COLORS = {
  'Mozzarella':'#f5f0d0','Gruyère':'#f0d880','Raclette':'#f5e0b0',
  'Chèvre':'#fafafa','Chèvre Miel':'#f5e0a0','Boursin':'#f5f0e0'
};
const SAUCE_COLORS = {
  'Ketchup':'#d03030','Mayo':'#fafae0','Harissa':'#c04020','Algérienne':'#e86030',
  'Burger':'#e0c878','Blanche':'#fafaf5','Curry':'#daa050','Andalouse':'#f08040',
  'Samouraï':'#f08040','Tartare':'#f5f0d0','Barbecue':'#8b3a20','Thaï':'#e06030',
  'Poivre':'#c0b090','Gruyère':'#f0d880'
};
const TYPE_NAMES = {tacos:'🌮 Tacos',gratine:'🧀 Tacos Gratinés',roule:'🌯 Roulé Gratiné',bol:'🥙 Bol Gratiné'};

function initComposer() {
  if(!document.getElementById('comp-step-type')) return; // composer retiré (Bikers Food)
  fillComposerOptions();
  updateComposerVisual();
  updateComposerPrice();

  // ── TYPE ──
  $('comp-step-type').addEventListener('click', e => {
    const btn = e.target.closest('.composer-toggle');
    if (!btn) return;
    $('comp-step-type').querySelectorAll('.composer-toggle').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    composerState.type = btn.dataset.val;
    maxViandes = (composerState.type === 'tacos' || composerState.type === 'gratine') ? 2 : 1;
    if (viandeCount > maxViandes) viandeCount = maxViandes;
    while (composerState.viandes.length > maxViandes) composerState.viandes.pop();
    document.getElementById('vc-count').textContent = viandeCount;
    const showGratin = composerState.type === 'gratine' || composerState.type === 'roule' || composerState.type === 'bol';
    $('comp-step-gratinage').style.display = showGratin ? '' : 'none';
    // Renumber: meat, crudites, sauces, menu, extras
    $('meat-step-num').textContent = showGratin ? '3' : '2';
    $('crudites-step-num').textContent = showGratin ? '4' : '3';
    $('sauces-step-num').textContent = showGratin ? '5' : '4';
    $('menu-step-num').textContent = showGratin ? '6' : '5';
    $('extras-step-num').textContent = showGratin ? '7' : '6';
    $('composer-badge').textContent = TYPE_NAMES[composerState.type];
    fillComposerOptions();
    updateComposerVisual();
    updateComposerPrice();
  });

  // ── VIANDES COUNT ──
  document.getElementById('vc-minus').addEventListener('click', () => {
    if (viandeCount <= 1) return; viandeCount--;
    while (composerState.viandes.length > viandeCount) composerState.viandes.pop();
    document.getElementById('vc-count').textContent = viandeCount;
    fillComposerOptions(); updateComposerVisual(); updateComposerPrice();
  });
  document.getElementById('vc-plus').addEventListener('click', () => {
    if (viandeCount >= maxViandes) return; viandeCount++;
    document.getElementById('vc-count').textContent = viandeCount;
    fillComposerOptions(); updateComposerVisual(); updateComposerPrice();
  });

  // ── VIANDES ──
  $('comp-meats').addEventListener('click', e => {
    const btn = e.target.closest('.composer-option');
    if (!btn) return;
    const val = btn.dataset.val, idx = composerState.viandes.indexOf(val);
    if (idx >= 0) { composerState.viandes.splice(idx,1); }
    else { if (composerState.viandes.length>=viandeCount) composerState.viandes.shift(); composerState.viandes.push(val); }
    fillComposerOptions(); updateComposerVisual(); updateComposerPrice();
  });

  // ── GRATINAGE ──
  $('comp-gratinages').addEventListener('click', e => {
    const btn = e.target.closest('.composer-option'); if (!btn) return;
    composerState.gratinage = btn.dataset.val;
    fillComposerOptions(); updateComposerVisual();
  });

  // ── CRUDITÉS ──
  $('comp-crudites').addEventListener('click', e => {
    const btn = e.target.closest('.composer-option'); if (!btn) return;
    composerState.crudites = btn.dataset.val;
    fillComposerOptions(); updateComposerVisual();
  });

  // ── SAUCES (2 gratuites, multi-pill) ──
  $('comp-sauces-multi').addEventListener('click', e => {
    const btn = e.target.closest('.composer-option'); if (!btn) return;
    const val = btn.dataset.val, idx = composerState.sauces.indexOf(val);
    if (idx >= 0) { composerState.sauces.splice(idx, 1); }
    else { if (composerState.sauces.length >= 2) composerState.sauces.shift(); composerState.sauces.push(val); }
    fillComposerOptions(); updateComposerVisual();
  });

  // ── MENU ──
  $('comp-menu-toggles').addEventListener('click', e => {
    const btn = e.target.closest('.composer-toggle'); if (!btn) return;
    composerState.menu = btn.dataset.val === 'oui';
    $('comp-menu-toggles').querySelectorAll('.composer-toggle').forEach(b => b.classList.toggle('active', b.dataset.val === (composerState.menu?'oui':'non')));
    $('comp-drink-group').style.display = composerState.menu ? '' : 'none';
    fillComposerOptions(); updateComposerVisual(); updateComposerPrice();
  });
  $('comp-drink-group').addEventListener('click', e => {
    const btn = e.target.closest('.composer-option'); if (!btn) return;
    composerState.boisson = btn.dataset.val; fillComposerOptions(); updateComposerVisual();
  });

  // ── EXTRAS ──
  $('comp-extras').addEventListener('click', e => {
    const btn = e.target.closest('.composer-option'); if (!btn) return;
    const val = btn.dataset.val, idx = composerState.extras.indexOf(val);
    if (idx>=0) composerState.extras.splice(idx,1); else composerState.extras.push(val);
    fillComposerOptions(); updateComposerVisual(); updateComposerPrice();
  });

  // ── ADD TO CART ──
  $('composer-add').addEventListener('click', () => {
    if (!composerState.viandes.length) { showToast('Choisis au moins une viande 🍖','error'); return; }
    if (composerState.menu && !composerState.boisson) { showToast('Choisis ta boisson menu 🥤','error'); return; }
    const price = getComposerPrice();
    const typeLabel = TYPE_NAMES[composerState.type];
    const parts = [];
    if ((composerState.type==='gratine'||composerState.type==='roule'||composerState.type==='bol') && composerState.gratinage) parts.push('Gratiné '+composerState.gratinage);
    parts.push(composerState.viandes.join(' + '));
    if (composerState.crudites) parts.push('Crudités: '+composerState.crudites);
    if (composerState.sauces.length) parts.push('Sauces: '+composerState.sauces.join('+'));
    if (composerState.menu && composerState.boisson) parts.push('Menu '+composerState.boisson);
    const baseLabel = parts.filter(Boolean).join(' • ');
    const extrasLabel = composerState.extras.length ? composerState.extras.join(', ') : '';
    const label = baseLabel + (extrasLabel ? ' • +'+extrasLabel : '');
    const isGrat = composerState.type==='gratine'||composerState.type==='roule'||composerState.type==='bol';
    const exSaC=[],exViC=[],exSuC=[];
    composerState.extras.forEach(nm=>{
      if(SAUCES.includes(nm))exSaC.push(nm);
      else if(VIANDES.includes(nm))exViC.push(nm);
      else exSuC.push(nm);
    });
    const comp=[];
    if(isGrat && composerState.gratinage)comp.push({i:'🧀',k:'Gratiné',base:[composerState.gratinage],extra:[]});
    if(composerState.viandes.length||exViC.length)comp.push({i:'🍖',k:'Viandes',base:composerState.viandes,extra:exViC});
    if(composerState.crudites)comp.push({i:'🥬',k:'Crudités',base:[composerState.crudites],extra:[]});
    if(composerState.sauces.length||exSaC.length)comp.push({i:'🥫',k:'Sauces',base:composerState.sauces,extra:exSaC});
    if(composerState.menu && composerState.boisson)comp.push({i:'🍟',k:'Menu',base:['Frites + '+composerState.boisson],extra:[]});
    if(exSuC.length)comp.push({i:'➕',k:'Suppléments',base:[],extra:exSuC});
    const suffix = composerState.viandes.length>1?' Maxi':' Simple';
    const name = typeLabel + suffix + ' Personnalisé';
    cart.push({ id:'composed_'+Date.now(), qty:1, custom:{...composerState}, price, label, baseLabel, extrasLabel, comp, name, emoji:'🌮' });
    saveCart(); updateCartUI(); pulseBadge();
    showToast(typeLabel + suffix + ' ajouté ! 🎉');
  });
}

function fillComposerOptions() {
  $('comp-meats').innerHTML = VIANDES.map(v =>
    '<button class="composer-option'+(composerState.viandes.includes(v)?' selected':'')+'" data-val="'+v+'">🍗 '+v+'</button>').join('');
  $('comp-gratinages').innerHTML = GRATINAGES.map(g =>
    '<button class="composer-option'+(composerState.gratinage===g?' selected':'')+'" data-val="'+g+'">🧀 '+g+'</button>').join('');
  $('comp-crudites').innerHTML = CRUDITES.map(c =>
    '<button class="composer-option'+(composerState.crudites===c?' selected':'')+'" data-val="'+c+'">🥬 '+c+'</button>').join('');
  $('comp-sauces-multi').innerHTML = SAUCES.map(s =>
    '<button class="composer-option'+(composerState.sauces.includes(s)?' selected':'')+'" data-val="'+s+'">🥫 '+s+'</button>').join('');
  const compSauces = SAUCES.map(s=>'<button class="composer-option'+(composerState.extras.includes(s)?' selected':'')+'" data-val="'+s+'">🥫 '+s+'</button>').join('');
  const compViandes = VIANDES.map(v=>'<button class="composer-option'+(composerState.extras.includes(v)?' selected':'')+'" data-val="'+v+'">🍗 '+v+'</button>').join('');
  const compSupps = SUPPS_TACOS.map(x=>'<button class="composer-option'+(composerState.extras.includes(x.name)?' selected':'')+'" data-val="'+x.name+'">➕ '+x.name+'<span class="pill-price">+'+x.price.toFixed(2).replace('.',',')+'€</span></button>').join('');
  $('comp-extras').innerHTML =
    '<div class="extras-block"><label class="custom-label sm">🥫 Sauces en plus <span class="custom-badge">+0,50€</span></label><div class="composer-options">'+compSauces+'</div></div>'+
    '<div class="extras-block"><label class="custom-label sm">🍗 Viande en plus <span class="custom-badge">+1,50€</span></label><div class="composer-options">'+compViandes+'</div></div>'+
    '<div class="extras-block"><label class="custom-label sm">➕ Suppléments</label><div class="composer-options">'+compSupps+'</div></div>';
  $('comp-drink-group').innerHTML = DRINKS.map(d =>
    '<button class="composer-option'+(composerState.boisson===d?' selected':'')+'" data-val="'+d+'">🥤 '+d+'</button>').join('');
}

function getComposerExtrasPrice(name){
  if(SAUCES.includes(name))return 0.50;
  if(VIANDES.includes(name))return 1.50;
  const s=SUPPS_TACOS.find(x=>x.name===name);
  return s?s.price:0;
}
function getComposerPrice() {
  const prices = { tacos:{1:7,2:10.90}, gratine:{1:8.90,2:12.90}, roule:{1:10.90,2:12.90}, bol:{1:8.90,2:8.90} };
  const base = (prices[composerState.type]&&prices[composerState.type][viandeCount])||7;
  const extrasTotal = composerState.extras.reduce((sum,name)=>sum+getComposerExtrasPrice(name),0);
  return base + extrasTotal + (composerState.menu?2:0);
}

function updateComposerPrice() {
  const p = getComposerPrice();
  $('composer-total').textContent = fmt(p);
  $('composer-btn-price').textContent = fmt(p);
  $('composer-price-badge').textContent = fmt(p);
}

function updateComposerVisual() {
  const stage = $('composer-stage');
  stage.querySelectorAll('.composer-layer,.composer-base-layer,.composer-ingredient').forEach(l=>l.remove());

  const items = [];
  const emoji = composerState.type === 'gratine' ? '🧀' :
               composerState.type === 'roule' ? '🌯' :
               composerState.type === 'bol' ? '🥙' : '🌮';
  const name = composerState.type === 'gratine' ? 'Tacos Gratiné' :
               composerState.type === 'roule' ? 'Roulé Gratiné' :
               composerState.type === 'bol' ? 'Bol Gratiné' : 'Tacos';

  if ((composerState.type === 'gratine' || composerState.type === 'roule' || composerState.type === 'bol') && composerState.gratinage) {
    items.push({em:'🧀', txt:'Gratiné '+composerState.gratinage});
  }
  if (composerState.viandes.length) items.push({em:'🍖', txt:composerState.viandes.join(' + ')});
  if (composerState.crudites) items.push({em:'🥬', txt:composerState.crudites});
  if (composerState.sauces.length) items.push({em:'🥫', txt:'Sauces : '+composerState.sauces.join(' + ')});
  if (composerState.menu && composerState.boisson) items.push({em:'🍟', txt:'Menu : '+composerState.boisson});
  if (composerState.extras.length) items.push({em:'➕', txt:composerState.extras.join(', ')});

  items.forEach((it,i)=>{
    const row = document.createElement('div');
    row.className = 'composer-ingredient';
    row.style.cssText = 'display:flex;align-items:center;gap:8px;padding:6px 10px;font-size:0.85rem;color:var(--text);'+
      'animation: fadeInRow 0.3s ease both;animation-delay:'+(i*0.06)+'s;';
    row.innerHTML = '<span style="font-size:1.1rem;">'+it.em+'</span><span>'+it.txt+'</span>';
    stage.appendChild(row);
  });

  $('composer-steam').innerHTML='';
}

const composerStyle = document.createElement('style');
composerStyle.textContent = '@keyframes fadeInRow{from{opacity:0;transform:translateX(-10px)}to{opacity:1;transform:translateX(0)}}';
document.head.appendChild(composerStyle);

// ═══ PRODUCT MODAL ════════════════════════════════════════════
function initProductModal() {
  $('custom-overlay').addEventListener('click', closeModal);
  $('custom-back').addEventListener('click', closeModal);
  $('custom-qty-minus').addEventListener('click', ()=>{if(editQty>1){editQty--;$('custom-qty-val').textContent=editQty;updatePrice();}});
  $('custom-qty-plus').addEventListener('click', ()=>{editQty++;$('custom-qty-val').textContent=editQty;updatePrice();});
  $('custom-add-btn').addEventListener('click', confirmProduct);
}

function openModal(itemId, existingCartItem) {
  const item = MENU.find(m=>m.id===itemId);
  if(!item)return;
  editing=item; editQty=existingCartItem?existingCartItem.qty:1;
  $('custom-qty-val').textContent=editQty;
  const c=item.custom||{};

  if(existingCartItem&&existingCartItem.custom){editState={...existingCartItem.custom};}
  else{
    editState={extras:[]};
    if(c.viandes){editState.nbViandes=c.viandes.min||1;editState.viandes=[];for(let i=0;i<editState.nbViandes;i++){editState.viandes.push(c.viandes.list[i]);}}
    if(c.gratinage)editState.gratinage=c.gratinage.value||c.gratinage.list[0];
    if(c.sauces){editState.sauceCount=c.sauces.count||2;editState.sauces=[c.sauces.list[0]];if(c.sauces.count>1)editState.sauces.push(c.sauces.list[1]||c.sauces.list[0]);}
    if(c.accompagnement)editState.accompagnement=Array.isArray(c.accompagnement)?c.accompagnement[0]:c.accompagnement;
    if(c.boissonMenu)editState.boissonMenu=c.boissonMenu[0];
    if(c.burgerChoice)editState.burgerChoice=c.burgerChoice[0];
    if(c.burger2Choice)editState.burger2Choice=c.burger2Choice[0];
    if(c.naanChoice)editState.naanChoice=c.naanChoice[0];
    if(c.viandeChoice){const mx=c.viandeMax||1;const free=c.viandeChoice.filter(v=>!v.price);const src=free.length>=mx?free:c.viandeChoice;editState.viandeChoice=src.slice(0,mx).map(v=>v.name);}
    if(c.portion)editState.portion=c.portion[0].name;
    if(c.nappage)editState.nappage=c.nappage[0];
    if(c.saveurChoice)editState.saveurChoice=c.saveurChoice[0];
    if(c.cuisson)editState.cuisson=c.cuisson[1]||c.cuisson[0];
    // Groupes de choix génériques (formules : entrée, barquette, boisson, dessert…)
    if(c.choices)c.choices.forEach(g=>{const f=g.list[0];editState[g.key]=(typeof f==='object'?f.name:f);});
    if(c.pain)editState.pain=c.pain[0];
    if(c.condiments)editState.condiments=[...(c.condiments.default||c.condiments.list)];
    if(c.plat)editState.plat=c.plat[0];
    if(c.crudites)editState.crudites='Salade+Tomates+Oignons';
    if(c.menu){editState.menu=false;editState.boissonMenu=DRINKS[0];editState.accompagnement='Frites';}
  }

  $('custom-title').textContent=item.emoji+' '+item.name;
  $('custom-add-btn').textContent=existingCartItem?'Modifier':'Ajouter au panier';
  // Show product description in modal header area
  const descEl = document.getElementById('custom-item-desc');
  if(descEl && item.desc) { descEl.textContent = item.desc; descEl.style.display = ''; }
  else if(descEl) { descEl.style.display = 'none'; }
  buildModalHTML(c);
  updatePrice();
  $('custom-modal').classList.add('open');$('custom-overlay').classList.add('open');
  lockScroll();
  // Toujours rouvrir le modal tout en haut, avec les choix par défaut
  $('custom-body').scrollTop=0;
  requestAnimationFrame(()=>{ $('custom-body').scrollTop=0; $('custom-modal').scrollTop=0; });

  setTimeout(()=>{
    // Pre-select toggles
    $('custom-body').querySelectorAll('.toggle-btn').forEach(btn=>{
      const k=btn.dataset.key,v=btn.dataset.val;
      let active=false;
      if(k==='crudites')active=editState.crudites===v;
      else if(k==='nbViandes')active=editState.nbViandes===parseInt(v);
      else if(k==='menu')active=(v==='oui')===!!editState.menu;
      else active=editState[k]===v;
      btn.classList.toggle('active',active);
    });
    // Sauces (multi)
    $('custom-body').querySelectorAll('.sauce-pill[data-key="sauces"]').forEach(p=>{
      p.classList.toggle('active',(editState.sauces||[]).includes(p.dataset.val));
    });
    // Extras
    $('custom-body').querySelectorAll('.sauce-pill[data-key="extras"]').forEach(p=>{
      p.classList.toggle('active',(editState.extras||[]).includes(p.dataset.val));
    });
    // Viandes
    updateViandePills();
    // Accompagnement
    $('custom-body').querySelectorAll('.sauce-pill[data-key="accompagnement"]').forEach(p=>{
      p.classList.toggle('active',editState.accompagnement===p.dataset.val);
    });
    // Gratinage
    $('custom-body').querySelectorAll('.sauce-pill[data-key="gratinage"]').forEach(p=>{
      p.classList.toggle('active',editState.gratinage===p.dataset.val);
    });
    // Menu toggle visibility
    const dg=$('drink-group');if(dg)dg.hidden=!editState.menu;
    // Boisson menu
    $('custom-body').querySelectorAll('.sauce-pill[data-key="boissonMenu"]').forEach(p=>{
      p.classList.toggle('active',editState.boissonMenu===p.dataset.val);
    });
    // Plat
    $('custom-body').querySelectorAll('.sauce-pill[data-key="plat"]').forEach(p=>{
      p.classList.toggle('active',editState.plat===p.dataset.val);
    });
    // Pain
    $('custom-body').querySelectorAll('.sauce-pill[data-key="pain"]').forEach(p=>{
      p.classList.toggle('active',editState.pain===p.dataset.val);
    });
    // Condiments (multi + Sans condiment)
    $('custom-body').querySelectorAll('.sauce-pill[data-key="condiments"]').forEach(p=>{
      if(p.dataset.val==='Sans condiment')p.classList.toggle('active',(editState.condiments||[]).length===0);
      else p.classList.toggle('active',(editState.condiments||[]).includes(p.dataset.val));
    });
    // Burger / Naan / Portion / Nappage / Saveur au choix (single-select)
    ['burgerChoice','burger2Choice','naanChoice','portion','nappage','saveurChoice','cuisson']
      .concat((c.choices||[]).map(g=>g.key)).forEach(k=>{
      $('custom-body').querySelectorAll('.sauce-pill[data-key="'+k+'"]').forEach(p=>{
        p.classList.toggle('active',editState[k]===p.dataset.val);
      });
    });
    // Viande au choix (multi)
    $('custom-body').querySelectorAll('.sauce-pill[data-key="viandeChoice"]').forEach(p=>{
      p.classList.toggle('active',(editState.viandeChoice||[]).includes(p.dataset.val));
    });
  },50);
}

function buildModalHTML(c) {
  let h='';
  // Groupes de choix génériques (formules) — rendus en premier, dans l'ordre déclaré
  if(c.choices)c.choices.forEach(g=>{
    h+='<div class="custom-group"><label class="custom-label">'+g.label+'</label><div class="sauce-grid">'+
      g.list.map(o=>{
        const nm=(typeof o==='object'?o.name:o), pr=(typeof o==='object'?o.price:0);
        return '<button class="sauce-pill" data-key="'+g.key+'" data-val="'+nm+'">'+nm+
          (pr>0?'<span class="pill-price">+'+pr.toFixed(2).replace('.',',')+'€</span>':'')+'</button>';
      }).join('')+'</div></div>';
  });
  // Burger au choix (formules)
  if(c.burgerChoice){h+='<div class="custom-group"><label class="custom-label">🍔 Burger au choix</label><div class="sauce-grid">'+c.burgerChoice.map(v=>'<button class="sauce-pill" data-key="burgerChoice" data-val="'+v+'">'+v+'</button>').join('')+'</div></div>';}
  // 2ème burger au choix (Duo)
  if(c.burger2Choice){h+='<div class="custom-group"><label class="custom-label">🍔 2ème burger au choix</label><div class="sauce-grid">'+c.burger2Choice.map(v=>'<button class="sauce-pill" data-key="burger2Choice" data-val="'+v+'">'+v+'</button>').join('')+'</div></div>';}
  // Naan au choix (formules)
  if(c.naanChoice){h+='<div class="custom-group"><label class="custom-label">🌯 Naan au choix</label><div class="sauce-grid">'+c.naanChoice.map(v=>'<button class="sauce-pill" data-key="naanChoice" data-val="'+v+'">'+v+'</button>').join('')+'</div></div>';}
  // Viande au choix (prix par item)
  if(c.viandeChoice){const mx=c.viandeMax||1;h+='<div class="custom-group"><label class="custom-label">🍖 Viande au choix'+(mx>1?' <span class="custom-hint">('+mx+' au choix)</span>':'')+'</label><div class="sauce-grid">'+c.viandeChoice.map(v=>'<button class="sauce-pill multi" data-key="viandeChoice" data-val="'+v.name+'">'+v.name+(v.price>0?'<span class="pill-price">+'+v.price.toFixed(2).replace('.',',')+'€</span>':'')+'</button>').join('')+'</div></div>';}
  // Portion (tex mex, prix par taille)
  if(c.portion){h+='<div class="custom-group"><label class="custom-label">🍽️ Portion</label><div class="sauce-grid">'+c.portion.map(v=>'<button class="sauce-pill" data-key="portion" data-val="'+v.name+'">'+v.name+(v.price>0?'<span class="pill-price">+'+v.price.toFixed(2).replace('.',',')+'€</span>':'')+'</button>').join('')+'</div></div>';}
  // Nappage (milkshake)
  if(c.nappage){h+='<div class="custom-group"><label class="custom-label">🍫 Nappage</label><div class="sauce-grid">'+c.nappage.map(v=>'<button class="sauce-pill" data-key="nappage" data-val="'+v+'">'+v+'</button>').join('')+'</div></div>';}
  // Saveur (milkshake)
  if(c.saveurChoice){h+='<div class="custom-group"><label class="custom-label">🥤 Saveur</label><div class="sauce-grid">'+c.saveurChoice.map(v=>'<button class="sauce-pill" data-key="saveurChoice" data-val="'+v+'">'+v+'</button>').join('')+'</div></div>';}
  if(c.cuisson){h+='<div class="custom-group"><label class="custom-label">🔥 Cuisson <span class="custom-hint">(viandes rouges)</span></label><div class="sauce-grid">'+c.cuisson.map(v=>'<button class="sauce-pill" data-key="cuisson" data-val="'+v+'">'+v+'</button>').join('')+'</div></div>';}
  // Gratinage
  if(c.gratinage){h+='<div class="custom-group"><label class="custom-label">🧀 Gratinage</label><div class="sauce-grid">'+c.gratinage.list.map(g=>'<button class="sauce-pill" data-key="gratinage" data-val="'+g+'">'+g+'</button>').join('')+'</div></div>';}
  // Viandes
  if(c.viandes&&c.viandes.max>c.viandes.min){const p=c.viandes.prices||[];h+='<div class="custom-group"><label class="custom-label">🍖 Nombre de viandes</label><div class="toggle-row">'+Array.from({length:c.viandes.max-c.viandes.min+1},(_,i)=>i+c.viandes.min).map(n=>'<button class="toggle-btn" data-key="nbViandes" data-val="'+n+'">'+n+' viande'+(n>1?'s':'')+(p[n-1]?' <small>'+fmt(p[n-1])+'</small>':'')+'</button>').join('')+'</div></div>';}
  if(c.viandes){
    const vmin=c.viandes.min||1,vmax=c.viandes.max||1;
    const title=vmin===vmax?'🍖 '+(vmin===1?'Choisissez votre viande':'Choisissez vos '+vmin+' viandes'):'🍖 Viandes <span id="vhint" style="color:var(--rojo-light);font-weight:700;">('+(editState.nbViandes||vmin)+'/'+vmax+')</span>';
    const subtitle='<p style="font-size:0.75rem;color:var(--text-muted);margin-bottom:6px;">'+(vmin===vmax?(vmin===1?'Sélectionnez 1 viande':'Sélectionnez '+vmin+' viandes'):'Cliquez pour choisir')+'</p>';
    h+='<div class="custom-group"><label class="custom-label">'+title+'</label>'+subtitle+'<div class="sauce-grid viande-grid">'+c.viandes.list.map(v=>'<button class="sauce-pill multi" data-key="viandes" data-val="'+v+'">'+v+'</button>').join('')+'</div></div>';
  }
  // Accompagnement
  if(c.accompagnement){const alist=Array.isArray(c.accompagnement)?c.accompagnement:[c.accompagnement];h+='<div class="custom-group"><label class="custom-label">🍟 Accompagnement</label><div class="sauce-grid">'+alist.map(v=>'<button class="sauce-pill" data-key="accompagnement" data-val="'+v+'">'+v+'</button>').join('')+'</div></div>';}
  // Crudités
  if(c.crudites){h+='<div class="custom-group"><label class="custom-label">🥬 Crudités</label><div class="sauce-grid">'+CRUDITES.map(v=>'<button class="sauce-pill" data-key="crudites" data-val="'+v+'">'+v+'</button>').join('')+'</div></div>';}
  // Pain (naan/sandwichs) — single-select
  if(c.pain){h+='<div class="custom-group"><label class="custom-label">🫓 Pain</label><div class="sauce-grid">'+c.pain.map(v=>'<button class="sauce-pill" data-key="pain" data-val="'+v+'">'+v+'</button>').join('')+'</div></div>';}
  // Condiments (multi, max) + "Sans condiment"
  if(c.condiments){const mx=c.condiments.max||5;h+='<div class="custom-group"><label class="custom-label">🥗 Condiments <span class="custom-hint">('+mx+' max)</span></label><div class="sauce-grid">'+c.condiments.list.map(v=>'<button class="sauce-pill multi" data-key="condiments" data-val="'+v+'">'+v+'</button>').join('')+'<button class="sauce-pill multi" data-key="condiments" data-val="Sans condiment">🚫 Sans condiment</button></div></div>';}
  // Menu toggle (burgers, sandwichs)
  if(c.menu){h+='<div class="custom-group"><label class="custom-label">🍟 En menu ? <span class="custom-badge">+'+fmt(c.menu)+' = frites + boisson 33 cl</span></label><div class="toggle-row"><button class="toggle-btn" data-key="menu" data-val="non">Non</button><button class="toggle-btn" data-key="menu" data-val="oui">Oui</button></div><div class="custom-group" id="drink-group" hidden><label class="custom-label">🥤 Boisson</label><div class="sauce-grid">'+DRINKS.map(d=>'<button class="sauce-pill" data-key="boissonMenu" data-val="'+d+'">'+d+'</button>').join('')+'</div></div></div>';}
  // Plat (enfant) — avant les sauces
  if(c.plat){h+='<div class="custom-group"><label class="custom-label">🍽️ Plat</label><div class="toggle-row">'+c.plat.map(v=>'<button class="toggle-btn" data-key="plat" data-val="'+v+'">'+v+'</button>').join('')+'</div></div>';}
  // Sauces (multi-count)
  if(c.sauces){const sc=c.sauces.count||2;h+='<div class="custom-group"><label class="custom-label">🥫 Sauces <span class="custom-hint">('+sc+(sc>1?' gratuites':' gratuite')+')</span></label><div class="sauce-grid">'+c.sauces.list.map(s=>'<button class="sauce-pill multi" data-key="sauces" data-val="'+s+'">'+s+'</button>').join('')+'</div></div>';}
  // Boisson menu standalone (only for items without menu toggle, like tacos menus)
  if(c.boissonMenu&&!c.menu){h+='<div class="custom-group"><label class="custom-label">🥤 Boisson</label><div class="sauce-grid">'+c.boissonMenu.map(d=>'<button class="sauce-pill" data-key="boissonMenu" data-val="'+d+'">'+d+'</button>').join('')+'</div></div>';}
  // Extras / Suppléments (toujours en dernier)
  const xc=c.extrasConfig;
  if(xc && (xc.sauces || xc.viandes || (xc.supps&&xc.supps.length))){
    let e='<div class="extras-head"><span class="extras-title">✨ Extras</span><span class="extras-note">Optionnel · en supplément</span></div>';
    if(xc.sauces){e+='<div class="extras-block"><label class="custom-label sm">🥫 Sauces en plus <span class="custom-badge">+'+(xc.saucePrice||0.50).toFixed(2).replace('.',',')+'€</span></label><div class="sauce-grid">'+xc.sauceList.map(s=>'<button class="sauce-pill multi" data-key="extras" data-val="'+s+'">'+s+'</button>').join('')+'</div></div>';}
    if(xc.viandes){e+='<div class="extras-block"><label class="custom-label sm">🍗 Viande en plus <span class="custom-badge">+1,50€</span></label><div class="sauce-grid">'+VIANDES.map(v=>'<button class="sauce-pill multi" data-key="extras" data-val="'+v+'">'+v+'</button>').join('')+'</div></div>';}
    if(xc.supps&&xc.supps.length){e+='<div class="extras-block"><label class="custom-label sm">➕ Suppléments</label><div class="sauce-grid">'+xc.supps.map(x=>'<button class="sauce-pill multi" data-key="extras" data-val="'+x.name+'">'+x.name+'<span class="pill-price">+'+x.price.toFixed(2).replace('.',',')+'€</span></button>').join('')+'</div></div>';}
    h+='<div class="custom-group extras-group">'+e+'</div>';
  }
  // No options
  const hasOpts=c.viandes||c.sauces||c.gratinage||c.accompagnement||c.crudites||c.plat||c.boissonMenu||c.menu||c.extrasConfig||c.pain||c.condiments||c.burgerChoice||c.burger2Choice||c.naanChoice||c.viandeChoice||c.portion||c.nappage||c.saveurChoice||c.cuisson||c.choices;
  if(!hasOpts){h+='<div class="custom-group" style="text-align:center;border-bottom:0"><p style="color:var(--text-dim);font-size:0.9rem;">'+(editing.desc||'')+'</p></div>';}
  $('custom-body').innerHTML=h;

  // Bind toggle buttons
  $('custom-body').querySelectorAll('.toggle-btn').forEach(btn=>{
    btn.addEventListener('click',(ev)=>{ev.stopPropagation();
      const k=btn.dataset.key,v=btn.dataset.val;
      btn.parentElement.querySelectorAll('.toggle-btn').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      if(k==='plat')editState.plat=v;
      else if(k==='menu'){editState.menu=v==='oui';const dg=$('drink-group');if(dg)dg.hidden=!editState.menu;}
      else if(k==='nbViandes'){editState.nbViandes=parseInt(v);const list=editing.custom?.viandes?.list||VIANDES;while(editState.viandes.length<editState.nbViandes){const a=list.find(x=>!editState.viandes.includes(x));if(a)editState.viandes.push(a);else break;}editState.viandes=editState.viandes.slice(0,editState.nbViandes);updateViandePills();const hv=$('vhint');if(hv)hv.textContent='('+editState.nbViandes+')';}
      updatePrice();
    });
  });

  // Single-select pills
  $('custom-body').querySelectorAll('.sauce-pill:not(.multi)').forEach(p=>{
    p.addEventListener('click',(ev)=>{ev.stopPropagation();
      const k=p.dataset.key,v=p.dataset.val;
      $('custom-body').querySelectorAll('.sauce-pill[data-key="'+k+'"]').forEach(x=>x.classList.remove('active'));
      p.classList.add('active');
      editState[k]=v;updatePrice();
    });
  });

  // Viandes (multi with max)
  $('custom-body').querySelectorAll('.sauce-pill[data-key="viandes"]').forEach(p=>{
    p.addEventListener('click',(ev)=>{ev.stopPropagation();
      const v=p.dataset.val,i=editState.viandes.indexOf(v);
      if(i>=0){editState.viandes.splice(i,1);if(editState.viandes.length===0){const list=editing.custom?.viandes?.list||VIANDES;const n=list.find(x=>x!==v);if(n)editState.viandes.push(n);}}
      else{if(editState.viandes.length>=editState.nbViandes)editState.viandes.shift();editState.viandes.push(v);}
      updateViandePills();updatePrice();
    });
  });

  // Sauces (multi with count limit)
  $('custom-body').querySelectorAll('.sauce-pill[data-key="sauces"]').forEach(p=>{
    p.addEventListener('click',(ev)=>{ev.stopPropagation();
      const v=p.dataset.val,i=(editState.sauces||[]).indexOf(v);
      if(i>=0){if(editState.sauces.length>1)editState.sauces.splice(i,1);}
      else{if(editState.sauces.length>=(editState.sauceCount||2))editState.sauces.shift();editState.sauces.push(v);}
      $('custom-body').querySelectorAll('.sauce-pill[data-key="sauces"]').forEach(x=>x.classList.toggle('active',(editState.sauces||[]).includes(x.dataset.val)));
      updatePrice();
    });
  });

  // Extras (multi, unlimited)
  $('custom-body').querySelectorAll('.sauce-pill[data-key="extras"]').forEach(p=>{
    p.addEventListener('click',(ev)=>{ev.stopPropagation();
      const v=p.dataset.val,i=(editState.extras||[]).indexOf(v);
      if(i>=0)editState.extras.splice(i,1);else editState.extras.push(v);
      p.classList.toggle('active');
      updatePrice();
    });
  });

  // Condiments (multi, max N, avec "Sans condiment")
  $('custom-body').querySelectorAll('.sauce-pill[data-key="condiments"]').forEach(p=>{
    p.addEventListener('click',(ev)=>{ev.stopPropagation();
      const v=p.dataset.val;const mx=(editing.custom&&editing.custom.condiments&&editing.custom.condiments.max)||5;
      if(!editState.condiments)editState.condiments=[];
      if(v==='Sans condiment'){editState.condiments=[];}
      else{const i=editState.condiments.indexOf(v);
        if(i>=0)editState.condiments.splice(i,1);
        else{if(editState.condiments.length>=mx)editState.condiments.shift();editState.condiments.push(v);}}
      $('custom-body').querySelectorAll('.sauce-pill[data-key="condiments"]').forEach(x=>{
        if(x.dataset.val==='Sans condiment')x.classList.toggle('active',editState.condiments.length===0);
        else x.classList.toggle('active',editState.condiments.includes(x.dataset.val));
      });
    });
  });

  // Viande au choix (multi, max = viandeMax, min 1)
  $('custom-body').querySelectorAll('.sauce-pill[data-key="viandeChoice"]').forEach(p=>{
    p.addEventListener('click',(ev)=>{ev.stopPropagation();
      const v=p.dataset.val;const mx=(editing.custom&&editing.custom.viandeMax)||1;
      if(!editState.viandeChoice)editState.viandeChoice=[];
      const i=editState.viandeChoice.indexOf(v);
      if(i>=0){if(editState.viandeChoice.length>1)editState.viandeChoice.splice(i,1);}
      else{if(editState.viandeChoice.length>=mx)editState.viandeChoice.shift();editState.viandeChoice.push(v);}
      $('custom-body').querySelectorAll('.sauce-pill[data-key="viandeChoice"]').forEach(x=>x.classList.toggle('active',editState.viandeChoice.includes(x.dataset.val)));
      updatePrice();
    });
  });
}

function updateViandePills(){
  $('custom-body').querySelectorAll('.sauce-pill[data-key="viandes"]').forEach(p=>{p.classList.toggle('active',(editState.viandes||[]).includes(p.dataset.val));});
}

function getExtraPrice(config, name){
  // Check if it's a sauce from the config's sauceList
  if(config.sauces && config.sauceList.includes(name)) return config.saucePrice||0.50;
  // Check if it's a viande
  if(config.viandes && VIANDES.includes(name)) return 1.50;
  // Check in supps
  if(config.supps){const s=config.supps.find(x=>x.name===name);if(s)return s.price;}
  return 0;
}

function updatePrice(){
  if(!editing)return;
  const c=editing.custom||{};let p=editing.price;
  if(c.viandes?.prices){const i=(editState.nbViandes||1)-1;if(c.viandes.prices[i])p=c.viandes.prices[i];}
  if(c.menu&&editState.menu)p+=c.menu;
  if(c.viandeChoice&&editState.viandeChoice){editState.viandeChoice.forEach(nm=>{const v=c.viandeChoice.find(x=>x.name===nm);if(v&&v.price)p+=v.price;});}
  if(c.portion&&editState.portion){const v=c.portion.find(x=>x.name===editState.portion);if(v&&v.price)p+=v.price;}
  if(c.choices)c.choices.forEach(g=>{const o=g.list.find(x=>typeof x==='object'&&x.name===editState[g.key]);if(o&&o.price)p+=o.price;});
  const xc=c.extrasConfig;
  const extrasTotal=xc?(editState.extras||[]).reduce((sum,name)=>sum+getExtraPrice(xc,name),0):0;
  p+=extrasTotal;
  $('custom-price').textContent=fmt(p*editQty);
}

function closeModal(){$('custom-modal').classList.remove('open');$('custom-overlay').classList.remove('open');unlockScroll();editing=null;editingCartIdx=-1;}

function confirmProduct(){
  if(!editing)return;
  const c=editing.custom||{};let p=editing.price;
  if(c.viandes?.prices){const i=(editState.nbViandes||1)-1;if(c.viandes.prices[i])p=c.viandes.prices[i];}
  if(c.menu&&editState.menu)p+=c.menu;
  if(c.viandeChoice&&editState.viandeChoice){editState.viandeChoice.forEach(nm=>{const v=c.viandeChoice.find(x=>x.name===nm);if(v&&v.price)p+=v.price;});}
  if(c.portion&&editState.portion){const v=c.portion.find(x=>x.name===editState.portion);if(v&&v.price)p+=v.price;}
  if(c.choices)c.choices.forEach(g=>{const o=g.list.find(x=>typeof x==='object'&&x.name===editState[g.key]);if(o&&o.price)p+=o.price;});
  const xc=c.extrasConfig;
  const extrasTotal=xc?(editState.extras||[]).reduce((sum,name)=>sum+getExtraPrice(xc,name),0):0;
  p+=extrasTotal;

  let l='';
  if(c.gratinage&&editState.gratinage)l+='Gratiné '+editState.gratinage;
  if(editState.viandes?.length)l+=(l?' • ':'')+editState.viandes.join('+');
  if((c.accompagnement||(c.menu&&editState.menu))&&editState.accompagnement)l+=(l?' • ':'')+editState.accompagnement;
  if(c.crudites&&editState.crudites)l+=(l?' • ':'')+'Crudités: '+editState.crudites;
  if(c.burgerChoice&&editState.burgerChoice)l+=(l?' • ':'')+'Burger: '+editState.burgerChoice;
  if(c.burger2Choice&&editState.burger2Choice)l+=(l?' • ':'')+'Burger 2: '+editState.burger2Choice;
  if(c.naanChoice&&editState.naanChoice)l+=(l?' • ':'')+'Naan: '+editState.naanChoice;
  if(c.viandeChoice&&editState.viandeChoice&&editState.viandeChoice.length)l+=(l?' • ':'')+'Viande: '+editState.viandeChoice.join('+');
  if(c.portion&&editState.portion)l+=(l?' • ':'')+editState.portion;
  if(c.nappage&&editState.nappage)l+=(l?' • ':'')+'Nappage: '+editState.nappage;
  if(c.saveurChoice&&editState.saveurChoice)l+=(l?' • ':'')+'Saveur: '+editState.saveurChoice;
  if(c.cuisson&&editState.cuisson)l+=(l?' • ':'')+'Cuisson: '+editState.cuisson;
  if(c.choices)c.choices.forEach(g=>{if(editState[g.key])l+=(l?' • ':'')+g.short+': '+editState[g.key];});
  if(c.pain&&editState.pain)l+=(l?' • ':'')+'Pain: '+editState.pain;
  if(c.condiments)l+=(l?' • ':'')+'Condiments: '+((editState.condiments&&editState.condiments.length)?editState.condiments.join('+'):'Sans');
  if(editState.sauces?.length)l+=(l?' • ':'')+'Sauces: '+editState.sauces.join('+');
  if((c.boissonMenu||(c.menu&&editState.menu))&&editState.boissonMenu)l+=(l?' • ':'')+'Boisson: '+editState.boissonMenu;
  if(c.plat&&editState.plat)l+=(l?' • ':'')+editState.plat;
  const baseLabel=l;
  const extrasLabel=editState.extras?.length?editState.extras.join(', '):'';
  if(extrasLabel)l+=(l?' • ':'')+'+'+extrasLabel;

  // Composants structures pour la fiche cuisine. Les extras sont ranges par
  // categorie (base = inclus, extra = supplement paye, affiche en orange).
  const exSauces=[],exViandes=[],exSupps=[];
  (editState.extras||[]).forEach(nm=>{
    if(xc&&xc.sauceList&&xc.sauceList.includes(nm))exSauces.push(nm);
    else if(VIANDES.includes(nm))exViandes.push(nm);
    else exSupps.push(nm);
  });
  const comp=[];
  if(c.menu&&editState.menu)comp.push({i:'🍟',k:'Menu',base:[(editState.accompagnement||'Frites')+' + '+(editState.boissonMenu||'boisson')],extra:[]});
  if(c.gratinage&&editState.gratinage)comp.push({i:'🧀',k:'Gratiné',base:[editState.gratinage],extra:[]});
  if((editState.viandes&&editState.viandes.length)||exViandes.length)comp.push({i:'🍖',k:'Viandes',base:editState.viandes||[],extra:exViandes});
  if(c.accompagnement&&editState.accompagnement)comp.push({i:'🍟',k:'Accomp.',base:[editState.accompagnement],extra:[]});
  if(c.crudites&&editState.crudites)comp.push({i:'🥬',k:'Crudités',base:[editState.crudites],extra:[]});
  if(c.burgerChoice&&editState.burgerChoice)comp.push({i:'🍔',k:'Burger',base:[editState.burgerChoice],extra:[]});
  if(c.burger2Choice&&editState.burger2Choice)comp.push({i:'🍔',k:'2ème burger',base:[editState.burger2Choice],extra:[]});
  if(c.naanChoice&&editState.naanChoice)comp.push({i:'🌯',k:'Naan',base:[editState.naanChoice],extra:[]});
  if(c.viandeChoice&&editState.viandeChoice&&editState.viandeChoice.length)comp.push({i:'🍖',k:'Viande',base:editState.viandeChoice,extra:[]});
  if(c.portion&&editState.portion)comp.push({i:'🍽️',k:'Portion',base:[editState.portion],extra:[]});
  if(c.nappage&&editState.nappage)comp.push({i:'🍫',k:'Nappage',base:[editState.nappage],extra:[]});
  if(c.saveurChoice&&editState.saveurChoice)comp.push({i:'🥤',k:'Saveur',base:[editState.saveurChoice],extra:[]});
  if(c.cuisson&&editState.cuisson)comp.push({i:'🔥',k:'Cuisson',base:[editState.cuisson],extra:[]});
  if(c.choices)c.choices.forEach(g=>{if(editState[g.key])comp.push({i:g.icon||'•',k:g.short,base:[editState[g.key]],extra:[]});});
  if(c.pain&&editState.pain)comp.push({i:'🫓',k:'Pain',base:[editState.pain],extra:[]});
  if(c.condiments)comp.push({i:'🥗',k:'Condiments',base:((editState.condiments&&editState.condiments.length)?editState.condiments:['Sans condiment']),extra:[]});
  if((editState.sauces&&editState.sauces.length)||exSauces.length)comp.push({i:'🥫',k:'Sauces',base:editState.sauces||[],extra:exSauces});
  if(c.boissonMenu&&editState.boissonMenu)comp.push({i:'🥤',k:'Boisson',base:[editState.boissonMenu],extra:[]});
  if(c.plat&&editState.plat)comp.push({i:'🍽️',k:'Plat',base:[editState.plat],extra:[]});
  if(exSupps.length)comp.push({i:'➕',k:'Suppléments',base:[],extra:exSupps});

  const wasEditing=editingCartIdx>=0;
  // Add "Menu" prefix to name if menu option selected
  const menuPrefix = (c.menu && editState.menu) ? 'Menu ' : '';
  const itemName = menuPrefix + (editing.name || editing.id);

  if(wasEditing){cart[editingCartIdx].custom={...editState};cart[editingCartIdx].price=p;cart[editingCartIdx].label=l;cart[editingCartIdx].baseLabel=baseLabel;cart[editingCartIdx].extrasLabel=extrasLabel;cart[editingCartIdx].comp=comp;cart[editingCartIdx].name=itemName;editingCartIdx=-1;}
  else{const ex=cart.find(ci=>ci.id===editing.id&&ci.label===l&&ci.price===p);if(ex){ex.qty+=editQty;ex.name=itemName;}else cart.push({id:editing.id,qty:editQty,custom:{...editState},price:p,label:l,baseLabel:baseLabel,extrasLabel:extrasLabel,comp:comp,emoji:editing.emoji,name:itemName});}
  saveCart();updateCartUI();pulseBadge();closeModal();
  showToast(wasEditing ? (itemName+' modifié ✏️') : (itemName+' ajouté ! 🎉'));
  if(wasEditing)openCart();
}

function editCartItem(idx){
  const ci=cart[idx];
  if(ci.id.startsWith('composed_')){composerState={...ci.custom};updateComposerUIFromState();editingCartIdx=idx;closeCart();$('composer').scrollIntoView({behavior:'smooth'});return;}
  const item=MENU.find(m=>m.id===ci.id);if(!item?.custom)return;editingCartIdx=idx;closeCart();openModal(item.id,ci);
}

function updateComposerUIFromState(){
  $('comp-step-type').querySelectorAll('.composer-toggle').forEach(b=>{b.classList.toggle('active',b.dataset.val===composerState.type);});
  viandeCount=composerState.viandes.length;$('vc-count').textContent=viandeCount;
  maxViandes = (composerState.type === 'tacos' || composerState.type === 'gratine') ? 2 : 1;
  if (!composerState.sauces || !composerState.sauces.length) composerState.sauces = ['Ketchup','Mayo'];
  const showGratin=composerState.type==='gratine'||composerState.type==='roule'||composerState.type==='bol';
  $('comp-step-gratinage').style.display=showGratin?'':'none';
  $('meat-step-num').textContent=showGratin?'3':'2';
  $('crudites-step-num').textContent=showGratin?'4':'3';
  $('sauces-step-num').textContent=showGratin?'5':'4';
  $('menu-step-num').textContent=showGratin?'6':'5';
  $('extras-step-num').textContent=showGratin?'7':'6';
  fillComposerOptions();
  $('comp-drink-group').style.display=composerState.menu?'':'none';
  $('comp-menu-toggles').querySelectorAll('.composer-toggle').forEach(b=>{b.classList.toggle('active',b.dataset.val===(composerState.menu?'oui':'non'));});
  $('composer-badge').textContent=TYPE_NAMES[composerState.type];
  updateComposerVisual();updateComposerPrice();
}

// ═══ CART ═════════════════════════════════════════════════════
function updateCartUI(){
  const n=cart.reduce((s,c)=>s+c.qty,0),t=cart.reduce((s,c)=>s+c.price*c.qty,0);
  $('cart-count').textContent=n;
  if(n>0){$('cart-badge').hidden=false;}else{$('cart-badge').hidden=true;}
  if(!cart.length){$('cart-items').innerHTML='<p class="cart-empty">🛒<br>Votre panier est vide.</p>';$('cart-footer').hidden=true;$('cart-total-price').textContent='0,00€';}
  else{
    $('cart-items').innerHTML=cart.map((c,idx)=>{
      const m=c.id.startsWith('composed_')?{emoji:c.emoji||'🌮',name:c.name||'Tacos Personnalisé'}:MENU.find(i=>i.id===c.id);
      if(!m)return'';
      const canEdit=c.id.startsWith('composed_')||(m.custom&&Object.keys(m.custom).length>0);
      // Recap: ingredients et extras sur deux lignes distinctes (fallback label pour anciens articles)
      let opts='';
      if(c.baseLabel!==undefined||c.extrasLabel!==undefined){
        if(c.baseLabel)opts+='<p class="cart-item-opts">'+c.baseLabel+'</p>';
        if(c.extrasLabel)opts+='<p class="cart-item-extras">➕ Extras : '+c.extrasLabel+'</p>';
      }else if(c.label){opts+='<p class="cart-item-opts">'+c.label+'</p>';}
      return'<div class="cart-item"><span class="cart-item-emoji">'+m.emoji+'</span><div class="cart-item-info"><p class="cart-item-name">'+(c.name||m.name)+'</p>'+opts+'<p class="cart-item-price">'+fmt(c.price)+'/u</p></div><div class="cart-item-right"><div class="cart-item-actions">'+(canEdit?'<button class="cart-item-edit" onclick="editCartItem('+idx+')">✎</button>':'')+'<button class="cart-item-remove" style="margin-left:6px;" onclick="cartRemove('+idx+')" title="Supprimer">✕</button></div><div class="cart-item-qty"><button class="qty-btn" onclick="cartQty('+idx+',-1)">−</button><span class="qty-val">'+c.qty+'</span><button class="qty-btn" onclick="cartQty('+idx+',1)">+</button></div><span class="cart-item-total">'+fmt(c.price*c.qty)+'</span></div></div>';
    }).join('');
    $('cart-footer').hidden=false;$('cart-total-price').textContent=fmt(t);
  }
}

function cartQty(idx,d){if(idx<0||idx>=cart.length)return;cart[idx].qty+=d;if(cart[idx].qty<=0)cart.splice(idx,1);saveCart();updateCartUI();}
function cartRemove(idx){cart.splice(idx,1);saveCart();updateCartUI();}
function pulseBadge(){$('cart-badge').classList.remove('pulse');void $('cart-badge').offsetWidth;$('cart-badge').classList.add('pulse');}

function initCart(){
  $('cart-badge').addEventListener('click',()=>$('cart-panel').classList.contains('open')?closeCart():openCart());
  $('cart-overlay').addEventListener('click',closeCart);
  $('cart-close').addEventListener('click',closeCart);
  $('cart-order-btn').addEventListener('click',()=>{closeCart();openCheckout();});
  $('cart-clear-btn').addEventListener('click',()=>{cart=[];saveCart();updateCartUI();closeCart();});
  initCheckout();
}
// Verrou de scroll robuste (iOS Safari ignore overflow:hidden sur body)
let _scrollLockY=0;
function lockScroll(){
  if(document.body.classList.contains('scroll-locked'))return;
  _scrollLockY=window.scrollY||window.pageYOffset||0;
  document.body.style.top=(-_scrollLockY)+'px';
  document.body.classList.add('scroll-locked');
}
function unlockScroll(){
  if(!document.body.classList.contains('scroll-locked'))return;
  document.body.classList.remove('scroll-locked');
  document.body.style.top='';
  // Restauration INSTANTANÉE de la position (le CSS scroll-behavior:smooth
  // ferait sinon défiler la page visiblement à la fermeture du modal).
  const html=document.documentElement;
  const prev=html.style.scrollBehavior;
  html.style.scrollBehavior='auto';
  window.scrollTo(0,_scrollLockY);
  html.style.scrollBehavior=prev;
}
function openCart(){$('cart-panel').classList.add('open');$('cart-overlay').classList.add('open');lockScroll();}
function closeCart(){$('cart-panel').classList.remove('open');$('cart-overlay').classList.remove('open');unlockScroll();}

// ═══ CHECKOUT ═════════════════════════════════════════════════
let orderMode='emporter';
let orderResto=RESTOS[0].id;
const restoLabel=()=>{const r=RESTOS.find(x=>x.id===orderResto)||RESTOS[0];return 'CUT Streetfood '+r.name+' — '+r.addr;};
// ═══ TÉLÉPHONE ════════════════════════════════════════════════
// Affichage groupé par 2 (07 12 12 12 12). On n'envoie JAMAIS les espaces au
// serveur / à OneSignal : le numéro stocké reste en chiffres bruts, sinon le
// suivi de commande ne retrouverait plus les commandes déjà enregistrées.
function phoneDigits(v){ return (v||'').replace(/\D/g,'').slice(0,10); }
function phonePretty(v){ return (phoneDigits(v).match(/\d{1,2}/g)||[]).join(' '); }
function bindPhoneInput(el){
  if(!el)return;
  el.addEventListener('input',()=>{
    const atEnd = el.selectionStart===el.value.length;
    const before = el.value.slice(0,el.selectionStart).replace(/\D/g,'').length;
    el.value = phonePretty(el.value);
    if(atEnd){ el.setSelectionRange(el.value.length,el.value.length); }
    else {
      // repositionne le curseur après le même nombre de chiffres saisis
      let seen=0,pos=el.value.length;
      for(let i=0;i<el.value.length;i++){ if(/\d/.test(el.value[i]))seen++; if(seen===before){pos=i+1;break;} }
      el.setSelectionRange(pos,pos);
    }
  });
}

function initCheckout(){
  $('checkout-back').addEventListener('click',closeCheckout);
  $('checkout-overlay').addEventListener('click',closeCheckout);
  $('checkout-pay-btn').addEventListener('click',startPayment);
  bindPhoneInput($('checkout-phone'));
  bindPhoneInput($('track-phone'));
  $('order-mode-row').addEventListener('click',(ev)=>{
    const btn=ev.target.closest('.toggle-btn');if(!btn)return;
    orderMode=btn.dataset.val;
    $('order-mode-row').querySelectorAll('.toggle-btn').forEach(b=>b.classList.toggle('active',b.dataset.val===orderMode));
  });
  // Restaurant de retrait — CUT Streetfood a 3 adresses
  const rr=$('resto-row');
  if(rr){
    rr.innerHTML=RESTOS.map(r=>'<button class="resto-btn'+(r.id===orderResto?' active':'')+'" data-val="'+r.id+'"><strong>'+r.name+'</strong><span>'+r.addr+'</span></button>').join('');
    rr.addEventListener('click',ev=>{
      const btn=ev.target.closest('.resto-btn');if(!btn)return;
      orderResto=btn.dataset.val;
      rr.querySelectorAll('.resto-btn').forEach(b=>b.classList.toggle('active',b.dataset.val===orderResto));
    });
  }
  const saved=JSON.parse(localStorage.getItem('cutstreetfood_customer')||'{}');
  if(saved.phone)$('checkout-phone').value=phonePretty(saved.phone);
  if(saved.name)$('checkout-name').value=saved.name;
  if(saved.resto&&RESTOS.some(r=>r.id===saved.resto)){
    orderResto=saved.resto;
    if(rr)rr.querySelectorAll('.resto-btn').forEach(b=>b.classList.toggle('active',b.dataset.val===orderResto));
  }
}

function openCheckout(){if(!cart.length){showToast('Panier vide !','error');return;}refreshCheckoutPrice();$('checkout-modal').classList.add('open');$('checkout-overlay').classList.add('open');lockScroll();}
function closeCheckout(){$('checkout-modal').classList.remove('open');$('checkout-overlay').classList.remove('open');unlockScroll();}

function refreshCheckoutPrice(){
  const total=cart.reduce((s,c)=>s+c.price*c.qty,0);
  const ti=cart.reduce((s,c)=>s+c.qty,0),eta=Math.max(10,Math.min(35,ti*2+8));
  $('checkout-total').textContent=fmt(total);
  $('checkout-btn-total').textContent=fmt(total);
  $('checkout-eta').textContent='~'+eta+' min';
}

// Lie l'abonnement push OneSignal au numéro de téléphone (alias external_id).
// ⚠️ Doit être ATTENDU avant de quitter la page : `login()` est une requête
// réseau, et la redirection vers Stripe l'annule en vol. Sans l'alias, le
// serveur envoie la notif « commande confirmée » (déclenchée dès le retour sur
// /confirmation) vers un destinataire inconnu → OneSignal répond
// « All included players are not subscribed » et la notif est perdue.
// Garde-fou : on ne retarde JAMAIS le paiement de plus de 3 s.
function linkPushToPhone(phone){
  return new Promise(resolve=>{
    let done=false;
    const finish=()=>{ if(!done){ done=true; resolve(); } };
    setTimeout(finish, 3000);
    try{
      (window.OneSignalDeferred=window.OneSignalDeferred||[]).push(async o=>{
        try{ await o.login(phone); }catch(e){}
        finish();
      });
    }catch(e){ finish(); }
  });
}

async function startPayment(){
  const phone=phoneDigits($('checkout-phone').value);
  if(phone.length<10){showToast('Téléphone requis (10 chiffres)','error');return;}
  // Démarre le rattachement de l'abonnement push en parallèle de la création
  // de la session Stripe (on l'attend juste avant de rediriger → 0 s perdue).
  const pushLinked = linkPushToPhone(phone);
  if($('checkout-remember').checked){localStorage.setItem('cutstreetfood_customer',JSON.stringify({phone,name:$('checkout-name').value.trim(),resto:orderResto}));}
  $('checkout-pay-btn').disabled=true;$('checkout-pay-btn').textContent='⏳ Préparation...';
  try{
    const res=await fetch('/api/create-checkout',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({cart:cart.map(c=>({name:c.name||(MENU.find(m=>m.id===c.id)?.name||'Article'),label:c.label,comp:c.comp||[],extras:c.extrasLabel||'',price:c.price,qty:c.qty})),phone,name:$('checkout-name').value.trim(),deliveryType:orderMode,deliveryAddress:restoLabel(),deliveryFee:0})});
    const data=await res.json();
    if(data.url){
      // Save order info for confirmation page fallback
      localStorage.setItem('cutstreetfood_last_order', JSON.stringify({
        orderNumber: data.orderNumber,
        prepMinutes: data.prepMinutes,
        items: cart.map(c=>({name:c.name||(MENU.find(m=>m.id===c.id)?.name||'Article'),label:c.label,price:c.price,qty:c.qty})),
        deliveryType: orderMode, deliveryAddress: restoLabel(),
        status: 'paid'
      }));
      // Le panier n'est PAS vidé ici : il reste tant que le paiement n'est
      // pas confirme (si l'utilisateur annule sur Stripe et revient).
      // Il sera vide sur la page de confirmation apres paiement reussi.
      // On s'assure que l'alias push est bien posé AVANT de quitter la page.
      await pushLinked;
      closeCheckout();window.location.href=data.url;
    }
    else throw new Error(data.error||'Erreur');
  }catch(err){showToast('Erreur: '+err.message,'error');$('checkout-pay-btn').disabled=false;$('checkout-pay-btn').innerHTML='💳 Payer <span>'+$('checkout-btn-total').textContent+'</span>';}
}

// ═══ TRACKING ═════════════════════════════════════════════════
function openTrack(){$('track-modal').classList.add('open');$('track-overlay').classList.add('open');lockScroll();const saved=JSON.parse(localStorage.getItem('cutstreetfood_customer')||'{}');if(saved.phone)$('track-phone').value=phonePretty(saved.phone);}
$('track-overlay').addEventListener('click',()=>{$('track-modal').classList.remove('open');$('track-overlay').classList.remove('open');unlockScroll();});
$('track-back').addEventListener('click',()=>{$('track-modal').classList.remove('open');$('track-overlay').classList.remove('open');unlockScroll();});
$('track-btn').addEventListener('click',async()=>{
  const phone=phoneDigits($('track-phone').value);if(!phone){showToast('Téléphone requis','error');return;}
  const $res=$('track-result');$res.innerHTML='<p style="color:var(--text-dim);text-align:center;">🔍 Recherche...</p>';
  try{
    const r=await fetch('/api/orders?phone='+encodeURIComponent(phone));const orders=await r.json();
    if(!orders.length){$res.innerHTML='<p style="text-align:center;color:var(--text-dim);">Aucune commande trouvée.</p>';return;}
    const st={pending:'⏳ En attente',paid:'✅ Payée',preparing:'👨‍🍳 En préparation',ready:'🎉 Prête !',picked_up:'🏃 Récupérée'};
    const sc={pending:'status-paid',paid:'status-paid',preparing:'status-preparing',ready:'status-ready',picked_up:''};
    $res.innerHTML=orders.map(o=>'<div class="track-order-card"><div class="track-order-header"><span class="track-order-num">#'+o.orderNumber+'</span><span class="track-status '+(sc[o.status]||'')+'">'+(st[o.status]||o.status)+'</span></div><div class="track-items">'+(o.items||[]).map(i=>i.name+' x'+(i.qty||1)).join(', ')+'</div><div class="track-time">🕐 '+(o.deliveryType==='surplace'?'Sur place':'À emporter')+' · '+new Date(o.createdAt).toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'})+(o.deliveryAddress?'<br>📍 '+o.deliveryAddress:'')+'</div></div>').join('');
  }catch(e){$res.innerHTML='<p style="text-align:center;color:var(--rojo);">Erreur</p>';}
});

// ═══ TOAST ════════════════════════════════════════════════════
function showToast(msg,type='success'){
  const toast=document.createElement('div');toast.className='toast '+type;toast.textContent=msg;document.body.appendChild(toast);
  setTimeout(()=>{toast.style.opacity='0';toast.style.transform='translateX(120%)';toast.style.transition='all 0.4s';},2500);
  setTimeout(()=>toast.remove(),3000);
}

// ═══ PARTICLES ════════════════════════════════════════════════
function initParticles(){
  const canvas=$('particles-canvas');if(!canvas)return;
  const reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Pas de particules sur mobile ni si "animations réduites" (gros gain de fluidité)
  if(reduce||innerWidth<768){canvas.style.display='none';return;}
  const ctx=canvas.getContext('2d');let particles=[];
  function resize(){canvas.width=innerWidth;canvas.height=innerHeight;}resize();window.addEventListener('resize',resize,{passive:true});
  class Particle{constructor(){this.reset();}
    reset(){this.x=Math.random()*canvas.width;this.y=canvas.height+20;this.size=Math.random()*2+0.5;this.speedY=-(Math.random()*0.4+0.15);this.speedX=(Math.random()-0.5)*0.3;this.opacity=Math.random()*0.5+0.15;this.life=0;this.maxLife=Math.random()*300+200;const cols=[[47,111,88],[62,138,109],[232,148,15],[242,194,48],[34,82,63]];this.color=cols[Math.floor(Math.random()*cols.length)];}
    update(){this.y+=this.speedY;this.x+=this.speedX+Math.sin(this.life*0.02)*0.2;this.life++;this.opacity=Math.max(0,this.opacity-0.001);if(this.life>this.maxLife||this.y<-20||this.opacity<=0)this.reset();}
    draw(c){c.beginPath();c.arc(this.x,this.y,this.size,0,Math.PI*2);c.fillStyle='rgba('+this.color.join(',')+','+this.opacity+')';c.fill();}
  }
  for(let i=0;i<16;i++){const p=new Particle();p.y=Math.random()*canvas.height;p.life=Math.random()*p.maxLife;particles.push(p);}
  let running=true;
  function animate(){if(!running)return;ctx.clearRect(0,0,canvas.width,canvas.height);particles.forEach(p=>{p.update();p.draw(ctx);});requestAnimationFrame(animate);}
  // Pause quand l'onglet n'est pas visible (économise CPU/batterie)
  document.addEventListener('visibilitychange',()=>{const was=running;running=!document.hidden;if(running&&!was)requestAnimationFrame(animate);});
  animate();
}

// ═══ REVEAL ═══════════════════════════════════════════════════
function initReveal(){const obs=new IntersectionObserver((e)=>{e.forEach(en=>{if(en.isIntersecting){en.target.classList.add('visible');obs.unobserve(en.target);}});},{threshold:0.15,rootMargin:'0px 0px -40px 0px'});document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));}

// ═══ COUNTERS ═════════════════════════════════════════════════
function initCounters(){const obs=new IntersectionObserver((e)=>{e.forEach(en=>{if(!en.isIntersecting)return;const el=en.target,target=parseFloat(el.dataset.count),suffix=el.dataset.suffix||'',decimals=parseInt(el.dataset.decimals||'0'),start=performance.now();function upd(now){const prog=Math.min((now-start)/2000,1),eased=1-Math.pow(1-prog,3);el.textContent=(target*eased).toFixed(decimals)+suffix;if(prog<1)requestAnimationFrame(upd);}requestAnimationFrame(upd);obs.unobserve(el);});},{threshold:0.5});document.querySelectorAll('.stat-num').forEach(el=>obs.observe(el));}

// ═══ KEYBOARD ═════════════════════════════════════════════════
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeModal();closeCart();closeCheckout();$('track-modal').classList.remove('open');$('track-overlay').classList.remove('open');unlockScroll();}});

// ═══ CSS ANIM ═════════════════════════════════════════════════
const cs=document.createElement('style');cs.textContent='@keyframes cardIn{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}';document.head.appendChild(cs);
