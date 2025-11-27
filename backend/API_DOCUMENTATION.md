# NAHB Backend - API Documentation

## Base URL

```
Development: http://localhost:5000/api
Production: https://your-domain.com/api
```

## Authentication

La plupart des endpoints nécessitent une authentification JWT. Incluez le token dans le header :

```
Authorization: Bearer <your_jwt_token>
```

## Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message"
}
```

### Paginated Response
```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalResults": 50,
    "limit": 10,
    "hasNext": true,
    "hasPrev": false
  }
}
```

## Endpoints Details

### 🔐 Authentication

#### Register
```http
POST /api/auth/register
```

**Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securepass123",
  "role": "reader" // or "author"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "...",
      "username": "john_doe",
      "email": "john@example.com",
      "role": "reader"
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

#### Login
```http
POST /api/auth/login
```

**Body:**
```json
{
  "email": "john@example.com",
  "password": "securepass123"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

---

### 📚 Stories

#### Get All Stories
```http
GET /api/stories?search=dragon&theme=fantasy&sort=popular&page=1&limit=10
```

**Query Parameters:**
- `search` - Recherche dans titre/description/tags
- `theme` - fantasy, sci-fi, horror, mystery, romance, adventure, historical, other
- `sort` - popular (par plays), rating (par note), default (par date)
- `page` - Numéro de page (default: 1)
- `limit` - Résultats par page (default: 10)

#### Get Story
```http
GET /api/stories/:id
```

#### Create Story
```http
POST /api/stories
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "title": "La Quête du Dragon",
  "description": "Une aventure épique dans un monde fantastique...",
  "theme": "fantasy",
  "tags": "dragon, aventure, magie",
  "difficulty": "medium",
  "estimatedDuration": 30
}
```

#### Update Story
```http
PUT /api/stories/:id
Authorization: Bearer <token>
```

#### Upload Cover
```http
POST /api/stories/:id/cover
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Form Data:**
- `cover` - Image file (max 5MB, jpeg/jpg/png/gif/webp)

---

### 📄 Pages

#### Create Page
```http
POST /api/pages
Authorization: Bearer <token>
```

**Body:**
```json
{
  "storyId": "...",
  "title": "La Porte Mystérieuse",
  "content": "Vous vous tenez devant une porte ancienne...",
  "isEnding": false,
  "orderIndex": 1
}
```

**Pour une page de fin:**
```json
{
  "storyId": "...",
  "content": "Vous avez sauvé le royaume !",
  "isEnding": true,
  "endingLabel": "Fin Héroïque",
  "endingType": "heroic"
}
```

#### Upload Page Image
```http
POST /api/pages/:id/image
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

#### Add Interactive Zone
```http
POST /api/pages/:id/zones
Authorization: Bearer <token>
```

**Body:**
```json
{
  "x": 100,
  "y": 150,
  "width": 200,
  "height": 100,
  "shape": "rectangle",
  "targetPage": "...",
  "description": "Cliquez sur la porte"
}
```

---

### 🎲 Choices

#### Create Choice
```http
POST /api/choices
Authorization: Bearer <token>
```

**Choix simple:**
```json
{
  "pageId": "...",
  "text": "Ouvrir la porte",
  "targetPage": "...",
  "orderIndex": 1
}
```

**Choix avec dé:**
```json
{
  "pageId": "...",
  "text": "Tenter de crocheter la serrure",
  "targetPage": "...",
  "requiresDice": true,
  "diceCondition": {
    "minValue": 12,
    "maxValue": 20,
    "diceType": "d20"
  },
  "description": "Nécessite un jet de dé (12-20 sur d20)"
}
```

---

### 🎮 Games

#### Start Game
```http
POST /api/games/start
Authorization: Bearer <token>
```

**Body:**
```json
{
  "storyId": "...",
  "isPreview": false
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "story": { "title": "...", "coverImage": "..." },
    "player": "...",
    "status": "in_progress",
    "currentPage": {
      "content": "Vous êtes au début de l'aventure...",
      "choices": [...]
    },
    "path": [...]
  }
}
```

#### Make Choice
```http
POST /api/games/:gameId/choose
Authorization: Bearer <token>
```

**Body:**
```json
{
  "choiceId": "...",
  "diceRoll": 15  // optionnel, auto si requiresDice
}
```

**Response avec succès:**
```json
{
  "success": true,
  "data": {
    "status": "in_progress",
    "currentPage": { ... },
    "path": [ ... ]
  },
  "diceRoll": 15
}
```

**Response échec dé:**
```json
{
  "success": false,
  "message": "Dice roll failed",
  "diceRoll": 8,
  "required": {
    "minValue": 12,
    "maxValue": 20,
    "diceType": "d20"
  }
}
```

#### Get Game
```http
GET /api/games/:id
Authorization: Bearer <token>
```

**Response (si completed):**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "status": "completed",
    "endingReached": {
      "endingLabel": "Fin Héroïque",
      "endingType": "heroic"
    },
    "path": [ ... ],
    "duration": 1800,
    "pathSimilarity": 65
  }
}
```

#### Get Unlocked Endings
```http
GET /api/games/story/:storyId/endings
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "unlockedEndings": [
      {
        "_id": "...",
        "endingLabel": "Fin Héroïque",
        "endingType": "heroic"
      }
    ],
    "totalEndings": 5,
    "allEndings": [ ... ]
  }
}
```

#### Roll Dice
```http
POST /api/games/dice/roll
Authorization: Bearer <token>
```

**Body:**
```json
{
  "diceType": "d20"
}
```

---

### ⭐ Ratings

#### Create/Update Rating
```http
POST /api/ratings
Authorization: Bearer <token>
```

**Body:**
```json
{
  "storyId": "...",
  "rating": 5,
  "comment": "Histoire incroyable !"
}
```

#### Get Story Ratings
```http
GET /api/ratings/story/:storyId?page=1&limit=10
```

---

### 🚩 Reports

#### Report Story
```http
POST /api/reports
Authorization: Bearer <token>
```

**Body:**
```json
{
  "storyId": "...",
  "reason": "inappropriate_content",
  "description": "Cette histoire contient du contenu inapproprié..."
}
```

**Reasons:**
- `inappropriate_content`
- `spam`
- `copyright`
- `offensive`
- `misleading`
- `broken`
- `other`

---

### 📊 Statistics

#### Get Story Statistics
```http
GET /api/statistics/story/:storyId
Authorization: Bearer <token> (Author or Admin)
```

**Response:**
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalPlays": 150,
      "totalCompletions": 89,
      "completionRate": "59.33",
      "averageRating": "4.50",
      "totalRatings": 42,
      "averageDuration": 25
    },
    "gameStatus": {
      "completed": 89,
      "inProgress": 34,
      "abandoned": 27
    },
    "endings": {
      "Fin Héroïque": {
        "label": "Fin Héroïque",
        "type": "heroic",
        "count": 45,
        "percentage": "50.56"
      }
    },
    "popularPages": [ ... ],
    "popularChoices": [ ... ]
  }
}
```

#### Get Author Statistics
```http
GET /api/statistics/author/:authorId
Authorization: Bearer <token>
```

---

### 👑 Admin

#### Get All Users
```http
GET /api/admin/users?role=author&search=john&page=1
Authorization: Bearer <token> (Admin only)
```

#### Ban User
```http
PUT /api/admin/users/:id/ban
Authorization: Bearer <token> (Admin only)
```

**Body:**
```json
{
  "reason": "Violation des règles de la communauté"
}
```

#### Suspend Story
```http
PUT /api/admin/stories/:id/suspend
Authorization: Bearer <token> (Admin only)
```

#### Dashboard Stats
```http
GET /api/admin/dashboard
Authorization: Bearer <token> (Admin only)
```

---

## Error Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (not logged in or invalid token)
- `403` - Forbidden (no permission)
- `404` - Not Found
- `429` - Too Many Requests (rate limit)
- `500` - Internal Server Error

## Rate Limiting

- **General**: 100 requests per 15 minutes
- **Auth** (login/register): 5 attempts per 15 minutes
- **Create** (stories/pages): 10 creations per hour
