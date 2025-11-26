# 📖 NAHB - Not Another Hero's Book

**Un projet fullstack de création et de lecture d'histoires interactives**

[![Status](https://img.shields.io/badge/Status-Active-brightgreen)]() 
[![Level](https://img.shields.io/badge/Level-16/20-blue)]()
[![Node](https://img.shields.io/badge/Node-18+-green)]()
[![React](https://img.shields.io/badge/React-18+-61DAFB?logo=react)]()

---

## 🎯 Vue d'ensemble

NAHB est une plateforme interactive où les auteurs créent des histoires "dont vous êtes le héros" et où les lecteurs parcourent ces histoires en faisant des choix qui influencent leur expérience.

### Acteurs principaux
- **Auteurs** : Créent et publient des histoires interactives
- **Lecteurs** : Jouent les histoires publiées et font des choix
- **Admins** : Gèrent la plateforme (bannissements, statistiques globales)

---

## ✨ Fonctionnalités

### Niveau 10/20 - Fonctionnalités de base ✅

#### Authentification
- [x] Inscription (pseudo + email + mot de passe)
- [x] Connexion / Déconnexion
- [x] Gestion de session

#### Gestion des histoires (Auteur)
- [x] Créer une histoire (titre, description, tags)
- [x] Modifier / Supprimer ses histoires
- [x] Gérer le statut (DRAFT / PUBLISHED)
- [x] Définir la page de départ

#### Pages et Choix
- [x] Créer des pages (scènes avec texte)
- [x] Ajouter des choix avec texte
- [x] Chaque choix pointe vers une page cible
- [x] Marquer une page comme fin

#### Lecture (Lecteur)
- [x] Lister les histoires publiées
- [x] Rechercher par nom
- [x] Lire une histoire (départ → choix → fin)
- [x] Indication visuelle des fins

#### Enregistrement minimal
- [x] Créer une session de jeu
- [x] Enregistrer la page de fin atteinte

#### Admin
- [x] Bannir un auteur
- [x] Suspendre une histoire
- [x] Voir les statistiques globales

---

### Niveau 13/20 - Fonctionnalités avancées ✅

#### Côté Lecteur
- [x] Filtrer/Trier les histoires
- [x] Système de thèmes pour les histoires
- [x] Statistiques de fin (nombre de fois atteinte)
- [x] Stats de parcours (% joueurs ayant pris ce chemin)
- [x] Fins nommées avec label
- [x] Collection de fins déverrouillées
- [x] Notation (1-5 ⭐) avec commentaires
- [x] Affichage de la moyenne des notes
- [x] Enregistrement du parcours joueur
- [x] Signalement d'histoires

---

### Niveau 16/20 - Dashboard Auteur & Stats ✅

#### Profil Auteur
- [x] Profil auteur avec bio
- [x] Dashboard personnel
- [x] Mes histoires avec stats de base
- [x] Stats avancées par histoire
  - Nombre de lectures
  - Distribution des fins atteintes
  - Taux d'abandon
  - Note moyenne
- [x] Mode préview (test sans impacter les stats)

#### UX/UI
- [x] Interface responsive
- [x] Messages d'erreur/succès clairs
- [x] Confirmations pour actions destructrices

---

### Niveau 18/20 - Features Expert (Partiellement)

#### Arbres des histoires
- [ ] Visualisation arborescente des histoires (auteur)
- [ ] Visualisation du parcours pour lecteur
- [ ] Layout hierarchical/circular

#### Illustrations interactives
- [ ] Upload d'images
- [ ] Zones interactives cliquables
- [ ] Navigation via zones d'images

#### Système de dés
- [ ] Création de choix avec dés
- [ ] Lancer de dés (D6, D20, D100)
- [ ] Conditions et jets (>=, <=, =)
- [ ] Chemins différents selon résultat

#### Tests & Qualité
- [ ] Tests unitaires
- [ ] Tests d'intégration
- [ ] Docker & docker-compose
- [ ] Déploiement

---

## 🛠 Stack Technologique

### Backend
- **Framework** : Express.js (Node.js)
- **BD** : MySQL avec Prisma ORM
- **Auth** : JWT + bcrypt
- **Validation** : Joi / Zod

### Frontend
- **Framework** : React 18+ (Vite)
- **Styling** : CSS3 + Responsive Design
- **State** : Context API
- **HTTP** : Axios

### DevOps
- **Docker** : Containerisation (prévu)
- **Git** : Version control

---

## 📁 Structure du Projet

```
NAHB/
├── backend/
│   ├── src/
│   │   ├── server.js              # Point d'entrée
│   │   ├── config/
│   │   │   └── database.js        # Config MySQL/Prisma
│   │   ├── controllers/           # Logique métier
│   │   ├── routes/                # Endpoints API
│   │   ├── middleware/            # Auth, validation, erreurs
│   │   ├── models/                # Modèles métier
│   │   ├── services/              # Logique business
│   │   └── utils/                 # Helpers & validators
│   ├── prisma/
│   │   ├── schema.prisma          # Schéma BDD (Niveau 16/20)
│   │   └── seed.js                # Données de test
│   ├── tests/
│   │   ├── unit/                  # Tests unitaires
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