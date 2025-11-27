# NAHB Backend API

Backend API pour le projet "Not Another Hero's Book" - Une plateforme d'histoires interactives.

## 🚀 Technologies

- **Node.js** + **Express** - Serveur API REST
- **MongoDB** + **Mongoose** - Base de données
- **JWT** - Authentification
- **Bcrypt** - Hashage des mots de passe
- **Multer** - Upload d'images
- **Express Validator** - Validation des données

## 📋 Prérequis

- Node.js (v18 ou supérieur)
- MongoDB (v6 ou supérieur)
- npm ou yarn

## 🛠️ Installation

### 1. Cloner le projet

```bash
cd backend
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configuration

Copier le fichier `.env.example` vers `.env` et configurer les variables :

```bash
cp .env.example .env
```

Variables importantes :
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/nahb
JWT_SECRET=votre_secret_jwt_tres_securise
CORS_ORIGIN=http://localhost:5173
```

### 4. Démarrer MongoDB

Assurez-vous que MongoDB est en cours d'exécution :

```bash
# Windows (si installé comme service)
net start MongoDB

# Ou avec mongod directement
mongod --dbpath "C:\data\db"
```

### 5. Lancer le serveur

**Mode développement (avec hot-reload) :**
```bash
npm run dev
```

**Mode production :**
```bash
npm start
```

Le serveur démarre sur `http://localhost:5000`

## 📁 Structure du projet

```
backend/
├── controllers/        # Logique métier
│   ├── auth.controller.js
│   ├── story.controller.js
│   ├── page.controller.js
│   ├── choice.controller.js
│   ├── game.controller.js
│   ├── rating.controller.js
│   ├── report.controller.js
│   ├── statistics.controller.js
│   ├── admin.controller.js
│   └── user.controller.js
├── models/            # Modèles Mongoose
│   ├── User.model.js
│   ├── Story.model.js
│   ├── Page.model.js
│   ├── Choice.model.js
│   ├── Game.model.js
│   ├── Rating.model.js
│   └── Report.model.js
├── routes/            # Routes API
│   ├── auth.routes.js
│   ├── story.routes.js
│   ├── page.routes.js
│   ├── choice.routes.js
│   ├── game.routes.js
│   ├── rating.routes.js
│   ├── report.routes.js
│   ├── statistics.routes.js
│   ├── admin.routes.js
│   └── user.routes.js
├── middlewares/       # Middlewares
│   ├── auth.middleware.js
│   ├── error.middleware.js
│   ├── validation.middleware.js
│   ├── rateLimiter.middleware.js
│   └── upload.middleware.js
├── utils/            # Utilitaires
│   ├── jwt.utils.js
│   ├── dice.utils.js
│   └── query.utils.js
├── uploads/          # Fichiers uploadés
├── .env              # Variables d'environnement
├── .env.example      # Exemple de configuration
├── server.js         # Point d'entrée
└── package.json
```

## 🔌 API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Inscription
- `POST /login` - Connexion
- `GET /me` - Profil utilisateur
- `PUT /password` - Changer mot de passe

### Stories (`/api/stories`)
- `GET /` - Liste des histoires publiées
- `GET /:id` - Détails d'une histoire
- `POST /` - Créer une histoire (Author)
- `PUT /:id` - Modifier une histoire
- `DELETE /:id` - Supprimer une histoire
- `GET /my/all` - Mes histoires
- `POST /:id/cover` - Upload cover image

### Pages (`/api/pages`)
- `GET /:id` - Détails d'une page
- `POST /` - Créer une page
- `PUT /:id` - Modifier une page
- `DELETE /:id` - Supprimer une page
- `POST /:id/image` - Upload image
- `POST /:id/zones` - Ajouter zone interactive
- `DELETE /:id/zones/:zoneId` - Supprimer zone

### Choices (`/api/choices`)
- `POST /` - Créer un choix
- `PUT /:id` - Modifier un choix
- `DELETE /:id` - Supprimer un choix
- `GET /page/:pageId` - Choix d'une page

### Games (`/api/games`)
- `POST /start` - Démarrer une partie
- `POST /:id/choose` - Faire un choix
- `GET /:id` - Détails d'une partie
- `GET /my/all` - Mes parties
- `GET /story/:storyId/endings` - Fins débloquées
- `POST /dice/roll` - Lancer un dé

### Ratings (`/api/ratings`)
- `POST /` - Noter une histoire
- `GET /story/:storyId` - Notes d'une histoire
- `GET /story/:storyId/mine` - Ma note
- `DELETE /:id` - Supprimer une note

### Reports (`/api/reports`)
- `POST /` - Signaler une histoire
- `GET /` - Liste des signalements (Admin)
- `PUT /:id` - Mettre à jour un signalement (Admin)
- `GET /my/all` - Mes signalements

