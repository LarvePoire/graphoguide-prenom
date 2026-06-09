<div align="center">

# ✏️ GraphoGuide — Mon prénom à tracer

**Un générateur de fiches d'écriture pour apprendre à tracer un prénom**, lettre par lettre,
à l'aide de **flèches colorées** qui indiquent l'ordre et le sens de chaque trait.

Pensé pour les enfants (maternelle / CP) et les parents — une fiche prête à imprimer en un clic.

![AdonisJS](https://img.shields.io/badge/AdonisJS-v7-5A45FF?style=flat-square&logo=adonisjs&logoColor=white)
![React](https://img.shields.io/badge/React-19-149ECA?style=flat-square&logo=react&logoColor=white)
![Inertia](https://img.shields.io/badge/Inertia.js-v2-9553E9?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=flat-square&logo=vite&logoColor=white)

<br />

### [🔗 **Voir la démo en ligne**](https://graphoguide.larvepoire.app/)

**[graphoguide.larvepoire.app](https://graphoguide.larvepoire.app/)**

</div>

---

## ✨ Fonctionnalités

- 🖊️ **Saisie d'un prénom** (jusqu'à 10 lettres, **accents gérés** : é, è, ê, ë, à, ç, ñ…)
- 🌈 **Lettres en flèches colorées** : chaque trait a une couleur selon son ordre d'écriture
- 🎨 **Style des flèches** : trait plein ou pointillés
- 📐 **Lignes de cahier** activables (ligne haute, médiane pointillée, ligne de base)
- 🧭 **Légende intégrée** : « 1er trait », « 2e trait »… avec le code couleur
- ⬇️ **Téléchargement de la fiche en PNG**, prête à imprimer
- ⚡ **100 % côté client** : le dessin est généré dans un `<canvas>`, aucune donnée n'est envoyée au serveur

---

## 🧱 Stack technique

| Domaine | Technologie |
| --- | --- |
| Backend | [AdonisJS v7](https://adonisjs.com) (TypeScript) |
| Frontend | [React 19](https://react.dev) + [Inertia.js v2](https://inertiajs.com) |
| Build / HMR | [Vite 7](https://vitejs.dev) |
| Styles | SCSS (architecture `abstracts` / `base` / `pages`) |
| Rendu de la fiche | Canvas 2D natif |
| Sessions | Cookie (aucune base de données requise) |

> 💡 Le projet est volontairement **minimaliste** : pas de base de données, pas d'authentification,
> pas de Redis ni de service mail. Juste ce qu'il faut pour servir la page.

---

## 🚀 Démarrage rapide

### Prérequis

- **Node.js ≥ 24**
- **npm**

### Installation

```bash
# 1. Cloner le dépôt
git clone <url-du-repo>
cd graphoguide_prenom

# 2. Installer les dépendances
npm install

# 3. Créer le fichier d'environnement
cp .env.example .env

# 4. Générer une clé d'application (APP_KEY)
node ace generate:key

# 5. Lancer le serveur de développement
npm run dev
```

L'application est alors disponible sur **http://localhost:3333** 🎉

---

## 📜 Scripts disponibles

| Commande | Description |
| --- | --- |
| `npm run dev` | Serveur de développement avec HMR |
| `npm run build` | Build de production |
| `npm start` | Démarre le serveur de production (`build/`) |
| `npm run typecheck` | Vérification des types (backend + Inertia) |
| `npm run lint` | Analyse ESLint |
| `npm run format` | Formatage Prettier |
| `npm test` | Suite de tests (Japa) |

---

## 📁 Structure du projet

```
graphoguide_prenom/
├── app/
│   ├── exceptions/         # Gestion des erreurs HTTP
│   └── middleware/         # Middleware Inertia + container bindings
├── config/                 # Configuration AdonisJS (session, vite, inertia…)
├── inertia/
│   ├── css/                # SCSS (abstracts, base, pages)
│   ├── layouts/            # Layout racine
│   └── pages/
│       └── home.tsx        # 🎯 La page « prénom à tracer » (logique canvas)
├── resources/views/        # Template HTML racine (Edge)
├── start/
│   ├── routes.ts           # Routes (uniquement « / »)
│   └── kernel.ts           # Pile de middleware
└── package.json
```

Le cœur de l'application tient dans **`inertia/pages/home.tsx`** : il contient la table des glyphes
(chaque lettre décrite comme une suite de flèches) et le moteur de rendu Canvas.

---

## 🎨 Comment fonctionne le tracé ?

Chaque lettre est définie comme une liste de **traits dirigés** (flèches), dans l'ordre où on les écrit.
Les coordonnées sont normalisées sur une grille `0..100` en hauteur, puis mises à l'échelle au moment du rendu.

- Les traits **courbes** (`curve`) sont échantillonnés via des courbes de Bézier quadratiques.
- Les **accents** (`mark`) sont dessinés dans la couleur du premier trait.
- La **couleur** de chaque flèche suit son rang : 1ᵉʳ trait rose, 2ᵉ bleu, 3ᵉ vert, etc.

Le résultat est rendu dans un `<canvas>` haute résolution (×2) puis exporté en PNG.

---

## 📄 Licence

Projet privé — tous droits réservés.

<div align="center">

Fait avec ❤️ pour accompagner les premiers pas en écriture.

</div>
