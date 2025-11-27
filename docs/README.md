# 🎭 NAHB - Not Another Hero's Book

> Plateforme web fullstack de création et de lecture d'histoires interactives de type "livre dont vous êtes le héros"

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-orange.svg)](https://www.mysql.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 📖 Description

NAHB est une application web qui permet de :
- 📝 **Créer** des histoires interactives avec pages et choix (Auteurs)
- 📚 **Lire** et jouer ces histoires en faisant des choix (Lecteurs)
- 📊 **Suivre** les statistiques de lecture et fins déverrouillées
- ⭐ **Noter** et commenter les histoires
- 👑 **Administrer** la plateforme (Modération, statistiques)

### Fonctionnalités Principales

#### Niveau 10/20 ✅
- Authentification (inscription, connexion, JWT)
- Gestion des histoires (CRUD, brouillon/publié)
- Pages et choix (création d'arbre narratif)
- Lecture interactive avec navigation
- Enregistrement des parties
- Panel administrateur (bannir, suspendre, stats)

#### Niveau 13/20 (En cours)
- Filtrage par thème
- Système de notation (1-5 ⭐)
- Statistiques de parcours
- Collection de fins déverrouillées
- Signalement d'histoires

#### Niveau 16/20 (Prévu)
- Dashboard auteur avancé
- Mode preview
- Upload d'images
- Stats détaillées par histoire

#### Niveau 18/20 (Prévu)
- Visualisation d'arbres
- Images interactives
- Système de dés
- Tests automatisés
- Déploiement

---

## 🚀 Installation Rapide

### Prérequis

- Node.js 18+
- MySQL 8.0+
- Git

### Installation

```bash
# 1. Cloner le projet
git clone [URL_DU_GIT]
cd NAHB

# 2. Installer les dépendances
cd backend && npm install
cd ../frontend && npm install

# 3. Créer la base de données MySQL
mysql -u root -p
CREATE DATABASE nahb_db;
EXIT;

# 4. Configurer les variables d'environnement
# Copier backend/.env.example vers backend/.env
# Copier frontend/.env.example vers frontend/.env
# Modifier les valeurs (voir INSTALLATION-GUIDE.md)

# 5. Initialiser la base de données
cd backend
npx prisma generate
npx prisma migrate dev
npx prisma db seed

# 6. Démarrer les serveurs
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

**📚 Guide détaillé :** Voir [INSTALLATION-GUIDE.md](./INSTALLATION-GUIDE.md)

---

## 🎮 Utilisation

### Accès à l'application

- **Frontend :** http://localhost:5173
- **API Backend :** http://localhost:5000/api
- **Prisma Studio :** `npx prisma studio` (http://localhost:5555)

### Comptes de test

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| Admin | admin@nahb.com | password123 |
| Auteur | auteur@nahb.com | password123 |
| Lecteur | lecteur@nahb.com | password123 |

---

## 🏗️ Architecture

```
NAHB/
├── backend/                 # API REST + Base de données
│   ├── prisma/
│   │   ├── schema.prisma   # Modèles de données (20+ tables)
│   │   └── seed.js         # Données de test
│   ├── src/
│   │   ├── controllers/    # Logique métier
│   │   ├── routes/         # Endpoints API
│   │   ├── middleware/     # Auth, validation, errors
│   │   └── server.js       # Point d'entrée
│   └── test-api.http       # Tests API (REST Client)
│
├── frontend/               # Interface React + Vite
│   ├── src/
│   │   ├── components/     # Composants réutilisables
│   │   ├── pages/          # Pages de l'application
│   │   ├── services/       # Appels API (Axios)
│   │   ├── contexts/       # State management (Context API)
│   │   └── hooks/          # Custom hooks
│   └── public/             # Assets statiques
│
└── docs/                   # Documentation
    ├── architecture/
    ├── API.md
    └── SCHEMA.md
```

### Stack Technique

**Backend :**
- Node.js + Express
- Prisma ORM
- MySQL 8.0
- JWT (jsonwebtoken)
- bcryptjs

**Frontend :**
- React 18
- Vite
- React Router
- Axios
- Context API

---

## 📡 API Endpoints

### Authentification
```
POST   /api/auth/register      # Inscription
POST   /api/auth/login         # Connexion
GET    /api/auth/profile       # Profil utilisateur
PUT    /api/auth/profile       # Mise à jour profil
```

### Histoires
```
GET    /api/stories            # Liste histoires publiées
GET    /api/stories/:id        # Détails histoire
POST   /api/stories            # Créer (auteur)
PUT    /api/stories/:id        # Modifier (auteur)
DELETE /api/stories/:id        # Supprimer (auteur)
POST   /api/stories/:id/publish # Publier
```

### Pages & Choix
```
GET    /api/pages/story/:storyId  # Pages d'une histoire
POST   /api/pages                 # Créer page
PUT    /api/pages/:id             # Modifier page
DELETE /api/pages/:id             # Supprimer page
POST   /api/choices               # Créer choix
```

### Jeu
```
POST   /api/game/start            # Démarrer session
POST   /api/game/choice           # Faire un choix
GET    /api/game/sessions         # Mes sessions
GET    /api/game/unlocked-endings/:storyId # Fins déverrouillées
```

### Admin
```
POST   /api/admin/users/:id/ban       # Bannir utilisateur
POST   /api/admin/stories/:id/suspend # Suspendre histoire
GET    /api/admin/stats               # Statistiques globales
```

**Documentation complète :** [docs/API.md](./docs/API.md)

---

## 🧪 Tests

### Backend

```bash
cd backend

# Tester avec REST Client (VS Code)
# Ouvrir test-api.http

# Ou avec Postman
# Importer la collection depuis test-api.http
```

### Frontend

```bash
cd frontend

# Tests unitaires (à venir)
npm run test

# Linter
npm run lint
```

---

## 📊 Base de Données

### Schéma Principal

- **User** - Utilisateurs (reader, author, admin)
- **Story** - Histoires (draft, published, suspended)
- **Page** - Pages/scènes d'une histoire
- **Choice** - Choix de navigation entre pages
- **GameSession** - Sessions de jeu des lecteurs
- **PathTaken** - Chemins parcourus
- **UnlockedEnding** - Fins déverrouillées
- **Rating** - Notations et commentaires
- **Report** - Signalements

**Schéma complet :** [docs/SCHEMA.md](./docs/SCHEMA.md)

---

## 🤝 Contribution

### Workflow Git

```bash
# 1. Créer une branche
git checkout -b feature/ma-fonctionnalite

# 2. Faire des modifications

# 3. Commit
git add .
git commit -m "feat: ajout de la fonctionnalité X"

# 4. Push
git push origin feature/ma-fonctionnalite

# 5. Créer une Pull Request
```

### Convention de nommage des commits

- `feat:` Nouvelle fonctionnalité
- `fix:` Correction de bug
- `docs:` Documentation
- `style:` Formatage, CSS
- `refactor:` Refactoring
- `test:` Ajout de tests
- `chore:` Tâches diverses

---

## 📝 Documentation

- [Guide d'installation complet](./INSTALLATION-GUIDE.md)
- [Documentation API](./docs/API.md)
- [Architecture](./docs/ARCHITECTURE.md)
- [Schéma de base de données](./docs/SCHEMA.md)
- [Configuration](./docs/CONFIGURATION.md)
- [Fonctionnalités](./docs/FONCTIONNALITE.md)

---

## 🐛 Problèmes Connus

- ⚠️ Les images ne sont pas encore uploadables (fonctionnalité à venir)
- ⚠️ Pas de tests automatisés pour le moment
- ⚠️ Pas de déploiement en production configuré

---

## 🗓️ Roadmap

### Court terme (Semaine 1-2)
- [x] Backend CRUD complet (Niveau 10/20)
- [x] Services frontend
- [ ] Pages frontend complètes
- [ ] Système de notation (Niveau 13/20)

### Moyen terme (Semaine 3-4)
- [ ] Dashboard auteur avancé (Niveau 16/20)
- [ ] Upload d'images
- [ ] Mode preview
- [ ] Tests unitaires

### Long terme (Après rendu)
- [ ] Visualisation d'arbres (D3.js)
- [ ] Images interactives
- [ ] Système de dés
- [ ] Déploiement (Railway/Render)

---

## 👥 Équipe

- **Enzo** - Développeur Fullstack
- **Rayane** - Développeur Fullstack

**Projet académique** - ESGI 2025-2026

---

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

## 🙏 Remerciements

- Professeurs ESGI pour le sujet du projet
- Documentation Prisma, React, Express
- Communauté open-source

---

**Date de dernière mise à jour :** 27 novembre 2024  
**Version :** 1.0.0 (Niveau 10/20 complet)

---

## 🔗 Liens Utiles

- [Prisma Documentation](https://www.prisma.io/docs)
- [React Documentation](https://react.dev)
- [Express Documentation](https://expressjs.com)
- [MySQL Documentation](https://dev.mysql.com/doc)

---

**⚡ Quick Start pour ton collègue :**

```bash
git clone [URL]
cd NAHB
cd backend && npm install
cd ../frontend && npm install
# Configurer .env (voir INSTALLATION-GUIDE.md)
cd backend && npx prisma migrate dev && npx prisma db seed
npm run dev # (dans backend/)
npm run dev # (dans frontend/)
# → http://localhost:5173
```

**Besoin d'aide ? Consulte [INSTALLATION-GUIDE.md](./INSTALLATION-GUIDE.md) !** 🚀