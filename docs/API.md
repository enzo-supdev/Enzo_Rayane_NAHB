# 📡 API Reference - NAHB

## 🔐 Authentification (`/api/auth`)

### POST /auth/register
Créer un nouveau compte utilisateur.

```http
POST /api/auth/register
Content-Type: application/json

{
  "pseudo": "username",
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response 201**
```json
{
  "user": {
    "id": "uuid",
    "pseudo": "username",
    "email": "user@example.com",
    "role": "READER"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

---

### POST /auth/login
Se connecter avec email et mot de passe.

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response 200**
```json
{
  "user": { "id", "pseudo", "email", "role" },
  "token": "jwt_token"
}
```

---

### POST /auth/logout
Se déconnecter (optionnel - JWT côté client).

```http
POST /api/auth/logout
Authorization: Bearer <token>
```

**Response 200**
```json
{ "message": "Logged out successfully" }
```

---

### GET /auth/me
Récupérer les infos de l'utilisateur connecté.

```http
GET /api/auth/me
Authorization: Bearer <token>
```

**Response 200**
```json
{
  "id": "uuid",
  "pseudo": "username",
  "email": "user@example.com",
  "role": "AUTHOR",
  "isBanned": false
}
```

---

## 📚 Histoires (`/api/stories`)

### GET /stories
Lister toutes les histoires publiées avec pagination et filtrage.

```http
GET /api/stories?status=PUBLISHED&sort=latest&page=1&limit=10&search=aventure
Authorization: Bearer <token>
```

**Query Parameters**
- `status` : PUBLISHED, DRAFT (admin)
- `sort` : latest, popular, rating
- `page` : numéro de page (défaut: 1)
- `limit` : résultats par page (défaut: 10)
- `search` : recherche texte

**Response 200**
```json
{
  "stories": [
    {
      "id": "uuid",
      "title": "L'Aventure Fantastique",
      "description": "...",
      "tags": ["fantastique", "aventure"],
      "status": "PUBLISHED",
      "authorId": "uuid",
      "startPageId": "uuid",
      "createdAt": "2025-11-26T...",
      "stats": {
        "totalPlays": 45,
        "averageRating": 4.5,
        "totalRatings": 12
      }
    }
  ],
  "total": 42,
  "page": 1,
  "totalPages": 5
}
```

---

### GET /stories/:id
Récupérer les détails complets d'une histoire.

```http
GET /api/stories/uuid
Authorization: Bearer <token>
```

**Response 200**
```json
{
  "id": "uuid",
  "title": "L'Aventure Fantastique",
  "description": "...",
  "tags": ["fantastique"],
  "status": "PUBLISHED",
  "authorId": "uuid",
  "author": {
    "pseudo": "Auteur1",
    "email": "auteur@nahb.com"
  },
  "startPageId": "uuid",
  "pages": [
    {
      "id": "uuid",
      "content": "Vous vous réveillez...",
      "isEnd": false,
      "order": 1
    }
  ],
  "stats": {
    "totalPlays": 45,
    "averageRating": 4.5,
    "completedPlays": 40,
    "abandonedPlays": 5
  }
}
```

---

### POST /stories
Créer une nouvelle histoire (auteur seulement).

```http
POST /api/stories
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Ma nouvelle histoire",
  "description": "Une description détaillée...",
  "tags": ["adventure", "fantasy"]
}
```

**Response 201**
```json
{
  "id": "uuid",
  "title": "Ma nouvelle histoire",
  "description": "...",
  "tags": ["adventure", "fantasy"],
  "status": "DRAFT",
  "authorId": "uuid",
  "createdAt": "2025-11-26T..."
}
```

---

### PUT /stories/:id
Mettre à jour une histoire (auteur/admin seulement).

```http
PUT /api/stories/uuid
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Titre modifié",
  "description": "Description modifiée",
  "tags": ["updated", "tags"],
  "status": "PUBLISHED"
}
```

**Response 200**
```json
{ "id": "uuid", "title": "Titre modifié", ... }
```

---

### DELETE /stories/:id
Supprimer une histoire (auteur/admin seulement).

```http
DELETE /api/stories/uuid
Authorization: Bearer <token>
```

**Response 204** (No Content)

---

## 📄 Pages (`/api/pages`)

### GET /pages/story/:storyId
Récupérer toutes les pages d'une histoire.

```http
GET /api/pages/story/uuid
Authorization: Bearer <token>
```

**Response 200**
```json
{
  "pages": [
    {
      "id": "uuid",
      "content": "Vous vous réveillez...",
      "isEnd": false,
      "order": 1,
      "storyId": "uuid"
    }
  ]
}
```

---

### GET /pages/:id
Récupérer les détails d'une page avec ses choix.

```http
GET /api/pages/uuid
Authorization: Bearer <token>
```

**Response 200**
```json
{
  "id": "uuid",
  "content": "Vous vous réveillez...",
  "isEnd": false,
  "order": 1,
  "storyId": "uuid",
  "choices": [
    {
      "id": "uuid",
      "text": "Prendre le chemin de gauche",
      "targetPageId": "uuid",
      "order": 1
    }
  ]
}
```

---

### POST /pages
Créer une nouvelle page (auteur/admin).

```http
POST /api/pages
Authorization: Bearer <token>
Content-Type: application/json

{
  "storyId": "uuid",
  "content": "Contenu de la page...",
  "isEnd": false,
  "order": 2
}
```

**Response 201**
```json
{ "id": "uuid", "content": "...", ... }
```

---

### PUT /pages/:id
Mettre à jour une page.

```http
PUT /api/pages/uuid
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Nouveau contenu",
  "isEnd": true
}
```

---

### DELETE /pages/:id
Supprimer une page.

```http
DELETE /api/pages/uuid
Authorization: Bearer <token>
```

---

## 🔀 Choix (`/api/choices`)

### GET /choices/page/:pageId
Récupérer tous les choix d'une page.

```http
GET /api/choices/page/uuid
Authorization: Bearer <token>
```

**Response 200**
```json
{
  "choices": [
    {
      "id": "uuid",
      "text": "Prendre le chemin de gauche",
      "pageId": "uuid",
      "targetPageId": "uuid",
      "order": 1
    }
  ]
}
```

---

### POST /choices
Créer un nouveau choix (auteur/admin).

```http
POST /api/choices
Authorization: Bearer <token>
Content-Type: application/json

{
  "pageId": "uuid",
  "text": "Prendre le chemin de droite",
  "targetPageId": "uuid",
  "order": 2
}
```

---

### PUT /choices/:id
Mettre à jour un choix.

```http
PUT /api/choices/uuid
Authorization: Bearer <token>
Content-Type: application/json

{
  "text": "Texte modifié",
  "targetPageId": "uuid"
}
```

---

### DELETE /choices/:id
Supprimer un choix.

```http
DELETE /api/choices/uuid
Authorization: Bearer <token>
```

---

## 🎮 Jeu (`/api/game`)

### POST /game/start
Démarrer une nouvelle partie.

```http
POST /api/game/start
Authorization: Bearer <token>
Content-Type: application/json

{
  "storyId": "uuid"
}
```

**Response 201**
```json
{
  "sessionId": "uuid",
  "currentPageId": "uuid",
  "currentPage": {
    "id": "uuid",
    "content": "Vous vous réveillez...",
    "isEnd": false
  }
}
```

---

### POST /game/choice
Faire un choix pendant une partie.

```http
POST /api/game/choice
Authorization: Bearer <token>
Content-Type: application/json

{
  "sessionId": "uuid",
  "choiceId": "uuid"
}
```

**Response 200**
```json
{
  "nextPageId": "uuid",
  "nextPage": {
    "id": "uuid",
    "content": "Suite de l'histoire...",
    "isEnd": false
  },
  "gameEnded": false
}
```

---

### GET /game/history
Récupérer l'historique de jeu de l'utilisateur.

```http
GET /api/game/history?limit=20&offset=0
Authorization: Bearer <token>
```

**Response 200**
```json
{
  "sessions": [
    {
      "id": "uuid",
      "storyId": "uuid",
      "storyTitle": "L'Aventure Fantastique",
      "endPageId": "uuid",
      "playedAt": "2025-11-26T..."
    }
  ],
  "total": 5
}
```

---

## ⭐ Notations (`/api/ratings`)

### GET /ratings/:storyId
Récupérer toutes les notations d'une histoire.

```http
GET /api/ratings/uuid?limit=10
Authorization: Bearer <token>
```

**Response 200**
```json
{
  "ratings": [
    {
      "id": "uuid",
      "userId": "uuid",
      "pseudo": "lecteur1",
      "score": 5,
      "comment": "Excellente histoire!",
      "createdAt": "2025-11-26T..."
    }
  ],
  "average": 4.5,
  "total": 12
}
```

---

### GET /ratings/:storyId/my-rating
Récupérer sa propre notation.

```http
GET /api/ratings/uuid/my-rating
Authorization: Bearer <token>
```

**Response 200**
```json
{
  "id": "uuid",
  "score": 4,
  "comment": "Bien écrit",
  "createdAt": "2025-11-26T..."
}
```

---

### POST /ratings/:storyId
Noter une histoire (créer ou mettre à jour).

```http
POST /api/ratings/uuid
Authorization: Bearer <token>
Content-Type: application/json

{
  "score": 5,
  "comment": "Excellente histoire!"
}
```

**Response 201**
```json
{
  "id": "uuid",
  "userId": "uuid",
  "storyId": "uuid",
  "score": 5,
  "comment": "Excellente histoire!"
}
```

---

### DELETE /ratings/:storyId
Supprimer sa notation.

```http
DELETE /api/ratings/uuid
Authorization: Bearer <token>
```

**Response 204** (No Content)

---

## 🎯 Fins Déverrouillées (`/api/endings`)

### GET /endings/:storyId
Récupérer les fins déverrouillées pour une histoire.

```http
GET /api/endings/uuid
Authorization: Bearer <token>
```

**Response 200**
```json
{
  "endings": [
    {
      "id": "uuid",
      "pageId": "uuid",
      "pageName": "Fin Héroïque",
      "unlockedAt": "2025-11-26T..."
    }
  ]
}
```

---

### GET /endings/:storyId/stats
Récupérer les statistiques des fins (public).

```http
GET /api/endings/uuid/stats
Authorization: Bearer <token>
```

**Response 200**
```json
{
  "endings": [
    {
      "pageId": "uuid",
      "name": "Fin Héroïque",
      "reachedCount": 25,
      "percentage": 56.8
    },
    {
      "pageId": "uuid",
      "name": "Fin Tragique",
      "reachedCount": 19,
      "percentage": 43.2
    }
  ]
}
```

---

### POST /endings/unlock
Enregistrer une fin déverrouillée (après atteinte).

```http
POST /api/endings/unlock
Authorization: Bearer <token>
Content-Type: application/json

{
  "storyId": "uuid",
  "pageId": "uuid"
}
```

---

## 📊 Statistiques (`/api/statistics`)

### GET /statistics/story/:storyId
Récupérer les statistiques publiques d'une histoire.

```http
GET /api/statistics/story/uuid
Authorization: Bearer <token>
```

**Response 200**
```json
{
  "totalPlays": 45,
  "completedPlays": 40,
  "abandonedPlays": 5,
  "averageRating": 4.5,
  "totalRatings": 12,
  "popularity": "high"
}
```

---

### GET /statistics/author/:authorId
Récupérer les statistiques d'un auteur.

```http
GET /api/statistics/author/uuid
Authorization: Bearer <token>
```

**Response 200**
```json
{
  "authorId": "uuid",
  "totalStories": 5,
  "totalPlays": 234,
  "averageRating": 4.3,
  "topStory": {
    "id": "uuid",
    "title": "...",
    "plays": 89
  }
}
```

---

### GET /statistics/author/:authorId/:storyId
Récupérer les statistiques détaillées d'une histoire (auteur).

```http
GET /api/statistics/author/uuid/uuid
Authorization: Bearer <token>
```

**Response 200**
```json
{
  "storyId": "uuid",
  "totalPlays": 45,
  "completedPlays": 40,
  "abandonedPlays": 5,
  "pageStats": [
    {
      "pageId": "uuid",
      "viewCount": 45,
      "chosenCount": 23
    }
  ],
  "endingDistribution": [
    { "pageId": "uuid", "name": "Fin Héroïque", "count": 25 }
  ]
}
```

---

### GET /statistics/admin/all
Statistiques globales du site (admin).

```http
GET /api/statistics/admin/all
Authorization: Bearer <token>
```

**Response 200**
```json
{
  "totalUsers": 124,
  "totalStories": 42,
  "totalPlays": 1234,
  "topStories": [...],
  "topAuthors": [...]
}
```

---

## 👑 Admin (`/api/admin`)

### POST /admin/users/:userId/ban
Bannir un utilisateur (admin).

```http
POST /api/admin/users/uuid/ban
Authorization: Bearer <token>
Content-Type: application/json

{
  "reason": "Contenu offensant"
}
```

**Response 200**
```json
{ "id": "uuid", "isBanned": true }
```

---

### POST /admin/users/:userId/unban
Débannir un utilisateur.

```http
POST /api/admin/users/uuid/unban
Authorization: Bearer <token>
```

---

### POST /admin/stories/:storyId/suspend
Suspendre une histoire.

```http
POST /api/admin/stories/uuid/suspend
Authorization: Bearer <token>
Content-Type: application/json

{
  "reason": "Contenu jugé inapproprié"
}
```

---

### GET /admin/stats
Voir les statistiques globales.

```http
GET /api/admin/stats
Authorization: Bearer <token>
```

---

## ✍️ Auteur (`/api/author`)

### GET /author/dashboard
Récupérer le dashboard personnalisé de l'auteur.

```http
GET /api/author/dashboard
Authorization: Bearer <token>
```

**Response 200**
```json
{
  "profile": {
    "bio": "Auteur passionné...",
    "totalStories": 5
  },
  "stories": [
    {
      "id": "uuid",
      "title": "...",
      "status": "PUBLISHED",
      "plays": 45,
      "rating": 4.5
    }
  ]
}
```

---

### GET /author/profile
Récupérer le profil auteur.

```http
GET /api/author/profile
Authorization: Bearer <token>
```

---

### PUT /author/profile
Mettre à jour le profil auteur.

```http
PUT /api/author/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "bio": "Nouvelle biographie...",
  "profileImage": "url_image"
}
```

---

### GET /author/stories/:storyId/stats
Récupérer les statistiques détaillées d'une histoire.

```http
GET /api/author/stories/uuid/stats
Authorization: Bearer <token>
```

---

## ❌ Codes d'Erreur

| Code | Signification | Exemple |
|------|---------------|---------|
| 200 | OK | Requête réussie |
| 201 | Created | Ressource créée |
| 204 | No Content | Suppression réussie |
| 400 | Bad Request | Données invalides |
| 401 | Unauthorized | Token invalide/expiré |
| 403 | Forbidden | Pas de permission |
| 404 | Not Found | Ressource inexistante |
| 409 | Conflict | Doublon (ex: email) |
| 500 | Server Error | Erreur serveur |

---

**Version API** : 1.0.0  
**Dernière mise à jour** : 26/11/2025  
**Authentification** : Bearer Token (JWT)