### Statistics (`/api/statistics`)
- `GET /story/:storyId` - Stats d'une histoire
- `GET /author/:authorId` - Stats d'un auteur
- `GET /global` - Stats globales (Admin)
- `GET /story/:storyId/paths` - Stats des chemins

### Admin (`/api/admin`)
- `GET /users` - Liste des utilisateurs
- `PUT /users/:id/ban` - Bannir un utilisateur
- `PUT /users/:id/unban` - Débannir
- `PUT /users/:id/promote` - Promouvoir en auteur
- `GET /stories` - Toutes les histoires
- `PUT /stories/:id/suspend` - Suspendre une histoire
- `PUT /stories/:id/unsuspend` - Réactiver
- `DELETE /stories/:id` - Supprimer (Admin)
- `GET /dashboard` - Stats dashboard

## 🎯 Fonctionnalités implémentées

### Niveau 10/20 (Base) ✅
- ✅ Authentification complète (inscription, connexion, session)
- ✅ CRUD histoires (titre, description, tags, statut)
- ✅ CRUD pages/scènes avec indicateur de fin
- ✅ CRUD choix avec liens entre pages
- ✅ Lecture d'histoires interactives
- ✅ Enregistrement des parties (histoire, fin, utilisateur)
- ✅ Admin : bannir auteur, suspendre histoire, stats globales

### Niveau 13/20 (Avancé) ✅
- ✅ Filtres par thème
- ✅ Statistiques de fins (nombre, pourcentage)
- ✅ Statistiques de parcours (similarité de chemin)
- ✅ Fins nommées avec types (heroic, tragic, etc.)
- ✅ Collection de fins débloquées par utilisateur
- ✅ Notation & commentaires (1-5 étoiles)
- ✅ Sauvegarde automatique (currentPage dans Game)
- ✅ Signalement d'histoires

### Niveau 16/20 (Expert) ✅
- ✅ Profil auteur avec liste histoires
- ✅ Stats avancées (lectures, abandons, fins, notes)
- ✅ Mode brouillon/publié
- ✅ Mode preview (isPreview dans Game)
- ✅ Upload d'illustrations (pages et covers)

### Niveau 18/20 (Master) ✅
- ✅ Zones interactives dans images
- ✅ Système de dés (d4, d6, d8, d10, d12, d20)
- ✅ Conditions de dés pour choix
- ✅ Suivi des chemins complets (path dans Game)
- ✅ Architecture propre et modulaire

## 🔐 Rôles et Permissions

### Reader (par défaut)
- Lire les histoires publiées
- Jouer aux histoires
- Noter et commenter
- Signaler des histoires

### Author
- Toutes les permissions Reader
- Créer et gérer ses histoires
- Créer pages, choix, zones interactives
- Voir les stats de ses histoires
- Mode preview

### Admin
- Toutes les permissions
- Bannir/débannir utilisateurs
- Suspendre/réactiver histoires
- Gérer les signalements
- Voir stats globales
- Promouvoir des utilisateurs en Author

## 🧪 Tests

```bash
npm test
```

## 🐳 Docker

Voir le fichier `docker-compose.yml` à la racine du projet.

```bash
# Depuis la racine du projet
docker-compose up -d
```

## 📊 Modèle de données

### User
- username, email, password
- role (reader, author, admin)
- isBanned, banReason, bannedAt
- avatar, bio

### Story
- title, description, theme, tags
- author (ref User)
- status (draft, published, suspended)
- coverImage, startPage
- averageRating, totalRatings, totalPlays

### Page
- story (ref Story)
- title, content
- isEnding, endingLabel, endingType
- image, interactiveZones
- choices[]

### Choice
- page (ref Page)
- text, targetPage
- requiresDice, diceCondition
- timesChosen

### Game
- story (ref Story), player (ref User)
- status (in_progress, completed, abandoned)
- currentPage, path[], endingReached
- isPreview

### Rating
- story (ref Story), user (ref User)
- rating (1-5), comment

### Report
- story (ref Story), reporter (ref User)
- reason, description, status
- reviewedBy, adminNote

## ⚠️ Sécurité

- Mots de passe hashés avec bcrypt
- JWT pour authentification
- Rate limiting sur routes sensibles
- Validation des données avec express-validator
- CORS configuré
- Helmet pour headers de sécurité
- Upload limité à 5MB, images uniquement

## 🚧 TODO / Améliorations possibles

- [ ] Tests unitaires et d'intégration
- [ ] Seeders pour données de démo
- [ ] Pagination améliorée
- [ ] Cache Redis pour performances
- [ ] Webhooks pour notifications
- [ ] Export des histoires (PDF, JSON)
- [ ] Analytics avancés
- [ ] Recherche full-text MongoDB

## 📝 License

MIT

## 👥 Auteurs

Enzo & Rayane - Projet NAHB 2025-2026
