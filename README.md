# Site vitrine — ONG Oxygène, Agir Contre l'Échec Scolaire (A.C.E.S)

Site statique (HTML + CSS + JS), sans base de données ni serveur.

- `src/` : sources (`index.html`, `site.js`, `input.css`, `_headers`, `404.html`)
- `images/` : photos réelles de l'ONG
- `docs/` : **site prêt à publier** (c'est ce dossier qu'il faut héberger)

## Publier
- **GitHub Pages** (actif) : Settings → Pages → branche `main`, dossier `/docs`.
- **Cloudflare Pages** : Workers & Pages → Create → Pages → Connect to Git → ce dépôt ; Build command : *vide* ; Output directory : `docs`.
- **Netlify** : Add new project → Import from Git → ce dépôt (le `netlify.toml` publie `docs`). Ou glisser le dossier `docs` sur https://app.netlify.com/drop

## Modifier puis reconstruire
```
npm i tailwindcss@4 @tailwindcss/cli@4 lucide-static @fontsource/inter @fontsource/fraunces
node build.mjs
```
