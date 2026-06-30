# Athanor

> Distillation quotidienne de veille technique.

**Athanor** est un site statique qui agrège, classe et synthétise la veille tech du jour
en un *digest* éditorialisé : un titre, une fenêtre temporelle, des thématiques par
catégorie, et les sources qui les sous-tendent. Une page **Tendances** complète le tout
avec un radar des thèmes de fond, signaux faibles et tensions structurantes.

🔗 En production : **[veille.y0no.fr](https://veille.y0no.fr)**

> *L'athanor* est le four des alchimistes, qui entretient une chaleur constante pour la
> transmutation lente de la matière. Ici, c'est le flux quotidien d'articles bruts qui se
> transmute en or distillé.

---

## Comment ça marche

Le contenu n'est **pas** rédigé à la main. Un workflow [n8n](https://n8n.io/) externe :

1. collecte les articles des flux (Hacker News, Korben, Journal du hacker, etc.) ;
2. les filtre, regroupe et synthétise (LLM) ;
3. produit un fichier JSON par jour et le **commit** dans `src/content/digests/` ;
4. met à jour `src/content/tendances.json` (le radar des tendances).

Chaque push sur `main` déclenche le build Astro et le déploiement sur GitHub Pages
(voir `.github/workflows/build.yml`). Le site lui-même ne contient donc **que** la mise en
forme — la donnée vient des commits automatiques (`N8N - Digest + tendances …`).

```
n8n  ──(commit JSON)──▶  GitHub  ──(Actions: astro build)──▶  GitHub Pages
```

La définition du workflow est versionnée ici même : [`workflows/n8n-daily-digest.json`](workflows/n8n-daily-digest.json).

## Le workflow n8n

Le fichier [`workflows/n8n-daily-digest.json`](workflows/n8n-daily-digest.json) est l'export
n8n complet du pipeline de veille. Grandes étapes :

1. **Retrieve entries** — récupère les entrées [Miniflux](https://miniflux.app/) des
   dernières 24 h (fenêtre sur `changed_after`, c.-à-d. la date d'ingestion dans Miniflux,
   pas la date de publication du flux — évite de rater les articles ingérés tardivement) ;
2. **Classify** — classe chaque article dans une des catégories via LLM ;
3. **Synthesize / Deep Dive** — regroupe par sujet et rédige les *ledes* éditoriaux ;
4. **Update Memory** — entretient un radar de tendances sur ~30 jours (`data/trends.json`) ;
5. **Commit** — pousse le digest du jour + les tendances dans ce dépôt ;
6. **Mark as read** — marque les entrées traitées comme lues dans Miniflux.

> ⚠️ **Export caviardé.** Hostnames, e-mails, dépôt cible et identifiants d'instance ont été
> remplacés par des placeholders (`example.com`, `owner/repo`, …) ; les credentials n8n ne
> contiennent **aucun secret** (n8n ne stocke jamais les valeurs dans l'export). Après import
> dans n8n, rebranche tes propres credentials, le sous-workflow d'enrichissement et les URLs.

## Stack

- **[Astro](https://astro.build/) 5** — génération 100 % statique (`output: "static"`)
- **TypeScript** + **Zod** pour la validation du schéma de contenu
- **[@astrojs/rss](https://docs.astro.build/en/guides/rss/)** pour le flux RSS
- Pas de framework front : composants `.astro` et CSS natif (variables CSS, polices Google `Cinzel` / `Montserrat`)

## Structure du projet

```
src/
├── content/
│   ├── digests/           # un JSON par jour (alimenté par n8n)
│   └── tendances.json     # radar des tendances (alimenté par n8n)
├── content.config.ts      # schéma Zod des digests (collection "digests")
├── pages/
│   ├── index.astro        # le digest le plus récent
│   ├── tendances.astro    # page Tendances (thèmes, signaux, tensions)
│   ├── archive/index.astro# calendrier de tous les digests
│   ├── digest/[date].astro# un digest daté
│   └── rss.xml.ts          # flux RSS
├── components/            # Masthead, Category, Topic, SourceCard, DigestView, …
├── layouts/BaseLayout.astro
└── utils/                 # colors (catégories), momentum, format, tags

workflows/
└── n8n-daily-digest.json  # export n8n caviardé du pipeline de veille
```

### Catégories

| slug      | libellé                | couleur d'accent |
|-----------|------------------------|------------------|
| `ia`      | IA                     | or `#d4af37`     |
| `infosec` | Infosec                | rouge `#fb2c36`  |
| `devops`  | DevOps                 | cyan `#22d3ee`   |
| `diy`     | DIY                    | vert `#00c758`   |
| `societe` | Société & régulation   | ambre `#fbbf24`  |

## Développement

Prérequis : **Node 20+**.

```bash
npm ci          # installer les dépendances
npm run dev     # serveur de dev sur http://localhost:4321
npm run build   # build statique dans dist/
npm run preview # prévisualiser le build
```

## Format d'un digest

Chaque fichier `src/content/digests/AAAA-MM-JJ.json` suit le schéma défini dans
`src/content.config.ts` :

```jsonc
{
  "date": "2026-05-13",
  "title_tag": "Digest tech-watch — 13 mai 2026",
  "headline": "Patch Tuesday record et vulnérabilités critiques à chainer",
  "window": { "from": "…", "to": "…", "count": "147 articles" },
  "alert": "",
  "categories": [
    {
      "slug": "ia",
      "name": "IA",
      "tagline": "…",
      "topics": [
        {
          "title": "Agents IA : fiabilité, interfaces et nouveaux paradigmes",
          "lede_html": "<strong>…</strong> texte enrichi en HTML inline …",
          "sources": [
            { "feed": "Hacker News", "date": "12/05 16:24", "url": "https://…", "title": "…" }
          ]
        }
      ]
    }
  ],
  "appendix": [ { "url": "https://…", "title": "…", "note": "" } ],
  "footer": ""
}
```

Les champs texte optionnels (`tagline`, `title_tag`, `alert`, `note`, `footer`) tolèrent
`null`, `undefined` ou l'absence de clé — ils sont normalisés vers une chaîne vide.

## Déploiement

Automatique via GitHub Actions à chaque push sur `main` :
`npm ci` → `npm run build` → upload de `dist/` → déploiement GitHub Pages.

---

*Construit avec [Astro](https://astro.build/) · alimenté par [n8n](https://n8n.io/).*
