# Portfolio — Bastien Youssfi

Site one-page (Vite + React) construit autour d'un **système de tokens CSS strict** :
aucune couleur, police, taille ou espacement n'est écrit en dur dans les composants —
tout passe par une variable définie dans `src/styles/tokens.css`.

## Démarrer

```bash
npm install
npm run dev      # serveur de dev (http://localhost:5173)
npm run build    # build de production -> dist/
npm run preview  # prévisualiser le build
```

## Où modifier quoi

| Je veux changer…                          | Fichier                                   |
| ----------------------------------------- | ----------------------------------------- |
| Une couleur, police, taille, ombre, radius | `src/styles/tokens.css` (source unique)   |
| Le texte / les liens / les cas clients     | `src/data/content.js`                     |
| La structure d'une section                 | `src/components/sections/*`               |
| Un composant réutilisable                  | `src/components/ui/*`                      |
| Le layout global (nav, page, footer)       | `src/components/layout/*`                  |

### Règle d'or des tokens

Dans n'importe quel `*.module.css`, on n'écrit **jamais** `#15614a`, `18px` ou
`'Gabarito'`. On écrit `var(--color-accent)`, `var(--text-2xl)`,
`var(--font-display)`. Pour changer l'identité visuelle, il suffit d'éditer
`tokens.css` — tout le site suit.

Les tokens sont regroupés par catégorie : couleurs (primitives, alpha,
dégradés), typographie (familles, poids, échelle de tailles, interlignage,
interlettrage), espacements, rayons, bordures, ombres, effets/motion et layout.

## Architecture

```
src/
├── styles/
│   ├── tokens.css        # ← source unique de toutes les valeurs de design
│   └── global.css        # reset + styles d'éléments de base (tokens only)
├── data/
│   └── content.js        # tout le contenu éditable (textes, liens, cas…)
├── hooks/
│   └── useReveal.js       # apparition au scroll (IntersectionObserver)
├── utils/
│   └── renderRich.jsx     # rend les fragments de texte enrichi (accent, gras…)
├── components/
│   ├── ui/               # briques réutilisables : Button, Card, Stat, Section,
│   │                     #   Screenshot, Avatar, Eyebrow, Reveal, SectionHeading
│   ├── layout/           # Page (canvas), Navbar, Footer
│   └── sections/         # Hero, Problem, Cases (+Case), Offer (+Package),
│                         #   About, FinalCta
└── App.jsx               # assemble les sections dans la page
```

Le contenu étant séparé du markup, ajouter un cas client ou un package =
ajouter un objet dans `content.js`, sans toucher au code des composants.
