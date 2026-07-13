# CUT Streetfood — Site Click & Collect

## Résumé
Site de commande en ligne pour **CUT Streetfood**, snack halal à Bagnolet (7 rue Xavier Marmier, 25000).
Kebab · Burgers · Tacos · Assiettes · Cheesy Box. Frites et sauces maison, 100% halal.
Commande + paiement en ligne + suivi de commande.

Dupliqué du moteur **Ô Suprême Burger** / **Bikers Food** (Node/Express + Stripe + Postgres/JSON fallback),
avec carte, thème et coordonnées refaits pour CUT Streetfood.

## Stack
- **Backend** : Node.js + Express (`server.js`), ES modules
- **Base de données** : PostgreSQL (Neon) via `DATABASE_URL`. Fallback `data.json` sans DB.
- **Paiement** : Stripe Checkout (clés **test** par défaut)
- **Frontend** : HTML/CSS/JS pur dans `public/` — mobile-first
- **Carte** : en dur dans `public/app.js` (const `MENU`), **9 catégories / 33 produits**,
  parsée depuis leur export Uber Eats + leurs 4 affiches de menu (les **prix boutique des affiches**
  font foi, ils sont moins chers que ceux d'Uber Eats).

## Carte & options
- **Formule +3,00 €** (frites maison + boisson 33 cl) sur sandwichs, burgers et tacos → `custom.menu:3.00`.
- **Sauce au choix** (1 gratuite) : Blanche, Fromagère maison, Mayo, Ketchup, Algérienne, Harissa,
  Samouraï, BBQ, Andalouse, Sans sauce.
- **Viandes au choix** : Poulet mariné, Poulet crème, Steak frais, Kebab, Tenders, Nuggets
  (tacos & sandwich Mixte) ; Kebab, Steak frais, Poulet crème, Poulet mariné (assiettes & riz viande).
- **Suppléments** : Cheddar / Raclette / Œuf / Bacon 1 € · Poivrons 1 € (tacos) · Feta 2 € ·
  Steak frais et Kebab 2,50 €.
- Toute la config par produit est dans le bloc `applyMenuOverrides()` de `public/app.js`
  (il survit à une régénération du `MENU`).

## Design — thème « affiche »
Palette et typo reprises de **leurs propres affiches de menu** (fond papier gris clair, titres vert
sauge à contour foncé, étiquettes jaunes à texte noir, prix orange) :
- `--rojo: #2F6F58` (vert sauge) — couleur d'action (boutons, pills actives)
- `--fuego: #E8940F` (orange) — prix
- `--oro:  #F2C230` (jaune) — étiquettes / badges
- `--bg:   #E7E6E3` (papier) — fond, avec grain fractal SVG en `body::before`
- Polices : Josefin Sans (titres, en small-caps) + Inter (texte)

Les **photos produits sont découpées dans leurs 4 affiches** (fond papier `#e9e9e7`, `object-fit:contain`),
donc elles s'intègrent au fond du site. 29 images dans `public/img/menu/`.
Sans photo (emoji de repli) : Ice Tea, Capri-Sun.

## Coordonnées
- Adresse : 23 rue François Mitterrand, 93170 Bagnolet
- Horaires : Dim 16h–23h · Lun fermé · Mar–Jeu 18h–1h · Ven–Sam 18h–2h
- **Téléphone : inconnu** (absent de leur fiche Uber Eats) — à récupérer et à ajouter dans la section
  Contact de `public/index.html`.

## À savoir
- **Notifications push OneSignal désactivées** : le SDK est commenté dans `public/index.html` car
  l'App ID hérité était celui d'Ô Suprême. Créer une app OneSignal dédiée et coller son App ID
  pour réactiver (le code serveur `sendPush()` est intact, il ne fait rien sans `ONESIGNAL_REST_API_KEY`).
- Position sur la carte OSM (47.2437, 6.0206) : **approximative**, à vérifier.
- Le « Composer » de tacos de La Marinade est retiré (carte à base de produits fixes).

## Lancer en local
```bash
npm install
npm start        # http://localhost:3000
npm run dev      # avec --watch
```

## Variables d'environnement (.env)
```
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
DATABASE_URL=postgresql://...   # optionnel, fallback data.json
PUBLIC_URL=http://localhost:3000
PORT=3000
```
