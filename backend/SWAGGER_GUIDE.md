# 📚 NAHB API - Documentation Swagger

## 🚀 À propos de NAHB

**Not Another Hero's Book** est une plateforme interactive de livres où :
- Les **lecteurs** découvrent des histoires avec des choix multiples
- Les **auteurs** créent des aventures avec des pages, des choix et même des mécaniques de dés
- Les **administrateurs** gèrent la plateforme et les contenus

## 📖 Accéder à la Documentation Swagger

Une fois le serveur lancé, accédez à :
```
http://localhost:5000/api-docs
```

## 🔧 Installation

### Installation des dépendances Swagger
```bash
cd backend
npm install
```

Les dépendances suivantes seront installées :
- `swagger-ui-express` : Interface interactive Swagger
- `swagger-jsdoc` : Génération de documentation Swagger

## 🎮 Utilisation de Swagger

### 1. Authentification
- Utilisez l'endpoint `/auth/login` pour vous connecter
- Copiez le token JWT retourné
- Cliquez sur le bouton **"Authorize"** en haut de l'interface
- Entrez : `Bearer <votre_token>`
- Cliquez "Authorize"

### 2. Endpoints Principaux

#### 📚 Stories (Histoires)
- `GET /stories` - Récupérer toutes les histoires
- `POST /stories` - Créer une nouvelle histoire
- `GET /stories/{id}` - Détails d'une histoire
- `PUT /stories/{id}` - Modifier une histoire
- `DELETE /stories/{id}` - Supprimer une histoire

#### 📄 Pages
- `POST /pages` - Créer une page
- `GET /pages/{id}` - Récupérer une page
- `POST /pages/{id}/image` - Uploader une image
- `POST /pages/{id}/zones` - Ajouter une zone interactive

#### 🎯 Choices (Choix)
- `POST /choices` - Créer un choix
- `PUT /choices/{id}` - Modifier un choix
- `DELETE /choices/{id}` - Supprimer un choix

#### 🎮 Games (Partie)
- `POST /games/start` - Démarrer une partie
- `POST /games/{gameId}/choose` - Faire un choix
- `POST /games/dice/roll` - Lancer un dé

#### ⭐ Ratings (Évaluations)
- `POST /ratings` - Noter une histoire
- `GET /ratings/story/{storyId}` - Voir les notes

#### 📊 Statistics (Statistiques)
- `GET /statistics/story/{storyId}` - Statistiques d'une histoire
- `GET /statistics/author/{authorId}` - Statistiques d'un auteur

#### 👑 Admin
- `GET /admin/users` - Voir tous les utilisateurs
- `PUT /admin/users/{id}/ban` - Bannir un utilisateur
- `PUT /admin/stories/{id}/suspend` - Suspendre une histoire
- `GET /admin/dashboard` - Dashboard admin

## 🎲 Système de Dés

Le jeu supporte plusieurs types de dés :
- **d4** : Dé à 4 faces
- **d6** : Dé à 6 faces (dé normal)
- **d8** : Dé à 8 faces
- **d10** : Dé à 10 faces
- **d12** : Dé à 12 faces
- **d20** : Dé à 20 faces (type JDR)
- **d100** : Dé à 100 faces

### Créer un choix avec condition de dé

```json
{
  "pageId": "507f1f77bcf86cd799439011",
  "text": "Crocheter la serrure",
  "targetPage": "507f1f77bcf86cd799439012",
  "requiresDice": true,
  "diceCondition": {
    "diceType": "d20",
    "minValue": 12,
    "maxValue": 20
  },
  "description": "Vous devez obtenir au moins 12 sur 1d20"
}
```

## 🔐 Authentification JWT

Tous les endpoints protégés nécessitent un token JWT dans le header :
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

## 📝 Thèmes Disponibles

- **fantasy** - Fantaisie
- **sci-fi** - Science-fiction
- **horror** - Horreur
- **mystery** - Mystère
- **romance** - Romance
- **adventure** - Aventure
- **historical** - Historique
- **other** - Autre

## 💾 Types de Fins

- **heroic** - Fin héroïque
- **tragic** - Fin tragique
- **bittersweet** - Fin bittersweet
- **comic** - Fin comique
- **mysterious** - Fin mystérieuse

## 🔍 Exemples d'Utilisation

### 1. Créer un compte
```json
POST /auth/register
{
  "username": "aventurier",
  "email": "aventurier@example.com",
  "password": "SecurePass123!",
  "role": "author"
}
```

### 2. Créer une histoire
```json
POST /stories
Authorization: Bearer <token>
{
  "title": "La Caverne Oubliée",
  "description": "Une aventure souterraine remplie de mystères...",
  "theme": "fantasy",
  "tags": "cave, trésor, dragon",
  "difficulty": "hard",
  "estimatedDuration": 45
}
```

### 3. Créer une page
```json
POST /pages
Authorization: Bearer <token>
{
  "storyId": "507f1f77bcf86cd799439011",
  "title": "L'Entrée de la Caverne",
  "content": "Vous vous tenez devant une grande caverne sombre...",
  "orderIndex": 1
}
```

### 4. Créer un choix
```json
POST /choices
Authorization: Bearer <token>
{
  "pageId": "507f1f77bcf86cd799439012",
  "text": "Entrer dans la caverne",
  "targetPage": "507f1f77bcf86cd799439013",
  "orderIndex": 1
}
```

### 5. Démarrer une partie
```json
POST /games/start
Authorization: Bearer <token>
{
  "storyId": "507f1f77bcf86cd799439011",
  "isPreview": false
}
```

### 6. Faire un choix
```json
POST /games/{gameId}/choose
Authorization: Bearer <token>
{
  "choiceId": "507f1f77bcf86cd799439014",
  "diceRoll": 15
}
```

## 📊 Réponses

### Réponse Réussie
```json
{
  "success": true,
  "data": { ... },
  "pagination": { ... }
}
```

### Réponse Erreur
```json
{
  "success": false,
  "error": "Message d'erreur"
}
```

## 🚦 Codes de Statut HTTP

- **200** - OK
- **201** - Créé
- **400** - Mauvaise requête
- **401** - Non authentifié
- **403** - Accès refusé
- **404** - Non trouvé
- **429** - Trop de requêtes (rate limiting)
- **500** - Erreur serveur

## ⏱️ Rate Limiting

- Général : 100 requêtes par 15 minutes
- Authentification : 5 tentatives par 15 minutes
- Création : 10 créations par heure

## 🎯 Workflow Typique

1. **Inscription/Connexion** → Récupérer token JWT
2. **Créer une histoire** → Récupérer l'ID story
3. **Créer des pages** → Structurer l'histoire
4. **Créer des choix** → Lier les pages
5. **Uploader images** → Enrichir l'expérience
6. **Publier** → Rendre accessible
7. **Jouer** → Tester le flux
8. **Consulter stats** → Analyser les performances

## 🤝 Support

Pour plus d'informations sur les endpoints, consultez la documentation interactive Swagger :
```
http://localhost:5000/api-docs
```

## 📄 Licence

MIT
