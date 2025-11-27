# 📖 NAHB - Not Another Hero's Book

**Un projet fullstack de création et de lecture d'histoires interactives**

[![Status](https://img.shields.io/badge/Status-Active-brightgreen)]() 
[![Level](https://img.shields.io/badge/Level-18/20-blue)]()
[![Node](https://img.shields.io/badge/Node-18+-green)]()
[![React](https://img.shields.io/badge/React-18+-61DAFB?logo=react)]()
[![MongoDB](https://img.shields.io/badge/MongoDB-6+-47A248?logo=mongodb)]()

---

## 🎯 Vue d'ensemble

NAHB est une plateforme interactive où les auteurs créent des histoires "dont vous êtes le héros" et où les lecteurs parcourent ces histoires en faisant des choix qui influencent leur expérience.

### 🎭 Acteurs principaux
- **👤 Lecteurs (Readers)** : Jouent les histoires publiées et font des choix
- **✍️ Auteurs (Authors)** : Créent et publient des histoires interactives
- **👑 Admins** : Gèrent la plateforme (bannissements, modération, statistiques)

---

## 🚀 Technologies

### Backend
- **Node.js** + **Express** - API REST
- **MongoDB** + **Mongoose** - Base de données NoSQL
- **JWT** - Authentification sécurisée
- **Multer** - Upload d'images
- **Express Validator** - Validation des données

### Frontend
- **React 18** + **Vite** - Interface utilisateur moderne
- **React Router** - Navigation SPA
- **Context API** - Gestion d'état
- **Axios** - Requêtes HTTP

### DevOps
- **Docker** + **Docker Compose** - Conteneurisation
- **Jest** - Tests unitaires (à venir)

---

## ✨ Fonctionnalités Implémentées

### ✅ Niveau 10/20 - Fonctionnalités de base

#### Authentification
- ✅ Inscription (username + email + password)
- ✅ Connexion / Déconnexion
- ✅ Gestion de session JWT
- ✅ Rôles (Reader, Author, Admin)

#### Gestion des histoires (Auteur)
- ✅ Créer une histoire (titre, description, tags, thème)
- ✅ Modifier / Supprimer ses histoires
- ✅ Gérer le statut (draft / published / suspended)
- ✅ Définir la page de départ
- ✅ Upload image de couverture

#### Pages et Choix
- ✅ Créer des pages (scènes avec texte)
- ✅ Ajouter des choix avec texte
- ✅ Chaque choix pointe vers une page cible
- ✅ Marquer une page comme fin
- ✅ Labelliser les fins

#### Lecture (Lecteur)
- ✅ Lister les histoires publiées
- ✅ Rechercher et filtrer
- ✅ Lire une histoire (départ → choix → fin)
- ✅ Indication visuelle des fins

### ✅ Niveau 13/20 - Fonctionnalités avancées

#### Côté Lecteur
- ✅ Filtrer par thème
- ✅ Trier (popularité, note, date)
- ✅ Statistiques de fins (nombre, pourcentage)
- ✅ Stats de parcours (% similarité avec autres joueurs)
- ✅ Fins nommées avec types (heroic, tragic, etc.)
- ✅ Collection de fins débloquées par histoire
- ✅ Notation (1-5 ⭐) avec commentaires
- ✅ Moyenne des notes + nombre de votes
- ✅ Sauvegarde automatique du parcours (currentPage)
- ✅ Reprise de partie en cours
- ✅ Signalement d'histoires

---

### ✅ Niveau 16/20 - Dashboard Auteur & Illustrations

#### Profil Auteur
- ✅ Page profil auteur avec bio et avatar
- ✅ Dashboard personnel "Mes histoires"
- ✅ Stats avancées par histoire :
  - 📊 Nombre de lectures
  - 📊 Distribution des fins atteintes
  - 📊 Taux d'abandon
  - 📊 Note moyenne
  - 📊 Pages les plus visitées
  - 📊 Choix les plus populaires
- ✅ Mode brouillon / publié
- ✅ Mode preview (test sans impacter stats)
- ✅ Upload d'illustrations (couvertures + pages)

#### UX/UI
- ✅ Interface moderne et responsive
- [x] Messages d'erreur/succès clairs
- [x] Confirmations pour actions destructrices

---

### Niveau 18/20 - Features Expert (Partiellement)

#### Arbres des histoires
- [ ] Visualisation arborescente des histoires (auteur)
- [ ] Visualisation du parcours pour lecteur
- ✅ Messages d'erreur clairs
- ✅ Confirmations pour actions destructrices

---

### ✅ Niveau 18/20 - Fonctionnalités Expert

#### Visualisation Avancée
- ✅ Suivi du chemin parcouru (path tracking)
- ⚠️ Arbre des histoires (à faire côté frontend)
- ⚠️ Visualisation du parcours (à faire côté frontend)

#### Illustrations Interactives
- ✅ Upload d'images sur pages
- ✅ Zones interactives cliquables (coordonnées x, y, width, height)
- ✅ Navigation via zones d'images
- ✅ Formes multiples (rectangle, circle, polygon)

#### Système de Dés 🎲
- ✅ Création de choix avec conditions de dés
- ✅ Types de dés multiples (d4, d6, d8, d10, d12, d20)
- ✅ Conditions de réussite (min-max values)
- ✅ Chemins différents selon résultat
- ✅ API pour lancer un dé

#### Tests & Qualité
- ✅ Architecture propre et modulaire
- ✅ Validation des données (express-validator)
- ✅ Gestion d'erreurs centralisée
- ✅ Docker & docker-compose configurés
- ⚠️ Tests unitaires (structure prête, à implémenter)
- ⚠️ Déploiement (à faire)

---

## 🛠 Stack Technologique

### Backend
- **Runtime** : Node.js 18+
- **Framework** : Express.js
- **Base de données** : MongoDB 6+ avec Mongoose
- **Authentification** : JWT + bcryptjs
- **Validation** : Express Validator
- **Upload** : Multer
- **Sécurité** : Helmet, CORS, Rate Limiting

### Frontend
- **Framework** : React 18+ avec Vite
- **Routing** : React Router v6
- **State** : Context API
- **HTTP Client** : Axios
- **Styling** : CSS3 modules + Responsive Design

### DevOps
- **Conteneurisation** : Docker + Docker Compose
- **Tests** : Jest (configuré)
- **Version Control** : Git

---

## 📁 Structure du Projet

```
NAHB/
├── backend/
│   ├── controllers/           # Logique métier
│   │   ├── auth.controller.js
│   │   ├── story.controller.js
│   │   ├── page.controller.js
│   │   ├── choice.controller.js
│   │   ├── game.controller.js
│   │   ├── rating.controller.js
│   │   ├── report.controller.js
│   │   ├── statistics.controller.js
│   │   └── admin.controller.js
│   ├── models/                # Schémas Mongoose
│   │   ├── User.model.js
│   │   ├── Story.model.js
│   │   ├── Page.model.js
│   │   ├── Choice.model.js
│   │   ├── Game.model.js
│   │   ├── Rating.model.js
│   │   └── Report.model.js
│   ├── routes/                # Routes API
│   ├── middlewares/           # Auth, validation, erreurs
│   ├── utils/                 # Helpers (JWT, dés, queries)
│   ├── uploads/               # Images uploadées
│   ├── server.js              # Point d'entrée
│   ├── seed.js                # Données de test
│   ├── package.json
│   ├── .env                   # Variables d'environnement
│   ├── Dockerfile
│   ├── README.md              # Documentation backend
│   └── API_DOCUMENTATION.md   # Documentation API
│   │   └── integration/           # Tests d'intégration
│   ├── Dockerfile
│   ├── package.json
│   └── README.md
│
├── frontend/
│   ├── src/
│   │   ├── main.jsx               # Point d'entrée
│   │   ├── App.jsx                # Composant racine
│   │   ├── components/
│   │   │   ├── admin/             # Pages admin
│   │   │   ├── auth/              # Login/Register
│   │   │   ├── author/            # Dashboard auteur
│   │   │   ├── reader/            # Lecture d'histoire
│   │   │   └── common/            # Composants réutilisables
│   │   ├── context/               # Context API
│   │   ├── hooks/                 # Custom hooks
│   │   ├── pages/                 # Pages principales
│   │   ├── services/              # API calls
│   │   ├── styles/                # CSS global
│   │   └── utils/                 # Helpers
│   ├── public/                    # Ressources statiques
│   ├── Dockerfile
│   ├── vite.config.js
│   ├── package.json
│   └── README.md
│
├── docs/
│   ├── architecture/              # Diagrammes UML
│   ├── mockups/                   # Wireframes
│   └── screenshots/               # Captures d'écran
│
├── docker-compose.yml             # Orchestration
├── README.md                       # Ce fichier
└── NEEDS.txt                       # Checklist de complétude
```

---

## 🚀 Installation & Lancement

### Prérequis
- **Node.js** 18+
- **npm** 9+
- **MySQL** 8+ (ou MariaDB)
- **Docker** & **Docker Compose** (optionnel)

### Installation locale

#### 1. Cloner le projet
```bash
git clone https://github.com/enzo-supdev/Enzo_Rayane_NAHB.git
cd Enzo_Rayane_NAHB
```

#### 2. Backend

```bash
cd backend

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env

# Configuration du fichier .env :
# DATABASE_URL="mysql://user:password@localhost:3306/nahb_db"
# SHADOW_DATABASE_URL="mysql://user:password@localhost:3306/nahb_db_shadow"
# JWT_SECRET="your-secret-key"
# PORT=5000

# Initialiser la base de données
npx prisma migrate dev --name init

# Seed les données de test
npx prisma db seed

# Lancer le serveur
npm run dev
```

Le serveur sera disponible sur `http://localhost:5000`

#### 3. Frontend

```bash
cd frontend

# Installer les dépendances
npm install

# Configuration du fichier .env :
# VITE_API_URL="http://localhost:5000/api"

# Lancer le dev server
npm run dev
```

L'app sera disponible sur `http://localhost:5173`

---

### Installation avec Docker Compose

```bash
# À la racine du projet
docker-compose up -d

# Initialiser la base de données
docker-compose exec backend npx prisma migrate deploy
docker-compose exec backend npx prisma db seed
```

- Backend : `http://localhost:5000`
- Frontend : `http://localhost:3000`
- MySQL : `localhost:3306`

---

## 🧪 Tests

### Lancer les tests

```bash
cd backend

# Tests unitaires
npm run test:unit

# Tests d'intégration
npm run test:integration

# Tous les tests
npm run test

# Avec couverture
npm run test:coverage
```

### Comptes de test (après seed)
```
Admin:   admin@nahb.com / password123
Auteur:  auteur@nahb.com / password123
Lecteur: lecteur@nahb.com / password123
```

---

## 📚 API Documentation

### Authentification (`/api/auth`)

```http
POST /auth/register
POST /auth/login
POST /auth/logout
GET  /auth/me
```

### Histoires (`/api/stories`)

```http
GET    /stories                    # Lister toutes (publiées)
GET    /stories/:id                # Détails
POST   /stories                    # Créer (auteur)
PUT    /stories/:id                # Mettre à jour
DELETE /stories/:id                # Supprimer
GET    /stories/search?q=...       # Recherche
```

### Pages (`/api/pages`)

```http
GET    /pages/story/:storyId       # Pages d'une histoire
GET    /pages/:id                  # Détails + choix
POST   /pages                      # Créer
PUT    /pages/:id                  # Mettre à jour
DELETE /pages/:id                  # Supprimer
```

### Choix (`/api/choices`)

```http
GET    /choices/:pageId            # Choix d'une page
POST   /choices                    # Créer
PUT    /choices/:id                # Mettre à jour
DELETE /choices/:id                # Supprimer
```

### Jeu (`/api/game`)

```http
POST   /game/start                 # Démarrer partie
POST   /game/choice                # Faire un choix
GET    /game/history               # Historique joueur
GET    /game/stats/:storyId        # Stats histoire
```

### Notations (`/api/ratings`)

```http
GET    /ratings/:storyId           # Notes d'une histoire
POST   /ratings/:storyId           # Noter
GET    /ratings/:storyId/my-rating # Ma note
DELETE /ratings/:storyId           # Supprimer note
```

### Fins déverrouillées (`/api/endings`)

```http
GET    /endings/:storyId           # Fins déverrouillées
GET    /endings/:storyId/stats     # Stats des fins
POST   /endings/unlock             # Enregistrer fin
```

### Admin (`/api/admin`)

```http
POST   /admin/users/:userId/ban    # Bannir utilisateur
POST   /admin/stories/:storyId/suspend # Suspendre histoire
GET    /admin/stats                # Stats globales
```

### Auteur (`/api/author`)

```http
GET    /author/dashboard           # Mon dashboard
GET    /author/stories/:id/stats   # Stats détaillées
GET    /author/profile             # Mon profil
PUT    /author/profile             # Modifier profil
```

---

## 🗄️ Schéma Base de Données

### Entités principales

| Entité | Description | Niveau |
|--------|-------------|--------|
| **User** | Utilisateur (Lecteur/Auteur/Admin) | 10 |
| **Story** | Histoire avec titre, description, statut | 10 |
| **Page** | Scène d'une histoire (texte + isEnd) | 10 |
| **Choice** | Choix pointant vers une page suivante | 10 |
| **GameSession** | Enregistrement d'une partie (user + story + endPage) | 10 |
| **Rating** | Notation (score 1-5 + comment) | 13 |
| **UnlockedEnding** | Fin déverrouillée pour un user | 13 |
| **AuthorProfile** | Profil auteur (bio, image) | 16 |
| **PlayerJourney** | Parcours détaillé du joueur | 16 |
| **JourneyStep** | Étape du parcours (page + choix) | 16 |
| **Statistics** | Stats globales d'une histoire | 16 |
| **StoryStatistics** | Stats par page | 16 |
| **Report** | Signalement d'une histoire | 13 |
| **DiceChoice** | Choix avec jet de dés | 18 |
| **InteractiveZone** | Zone cliquable sur image | 18 |
| **Image** | Image attachée à page | 16 |

---

## 🔐 Sécurité

- ✅ Passwords hashés avec bcrypt (10 rounds)
- ✅ JWT pour authentification (expiration)
- ✅ Middleware auth sur routes protégées
- ✅ Validation des inputs (Joi/Zod)
- ✅ Gestion des rôles (READER/AUTHOR/ADMIN)
- ✅ Protection CORS
- ⚠️ À améliorer : Rate limiting, Helmet.js, HTTPS

---

## 🐳 Docker

### Lancer avec Docker Compose

```bash
docker-compose up -d
```

**Services**:
- **backend** : Node.js sur port 5000
- **frontend** : Vite sur port 3000
- **db** : MySQL sur port 3306

---

## 👥 Crédits

- **Auteurs** : Enzo & Rayane
- **Promo** : NAHB Project Team
- **Licence** : MIT

---

## 📅 Timeline Projet

- **Semaine 1** : Setup + Niveau 10 ✅
- **Semaine 2** : Niveau 13 ✅
- **Semaine 3** : Niveau 16 ✅
- **Semaine 4** : Niveau 18 (Arbre + Dés)
- **Semaine 5** : Tests + Docker + Déploiement
- **Présentation** : Vendredi (15-20 min)
- **Rendu** : Dimanche 30/11 23h55

---

**Dernier update** : 26/11/2025  
**Version** : 1.0.0-Niveau16  
**Statut** : En développement actif ✨