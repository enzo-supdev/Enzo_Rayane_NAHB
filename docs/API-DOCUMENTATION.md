# 📚 Documentation API Complète - NAHB Backend

**Version**: 1.0.0  
**Base URL**: `http://localhost:5000/api`  
**Backend 100% fonctionnel** ✅

---

## 📋 Table des matières

1. [Vue d'ensemble](#vue-densemble)
2. [Authentification](#authentification)
3. [Histoires (Stories)](#histoires-stories)
4. [Pages & Scènes](#pages--scènes)
5. [Choix (Choices)](#choix-choices)
6. [Jeu (Game)](#jeu-game)
7. [Statistiques](#statistiques)
8. [Notations (Ratings)](#notations-ratings)
9. [Fins (Endings)](#fins-endings)
10. [Auteur (Author)](#auteur-author)
11. [Admin](#admin)
12. [Signalements (Reports)](#signalements-reports)
13. [Arbres (Tree)](#arbres-tree)
14. [Parcours (Journey)](#parcours-journey)
15. [Images](#images)
16. [Zones Interactives](#zones-interactives)
17. [Dés (Dice)](#dés-dice)
18. [Codes de réponse](#codes-de-réponse)

---

## Vue d'ensemble

### Architecture
- **Backend**: Node.js + Express
- **Base de données**: MySQL avec Prisma ORM
- **Authentification**: JWT (Bearer token)
- **Total endpoints**: 73 routes

### Headers requis
```
Content-Type: application/json
Authorization: Bearer {token}  // Pour les routes protégées
```

---

## 🔐 Authentification

### POST `/auth/register`
Créer un nouveau compte utilisateur.

**Body**:
```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "role": "READER" | "AUTHOR" | "ADMIN"  // Optionnel, par défaut: READER
}
```

**Response 201**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "username": "john_doe",
      "email": "john@example.com",
      "role": "AUTHOR"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### POST `/auth/login`
Se connecter avec un compte existant.

**Body**:
```json
{
  "email": "string",
  "password": "string"
}
```

**Response 200**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "username": "john_doe",
      "email": "john@example.com",
      "role": "AUTHOR"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### GET `/auth/profile`
🔒 **Authentification requise**

Récupérer le profil de l'utilisateur connecté.

**Response 200**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "role": "AUTHOR",
    "createdAt": "2025-11-27T10:00:00.000Z"
  }
}
```

---

### PUT `/auth/profile`
🔒 **Authentification requise**

Mettre à jour le profil utilisateur.

**Body**:
```json
{
  "username": "string",  // Optionnel
  "email": "string",     // Optionnel
  "password": "string"   // Optionnel (nouveau mot de passe)
}
```

**Response 200**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "username": "new_username",
    "email": "new_email@example.com",
    "role": "AUTHOR"
  }
}
```

---

## 📖 Histoires (Stories)

### GET `/stories`
Récupérer toutes les histoires publiées (accessible sans authentification).

**Query Parameters**:
- `search` (string): Rechercher par titre
- `theme` (string): Filtrer par thème
- `tags` (string): Filtrer par tags (séparés par des virgules)
- `page` (number): Numéro de page (pagination)
- `limit` (number): Nombre de résultats par page

**Exemple**: `GET /stories?search=dragon&theme=fantasy&page=1&limit=10`

**Response 200**:
```json
{
  "success": true,
  "data": {
    "stories": [
      {
        "id": 1,
        "title": "La Quête du Dragon",
        "description": "Une aventure épique...",
        "theme": "Fantasy",
        "tags": ["dragon", "aventure", "magie"],
        "status": "PUBLISHED",
        "author": {
          "id": 1,
          "username": "john_doe"
        },
        "startPageId": 5,
        "averageRating": 4.5,
        "totalRatings": 42,
        "playCount": 156,
        "createdAt": "2025-11-20T10:00:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalStories": 48
    }
  }
}
```

---

### GET `/stories/:id`
Récupérer les détails d'une histoire spécifique.

**Response 200**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "La Quête du Dragon",
    "description": "Une aventure épique dans un monde fantastique...",
    "theme": "Fantasy",
    "tags": ["dragon", "aventure", "magie"],
    "status": "PUBLISHED",
    "author": {
      "id": 1,
      "username": "john_doe"
    },
    "startPageId": 5,
    "averageRating": 4.5,
    "totalRatings": 42,
    "playCount": 156,
    "createdAt": "2025-11-20T10:00:00.000Z",
    "updatedAt": "2025-11-26T14:30:00.000Z"
  }
}
```

---

### GET `/stories/my/stories`
🔒 **Authentification requise** (AUTHOR ou ADMIN)

Récupérer toutes les histoires de l'auteur connecté.

**Response 200**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "La Quête du Dragon",
      "description": "Une aventure épique...",
      "status": "PUBLISHED",
      "theme": "Fantasy",
      "tags": ["dragon", "aventure"],
      "playCount": 156,
      "averageRating": 4.5,
      "createdAt": "2025-11-20T10:00:00.000Z"
    },
    {
      "id": 2,
      "title": "Le Mystère du Manoir",
      "description": "Une enquête palpitante...",
      "status": "DRAFT",
      "theme": "Mystery",
      "tags": ["enquête", "suspense"],
      "playCount": 0,
      "averageRating": 0,
      "createdAt": "2025-11-25T08:00:00.000Z"
    }
  ]
}
```

---

### POST `/stories`
🔒 **Authentification requise** (AUTHOR ou ADMIN)

Créer une nouvelle histoire.

**Body**:
```json
{
  "title": "string",
  "description": "string",
  "theme": "string",          // Optionnel
  "tags": ["string"]          // Optionnel
}
```

**Response 201**:
```json
{
  "success": true,
  "data": {
    "story": {
      "id": 3,
      "title": "Nouvelle Histoire",
      "description": "Description...",
      "theme": "Adventure",
      "tags": ["action", "héros"],
      "status": "DRAFT",
      "authorId": 1,
      "startPageId": null,
      "createdAt": "2025-11-27T10:00:00.000Z"
    }
  }
}
```

---

### PUT `/stories/:id`
🔒 **Authentification requise** (AUTHOR ou ADMIN)

Mettre à jour une histoire existante (seulement son propre contenu).

**Body**:
```json
{
  "title": "string",          // Optionnel
  "description": "string",    // Optionnel
  "theme": "string",          // Optionnel
  "tags": ["string"],         // Optionnel
  "startPageId": number       // Optionnel
}
```

**Response 200**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Titre modifié",
    "description": "Description modifiée...",
    "theme": "Fantasy",
    "tags": ["nouveaux", "tags"],
    "startPageId": 10,
    "updatedAt": "2025-11-27T11:00:00.000Z"
  }
}
```

---

### DELETE `/stories/:id`
🔒 **Authentification requise** (AUTHOR ou ADMIN)

Supprimer une histoire (seulement son propre contenu).

**Response 200**:
```json
{
  "success": true,
  "message": "Histoire supprimée avec succès"
}
```

---

### POST `/stories/:id/publish`
🔒 **Authentification requise** (AUTHOR ou ADMIN)

Publier ou mettre en brouillon une histoire.

**Body**:
```json
{
  "status": "PUBLISHED" | "DRAFT"
}
```

**Response 200**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "La Quête du Dragon",
    "status": "PUBLISHED",
    "updatedAt": "2025-11-27T12:00:00.000Z"
  }
}
```

---

## 📄 Pages & Scènes

### GET `/pages/story/:storyId`
🔒 **Authentification requise**

Récupérer toutes les pages d'une histoire.

**Response 200**:
```json
{
  "success": true,
  "data": [
    {
      "id": 5,
      "storyId": 1,
      "title": "Le début de l'aventure",
      "content": "Vous vous réveillez dans une forêt sombre...",
      "isEnd": false,
      "endingLabel": null,
      "choices": [
        {
          "id": 10,
          "text": "Explorer la forêt",
          "nextPageId": 6
        },
        {
          "id": 11,
          "text": "Chercher un abri",
          "nextPageId": 7
        }
      ],
      "images": [
        {
          "id": 1,
          "url": "https://example.com/forest.jpg",
          "altText": "Forêt sombre"
        }
      ]
    }
  ]
}
```

---

### GET `/pages/:id`
🔒 **Authentification requise**

Récupérer une page spécifique avec ses choix.

**Response 200**:
```json
{
  "success": true,
  "data": {
    "id": 5,
    "storyId": 1,
    "title": "Le début de l'aventure",
    "content": "Vous vous réveillez dans une forêt sombre...",
    "isEnd": false,
    "endingLabel": null,
    "choices": [
      {
        "id": 10,
        "text": "Explorer la forêt",
        "nextPageId": 6,
        "diceChoice": null
      }
    ],
    "images": [],
    "interactiveZones": []
  }
}
```

---

### POST `/pages`
🔒 **Authentification requise** (AUTHOR ou ADMIN)

Créer une nouvelle page pour une histoire.

**Body**:
```json
{
  "storyId": number,
  "title": "string",          // Optionnel
  "content": "string",
  "isEnd": boolean,           // Par défaut: false
  "endingLabel": "string"     // Requis si isEnd = true
}
```

**Response 201**:
```json
{
  "success": true,
  "data": {
    "page": {
      "id": 15,
      "storyId": 1,
      "title": "Nouvelle scène",
      "content": "Le contenu de la scène...",
      "isEnd": false,
      "endingLabel": null,
      "createdAt": "2025-11-27T13:00:00.000Z"
    }
  }
}
```

---

### PUT `/pages/:id`
🔒 **Authentification requise** (AUTHOR ou ADMIN)

Mettre à jour une page existante.

**Body**:
```json
{
  "title": "string",          // Optionnel
  "content": "string",        // Optionnel
  "isEnd": boolean,           // Optionnel
  "endingLabel": "string"     // Optionnel
}
```

**Response 200**:
```json
{
  "success": true,
  "data": {
    "id": 15,
    "title": "Titre modifié",
    "content": "Contenu modifié...",
    "isEnd": true,
    "endingLabel": "Fin héroïque",
    "updatedAt": "2025-11-27T14:00:00.000Z"
  }
}
```

---

### DELETE `/pages/:id`
🔒 **Authentification requise** (AUTHOR ou ADMIN)

Supprimer une page.

**Response 200**:
```json
{
  "success": true,
  "message": "Page supprimée avec succès"
}
```

---

## 🔀 Choix (Choices)

### POST `/choices`
🔒 **Authentification requise** (AUTHOR ou ADMIN)

Créer un nouveau choix pour une page.

**Body**:
```json
{
  "pageId": number,
  "text": "string",
  "nextPageId": number
}
```

**Response 201**:
```json
{
  "success": true,
  "data": {
    "id": 25,
    "pageId": 5,
    "text": "Ouvrir la porte mystérieuse",
    "nextPageId": 12,
    "createdAt": "2025-11-27T15:00:00.000Z"
  }
}
```

---

### PUT `/choices/:id`
🔒 **Authentification requise** (AUTHOR ou ADMIN)

Mettre à jour un choix existant.

**Body**:
```json
{
  "text": "string",           // Optionnel
  "nextPageId": number        // Optionnel
}
```

**Response 200**:
```json
{
  "success": true,
  "data": {
    "id": 25,
    "text": "Texte modifié",
    "nextPageId": 15,
    "updatedAt": "2025-11-27T16:00:00.000Z"
  }
}
```

---

### DELETE `/choices/:id`
🔒 **Authentification requise** (AUTHOR ou ADMIN)

Supprimer un choix.

**Response 200**:
```json
{
  "success": true,
  "message": "Choix supprimé avec succès"
}
```

---

## 🎮 Jeu (Game)

### POST `/game/start`
🔒 **Authentification requise**

Démarrer une nouvelle partie d'une histoire.

**Body**:
```json
{
  "storyId": number
}
```

**Response 200**:
```json
{
  "success": true,
  "data": {
    "journey": {
      "id": 42,
      "storyId": 1,
      "userId": 3,
      "status": "in_progress",
      "startedAt": "2025-11-27T17:00:00.000Z"
    },
    "currentPage": {
      "id": 5,
      "title": "Le début",
      "content": "Vous vous réveillez...",
      "isEnd": false,
      "choices": [
        {
          "id": 10,
          "text": "Explorer",
          "nextPageId": 6
        }
      ]
    }
  }
}
```

---

### POST `/game/choice`
🔒 **Authentification requise**

Faire un choix dans une partie en cours.

**Body**:
```json
{
  "journeyId": number,
  "choiceId": number
}
```

**Response 200**:
```json
{
  "success": true,
  "data": {
    "nextPage": {
      "id": 6,
      "title": "Dans la forêt",
      "content": "Vous avancez prudemment...",
      "isEnd": false,
      "choices": [...]
    },
    "journeyStep": {
      "id": 105,
      "journeyId": 42,
      "pageId": 6,
      "choiceId": 10,
      "visitedAt": "2025-11-27T17:05:00.000Z"
    },
    "isGameComplete": false
  }
}
```

---

### GET `/game/sessions`
🔒 **Authentification requise**

Récupérer toutes les sessions de jeu de l'utilisateur.

**Response 200**:
```json
{
  "success": true,
  "data": [
    {
      "id": 50,
      "storyId": 1,
      "story": {
        "title": "La Quête du Dragon"
      },
      "userId": 3,
      "endPageId": 25,
      "endPage": {
        "endingLabel": "Fin héroïque"
      },
      "completedAt": "2025-11-27T18:00:00.000Z"
    }
  ]
}
```

---

### GET `/game/sessions/:id`
🔒 **Authentification requise**

Récupérer les détails d'une session spécifique.

**Response 200**:
```json
{
  "success": true,
  "data": {
    "id": 50,
    "storyId": 1,
    "story": {
      "title": "La Quête du Dragon",
      "author": {
        "username": "john_doe"
      }
    },
    "endPage": {
      "id": 25,
      "title": "Victoire !",
      "endingLabel": "Fin héroïque",
      "content": "Vous avez vaincu le dragon..."
    },
    "completedAt": "2025-11-27T18:00:00.000Z"
  }
}
```

---

### GET `/game/unlocked-endings/:storyId`
🔒 **Authentification requise**

Récupérer toutes les fins débloquées par l'utilisateur pour une histoire.

**Response 200**:
```json
{
  "success": true,
  "data": {
    "storyId": 1,
    "unlockedEndings": [
      {
        "id": 1,
        "pageId": 25,
        "endingLabel": "Fin héroïque",
        "unlockedAt": "2025-11-27T18:00:00.000Z"
      },
      {
        "id": 2,
        "pageId": 30,
        "endingLabel": "Fin tragique",
        "unlockedAt": "2025-11-25T14:00:00.000Z"
      }
    ],
    "totalEndings": 5,
    "unlockedCount": 2
  }
}
```

---

## 📊 Statistiques

### GET `/statistics/story/:storyId`
🔒 **Authentification requise**

Récupérer les statistiques d'une histoire.

**Response 200**:
```json
{
  "success": true,
  "data": {
    "storyId": 1,
    "title": "La Quête du Dragon",
    "totalPlays": 156,
    "totalCompletions": 98,
    "averageRating": 4.5,
    "totalRatings": 42,
    "endingsDistribution": [
      {
        "endingLabel": "Fin héroïque",
        "count": 45,
        "percentage": 45.9
      },
      {
        "endingLabel": "Fin tragique",
        "count": 30,
        "percentage": 30.6
      },
      {
        "endingLabel": "Fin mystérieuse",
        "count": 23,
        "percentage": 23.5
      }
    ]
  }
}
```

---

### GET `/statistics/author/:authorId`
🔒 **Authentification requise**

Récupérer les statistiques globales d'un auteur.

**Response 200**:
```json
{
  "success": true,
  "data": {
    "authorId": 1,
    "username": "john_doe",
    "totalStories": 5,
    "publishedStories": 3,
    "totalPlays": 450,
    "totalRatings": 120,
    "averageRating": 4.3,
    "storiesStats": [
      {
        "storyId": 1,
        "title": "La Quête du Dragon",
        "playCount": 156,
        "averageRating": 4.5
      }
    ]
  }
}
```

---

### GET `/statistics/author/:authorId/:storyId`
🔒 **Authentification requise** (AUTHOR ou ADMIN)

Récupérer des statistiques détaillées pour une histoire spécifique d'un auteur.

**Response 200**:
```json
{
  "success": true,
  "data": {
    "storyId": 1,
    "title": "La Quête du Dragon",
    "totalPlays": 156,
    "completions": 98,
    "abandonRate": 37.2,
    "averageRating": 4.5,
    "ratingsBreakdown": {
      "5stars": 25,
      "4stars": 10,
      "3stars": 5,
      "2stars": 2,
      "1star": 0
    },
    "endingsStats": [
      {
        "pageId": 25,
        "endingLabel": "Fin héroïque",
        "timesReached": 45,
        "percentage": 45.9
      }
    ],
    "popularChoices": [
      {
        "choiceId": 10,
        "text": "Explorer la forêt",
        "timesChosen": 120,
        "percentage": 76.9
      }
    ]
  }
}
```

---

### GET `/statistics/admin/all`
🔒 **Authentification requise** (ADMIN uniquement)

Récupérer les statistiques globales de la plateforme.

**Response 200**:
```json
{
  "success": true,
  "data": {
    "totalUsers": 1250,
    "totalAuthors": 85,
    "totalStories": 342,
    "publishedStories": 256,
    "totalPlays": 15680,
    "totalRatings": 4523,
    "averageRating": 4.2,
    "recentActivity": {
      "newUsersToday": 12,
      "newStoriesToday": 3,
      "playsToday": 567
    }
  }
}
```

---

## ⭐ Notations (Ratings)

### GET `/ratings/:storyId/my-rating`
🔒 **Authentification requise**

Récupérer la note de l'utilisateur pour une histoire.

**Response 200**:
```json
{
  "success": true,
  "data": {
    "id": 42,
    "storyId": 1,
    "userId": 3,
    "score": 5,
    "comment": "Histoire incroyable !",
    "createdAt": "2025-11-27T19:00:00.000Z"
  }
}
```

**Response 404** (si aucune note):
```json
{
  "success": false,
  "message": "Aucune note trouvée"
}
```

---

### POST `/ratings/:storyId`
🔒 **Authentification requise**

Noter une histoire et laisser un commentaire.

**Body**:
```json
{
  "score": number,        // 1-5
  "comment": "string"     // Optionnel
}
```

**Response 201**:
```json
{
  "success": true,
  "data": {
    "id": 43,
    "storyId": 1,
    "userId": 3,
    "score": 4,
    "comment": "Très bonne histoire",
    "createdAt": "2025-11-27T20:00:00.000Z"
  }
}
```

---

### GET `/ratings/:storyId`
🔒 **Authentification requise**

Récupérer toutes les notes d'une histoire.

**Response 200**:
```json
{
  "success": true,
  "data": {
    "storyId": 1,
    "averageRating": 4.5,
    "totalRatings": 42,
    "ratings": [
      {
        "id": 1,
        "score": 5,
        "comment": "Excellente histoire !",
        "user": {
          "id": 5,
          "username": "reader123"
        },
        "createdAt": "2025-11-20T10:00:00.000Z"
      }
    ]
  }
}
```

---

### DELETE `/ratings/:storyId`
🔒 **Authentification requise**

Supprimer sa propre note d'une histoire.

**Response 200**:
```json
{
  "success": true,
  "message": "Note supprimée avec succès"
}
```

---

## 🏁 Fins (Endings)

### POST `/endings/unlock`
🔒 **Authentification requise**

Débloquer une fin pour un utilisateur (appelé automatiquement en fin de partie).

**Body**:
```json
{
  "userId": number,
  "pageId": number
}
```

**Response 201**:
```json
{
  "success": true,
  "data": {
    "id": 15,
    "userId": 3,
    "pageId": 25,
    "page": {
      "endingLabel": "Fin héroïque"
    },
    "unlockedAt": "2025-11-27T21:00:00.000Z"
  }
}
```

---

### GET `/endings/collection/all`
🔒 **Authentification requise**

Récupérer toutes les fins débloquées par l'utilisateur (toutes histoires confondues).

**Response 200**:
```json
{
  "success": true,
  "data": [
    {
      "id": 15,
      "pageId": 25,
      "page": {
        "storyId": 1,
        "story": {
          "title": "La Quête du Dragon"
        },
        "endingLabel": "Fin héroïque"
      },
      "unlockedAt": "2025-11-27T21:00:00.000Z"
    }
  ]
}
```

---

### GET `/endings/:storyId/stats`
🔒 **Authentification requise**

Récupérer les statistiques des fins d'une histoire.

**Response 200**:
```json
{
  "success": true,
  "data": {
    "storyId": 1,
    "totalEndings": 5,
    "endingsStats": [
      {
        "pageId": 25,
        "endingLabel": "Fin héroïque",
        "unlockCount": 45,
        "percentage": 45.9
      },
      {
        "pageId": 30,
        "endingLabel": "Fin tragique",
        "unlockCount": 30,
        "percentage": 30.6
      }
    ]
  }
}
```

---

### GET `/endings/:storyId`
🔒 **Authentification requise**

Récupérer les fins débloquées par l'utilisateur pour une histoire spécifique.

**Response 200**:
```json
{
  "success": true,
  "data": {
    "storyId": 1,
    "totalEndings": 5,
    "unlockedEndings": [
      {
        "id": 15,
        "pageId": 25,
        "endingLabel": "Fin héroïque",
        "unlockedAt": "2025-11-27T21:00:00.000Z"
      }
    ],
    "progress": {
      "unlocked": 2,
      "total": 5,
      "percentage": 40
    }
  }
}
```

---

## ✍️ Auteur (Author)

### GET `/author/dashboard`
🔒 **Authentification requise** (AUTHOR ou ADMIN)

Récupérer le tableau de bord de l'auteur avec toutes ses statistiques.

**Response 200**:
```json
{
  "success": true,
  "data": {
    "author": {
      "id": 1,
      "username": "john_doe",
      "email": "john@example.com"
    },
    "stats": {
      "totalStories": 5,
      "publishedStories": 3,
      "draftStories": 2,
      "totalPlays": 450,
      "totalRatings": 120,
      "averageRating": 4.3
    },
    "recentStories": [
      {
        "id": 1,
        "title": "La Quête du Dragon",
        "status": "PUBLISHED",
        "playCount": 156,
        "averageRating": 4.5,
        "createdAt": "2025-11-20T10:00:00.000Z"
      }
    ]
  }
}
```

---

### GET `/author/stories/:storyId/stats`
🔒 **Authentification requise** (AUTHOR ou ADMIN)

Récupérer les statistiques détaillées d'une de ses histoires.

**Response 200**:
```json
{
  "success": true,
  "data": {
    "storyId": 1,
    "title": "La Quête du Dragon",
    "status": "PUBLISHED",
    "totalPlays": 156,
    "completions": 98,
    "abandonRate": 37.2,
    "averageRating": 4.5,
    "totalRatings": 42,
    "endingsDistribution": [
      {
        "endingLabel": "Fin héroïque",
        "count": 45,
        "percentage": 45.9
      }
    ],
    "recentActivity": {
      "playsLastWeek": 25,
      "newRatingsLastWeek": 8
    }
  }
}
```

---

### GET `/author/profile`
🔒 **Authentification requise** (AUTHOR ou ADMIN)

Récupérer le profil détaillé de l'auteur.

**Response 200**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "role": "AUTHOR",
    "createdAt": "2025-01-15T10:00:00.000Z",
    "storiesCount": 5,
    "totalPlays": 450
  }
}
```

---

### PUT `/author/profile`
🔒 **Authentification requise** (AUTHOR ou ADMIN)

Mettre à jour le profil de l'auteur.

**Body**:
```json
{
  "username": "string",  // Optionnel
  "email": "string"      // Optionnel
}
```

**Response 200**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "username": "new_username",
    "email": "new_email@example.com",
    "updatedAt": "2025-11-27T22:00:00.000Z"
  }
}
```

---

## 👑 Admin

### POST `/admin/users/:id/ban`
🔒 **Authentification requise** (ADMIN uniquement)

Bannir un utilisateur.

**Response 200**:
```json
{
  "success": true,
  "message": "Utilisateur banni avec succès",
  "data": {
    "id": 5,
    "username": "banned_user",
    "isBanned": true
  }
}
```

---

### POST `/admin/users/:id/unban`
🔒 **Authentification requise** (ADMIN uniquement)

Débannir un utilisateur.

**Response 200**:
```json
{
  "success": true,
  "message": "Utilisateur débanni avec succès",
  "data": {
    "id": 5,
    "username": "unbanned_user",
    "isBanned": false
  }
}
```

---

### GET `/admin/users`
🔒 **Authentification requise** (ADMIN uniquement)

Récupérer la liste de tous les utilisateurs.

**Query Parameters**:
- `page` (number): Numéro de page
- `limit` (number): Résultats par page
- `role` (string): Filtrer par rôle (READER, AUTHOR, ADMIN)
- `banned` (boolean): Filtrer les utilisateurs bannis

**Response 200**:
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": 1,
        "username": "john_doe",
        "email": "john@example.com",
        "role": "AUTHOR",
        "isBanned": false,
        "createdAt": "2025-01-15T10:00:00.000Z",
        "storiesCount": 5
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 25,
      "totalUsers": 1250
    }
  }
}
```

---

### POST `/admin/stories/:id/suspend`
🔒 **Authentification requise** (ADMIN uniquement)

Suspendre une histoire (la retirer de la publication).

**Response 200**:
```json
{
  "success": true,
  "message": "Histoire suspendue avec succès",
  "data": {
    "id": 1,
    "title": "Histoire suspendue",
    "status": "DRAFT",
    "isSuspended": true
  }
}
```

---

### POST `/admin/stories/:id/unsuspend`
🔒 **Authentification requise** (ADMIN uniquement)

Rétablir une histoire suspendue.

**Response 200**:
```json
{
  "success": true,
  "message": "Histoire rétablie avec succès",
  "data": {
    "id": 1,
    "title": "Histoire rétablie",
    "isSuspended": false
  }
}
```

---

### GET `/admin/stories`
🔒 **Authentification requise** (ADMIN uniquement)

Récupérer toutes les histoires de la plateforme.

**Query Parameters**:
- `page` (number)
- `limit` (number)
- `status` (string): DRAFT ou PUBLISHED
- `suspended` (boolean): Filtrer les histoires suspendues

**Response 200**:
```json
{
  "success": true,
  "data": {
    "stories": [
      {
        "id": 1,
        "title": "La Quête du Dragon",
        "status": "PUBLISHED",
        "author": {
          "id": 1,
          "username": "john_doe"
        },
        "isSuspended": false,
        "playCount": 156,
        "reportCount": 0,
        "createdAt": "2025-11-20T10:00:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 14,
      "totalStories": 342
    }
  }
}
```

---

### GET `/admin/stats`
🔒 **Authentification requise** (ADMIN uniquement)

Récupérer les statistiques globales de la plateforme.

**Response 200**:
```json
{
  "success": true,
  "data": {
    "users": {
      "total": 1250,
      "readers": 1050,
      "authors": 195,
      "admins": 5,
      "banned": 12
    },
    "stories": {
      "total": 342,
      "published": 256,
      "drafts": 86,
      "suspended": 3
    },
    "activity": {
      "totalPlays": 15680,
      "totalRatings": 4523,
      "averageRating": 4.2,
      "totalReports": 15
    },
    "trends": {
      "newUsersThisWeek": 45,
      "newStoriesThisWeek": 12,
      "playsThisWeek": 1234
    }
  }
}
```

---

## 🚨 Signalements (Reports)

### POST `/reports`
🔒 **Authentification requise**

Signaler une histoire.

**Body**:
```json
{
  "storyId": number,
  "reason": "string"
}
```

**Response 201**:
```json
{
  "success": true,
  "data": {
    "id": 8,
    "storyId": 1,
    "userId": 3,
    "reason": "Contenu inapproprié",
    "status": "PENDING",
    "createdAt": "2025-11-27T23:00:00.000Z"
  }
}
```

---

### GET `/reports`
🔒 **Authentification requise** (ADMIN uniquement)

Récupérer tous les signalements.

**Query Parameters**:
- `status` (string): PENDING, RESOLVED, REJECTED

**Response 200**:
```json
{
  "success": true,
  "data": [
    {
      "id": 8,
      "story": {
        "id": 1,
        "title": "Histoire signalée",
        "author": {
          "username": "john_doe"
        }
      },
      "reporter": {
        "id": 3,
        "username": "reporter_user"
      },
      "reason": "Contenu inapproprié",
      "status": "PENDING",
      "createdAt": "2025-11-27T23:00:00.000Z"
    }
  ]
}
```

---

### GET `/reports/:storyId`
🔒 **Authentification requise** (ADMIN uniquement)

Récupérer tous les signalements d'une histoire spécifique.

**Response 200**:
```json
{
  "success": true,
  "data": [
    {
      "id": 8,
      "storyId": 1,
      "userId": 3,
      "reporter": {
        "username": "reporter_user"
      },
      "reason": "Contenu inapproprié",
      "status": "PENDING",
      "createdAt": "2025-11-27T23:00:00.000Z"
    }
  ]
}
```

---

### PUT `/reports/:reportId`
🔒 **Authentification requise** (ADMIN uniquement)

Mettre à jour le statut d'un signalement.

**Body**:
```json
{
  "status": "RESOLVED" | "REJECTED"
}
```

**Response 200**:
```json
{
  "success": true,
  "data": {
    "id": 8,
    "status": "RESOLVED",
    "updatedAt": "2025-11-27T23:30:00.000Z"
  }
}
```

---

### DELETE `/reports/:reportId`
🔒 **Authentification requise** (ADMIN uniquement)

Supprimer un signalement.

**Response 200**:
```json
{
  "success": true,
  "message": "Signalement supprimé avec succès"
}
```

---

## 🌳 Arbres (Tree)

### GET `/tree/story/:storyId`
🔒 **Authentification requise**

Récupérer l'arbre de navigation d'une histoire.

**Response 200**:
```json
{
  "success": true,
  "data": {
    "storyId": 1,
    "tree": {
      "id": 5,
      "title": "Début",
      "isEnd": false,
      "children": [
        {
          "id": 6,
          "title": "Forêt",
          "isEnd": false,
          "choiceText": "Explorer",
          "children": [...]
        },
        {
          "id": 7,
          "title": "Abri",
          "isEnd": true,
          "endingLabel": "Fin paisible",
          "choiceText": "Chercher abri",
          "children": []
        }
      ]
    }
  }
}
```

---

### POST `/tree/:storyId`
🔒 **Authentification requise** (AUTHOR ou ADMIN)

Construire ou reconstruire l'arbre d'une histoire.

**Response 200**:
```json
{
  "success": true,
  "message": "Arbre construit avec succès",
  "data": {
    "storyId": 1,
    "totalPages": 25,
    "totalChoices": 48,
    "endings": 5
  }
}
```

---

### GET `/tree/journey/:sessionId`
🔒 **Authentification requise**

Récupérer l'arbre du parcours d'un joueur (pages visitées).

**Response 200**:
```json
{
  "success": true,
  "data": {
    "journeyId": 42,
    "storyId": 1,
    "path": [
      {
        "pageId": 5,
        "title": "Début",
        "choiceId": 10,
        "choiceText": "Explorer",
        "visitedAt": "2025-11-27T17:00:00.000Z"
      },
      {
        "pageId": 6,
        "title": "Forêt",
        "choiceId": 15,
        "choiceText": "Avancer",
        "visitedAt": "2025-11-27T17:05:00.000Z"
      }
    ]
  }
}
```

---

### GET `/tree/:treeId`
🔒 **Authentification requise**

Récupérer un arbre sauvegardé spécifique.

**Response 200**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "storyId": 1,
    "visualization": {
      /* Structure JSON de l'arbre */
    },
    "createdAt": "2025-11-27T10:00:00.000Z"
  }
}
```

---

## 🚶 Parcours (Journey)

### POST `/journey`
🔒 **Authentification requise**

Enregistrer une étape du parcours d'un joueur.

**Body**:
```json
{
  "journeyId": number,
  "pageId": number,
  "choiceId": number       // Optionnel
}
```

**Response 201**:
```json
{
  "success": true,
  "data": {
    "id": 105,
    "journeyId": 42,
    "pageId": 6,
    "choiceId": 10,
    "visitedAt": "2025-11-28T10:00:00.000Z"
  }
}
```

---

### GET `/journey/session/:sessionId`
🔒 **Authentification requise**

Récupérer tout le parcours d'une session.

**Response 200**:
```json
{
  "success": true,
  "data": {
    "journey": {
      "id": 42,
      "storyId": 1,
      "status": "completed"
    },
    "steps": [
      {
        "id": 100,
        "page": {
          "id": 5,
          "title": "Début"
        },
        "choice": {
          "id": 10,
          "text": "Explorer"
        },
        "visitedAt": "2025-11-27T17:00:00.000Z"
      }
    ]
  }
}
```

---

### GET `/journey/story/:storyId/user/:userId`
🔒 **Authentification requise**

Récupérer tous les parcours d'un utilisateur pour une histoire.

**Response 200**:
```json
{
  "success": true,
  "data": [
    {
      "id": 42,
      "storyId": 1,
      "status": "completed",
      "startedAt": "2025-11-27T17:00:00.000Z",
      "completedAt": "2025-11-27T18:00:00.000Z",
      "totalSteps": 12
    }
  ]
}
```

---

### GET `/journey/:journeyId`
🔒 **Authentification requise**

Récupérer un parcours spécifique avec tous ses détails.

**Response 200**:
```json
{
  "success": true,
  "data": {
    "id": 42,
    "story": {
      "id": 1,
      "title": "La Quête du Dragon"
    },
    "user": {
      "id": 3,
      "username": "player123"
    },
    "status": "completed",
    "startedAt": "2025-11-27T17:00:00.000Z",
    "completedAt": "2025-11-27T18:00:00.000Z",
    "steps": [
      {
        "id": 100,
        "pageId": 5,
        "choiceId": 10,
        "visitedAt": "2025-11-27T17:00:00.000Z"
      }
    ]
  }
}
```

---

## 🖼️ Images

### POST `/images/upload`
🔒 **Authentification requise** (AUTHOR ou ADMIN)

Uploader une image pour une histoire.

**Body** (mock - dans la vraie app, utiliser FormData):
```json
{
  "url": "string",
  "altText": "string"     // Optionnel
}
```

**Response 201**:
```json
{
  "success": true,
  "data": {
    "id": 15,
    "url": "https://example.com/image.jpg",
    "altText": "Description de l'image",
    "uploadedAt": "2025-11-28T11:00:00.000Z"
  }
}
```

---

### GET `/images/:imageId`
🔒 **Authentification requise**

Récupérer les informations d'une image.

**Response 200**:
```json
{
  "success": true,
  "data": {
    "id": 15,
    "url": "https://example.com/image.jpg",
    "altText": "Description de l'image",
    "uploadedAt": "2025-11-28T11:00:00.000Z"
  }
}
```

---

### DELETE `/images/:imageId`
🔒 **Authentification requise** (AUTHOR ou ADMIN)

Supprimer une image.

**Response 200**:
```json
{
  "success": true,
  "message": "Image supprimée avec succès"
}
```

---

### POST `/images/attach`
🔒 **Authentification requise** (AUTHOR ou ADMIN)

Attacher une image à une page.

**Body**:
```json
{
  "imageId": number,
  "pageId": number
}
```

**Response 200**:
```json
{
  "success": true,
  "data": {
    "imageId": 15,
    "pageId": 5,
    "attachedAt": "2025-11-28T12:00:00.000Z"
  }
}
```

---

## 🎯 Zones Interactives

### POST `/interactive`
🔒 **Authentification requise** (AUTHOR ou ADMIN)

Créer une zone interactive sur une image.

**Body**:
```json
{
  "pageId": number,
  "imageId": number,
  "coordinates": {
    "x": number,
    "y": number,
    "width": number,
    "height": number
  },
  "nextPageId": number
}
```

**Response 201**:
```json
{
  "success": true,
  "data": {
    "id": 25,
    "pageId": 5,
    "imageId": 15,
    "coordinates": "{\"x\":100,\"y\":200,\"width\":50,\"height\":50}",
    "nextPageId": 8,
    "createdAt": "2025-11-28T13:00:00.000Z"
  }
}
```

---

### GET `/interactive/page/:pageId`
🔒 **Authentification requise**

Récupérer toutes les zones interactives d'une page.

**Response 200**:
```json
{
  "success": true,
  "data": [
    {
      "id": 25,
      "imageId": 15,
      "coordinates": {
        "x": 100,
        "y": 200,
        "width": 50,
        "height": 50
      },
      "nextPageId": 8,
      "nextPage": {
        "title": "Porte secrète"
      }
    }
  ]
}
```

---

### GET `/interactive/:zoneId`
🔒 **Authentification requise**

Récupérer une zone interactive spécifique.

**Response 200**:
```json
{
  "success": true,
  "data": {
    "id": 25,
    "pageId": 5,
    "imageId": 15,
    "coordinates": {
      "x": 100,
      "y": 200,
      "width": 50,
      "height": 50
    },
    "nextPageId": 8
  }
}
```

---

### PUT `/interactive/:zoneId`
🔒 **Authentification requise** (AUTHOR ou ADMIN)

Mettre à jour une zone interactive.

**Body**:
```json
{
  "coordinates": {
    "x": number,
    "y": number,
    "width": number,
    "height": number
  },
  "nextPageId": number
}
```

**Response 200**:
```json
{
  "success": true,
  "data": {
    "id": 25,
    "coordinates": {
      "x": 120,
      "y": 220,
      "width": 60,
      "height": 60
    },
    "nextPageId": 10,
    "updatedAt": "2025-11-28T14:00:00.000Z"
  }
}
```

---

### DELETE `/interactive/:zoneId`
🔒 **Authentification requise** (AUTHOR ou ADMIN)

Supprimer une zone interactive.

**Response 200**:
```json
{
  "success": true,
  "message": "Zone interactive supprimée avec succès"
}
```

---

## 🎲 Dés (Dice)

### POST `/dice`
🔒 **Authentification requise** (AUTHOR ou ADMIN)

Créer un choix avec jet de dés.

**Body**:
```json
{
  "pageId": number,
  "text": "string",
  "diceType": "D6" | "D20",
  "minRoll": number,
  "successPageId": number,
  "failurePageId": number
}
```

**Response 201**:
```json
{
  "success": true,
  "data": {
    "id": 10,
    "choiceId": 50,
    "diceType": "D20",
    "minRoll": 15,
    "successPageId": 12,
    "failurePageId": 13,
    "createdAt": "2025-11-28T15:00:00.000Z"
  }
}
```

---

### POST `/dice/roll`
🔒 **Authentification requise**

Lancer un dé pour un choix.

**Body**:
```json
{
  "diceChoiceId": number
}
```

**Response 200**:
```json
{
  "success": true,
  "data": {
    "roll": 18,
    "diceType": "D20",
    "minRoll": 15,
    "success": true,
    "nextPageId": 12,
    "nextPage": {
      "id": 12,
      "title": "Réussite !",
      "content": "Vous réussissez votre jet..."
    }
  }
}
```

---

### GET `/dice/:diceChoiceId`
🔒 **Authentification requise**

Récupérer les informations d'un choix avec dés.

**Response 200**:
```json
{
  "success": true,
  "data": {
    "id": 10,
    "choice": {
      "id": 50,
      "text": "Tenter d'ouvrir le coffre (jet de D20)"
    },
    "diceType": "D20",
    "minRoll": 15,
    "successPage": {
      "id": 12,
      "title": "Coffre ouvert"
    },
    "failurePage": {
      "id": 13,
      "title": "Échec"
    }
  }
}
```

---

### DELETE `/dice/:diceChoiceId`
🔒 **Authentification requise** (AUTHOR ou ADMIN)

Supprimer un choix avec dés.

**Response 200**:
```json
{
  "success": true,
  "message": "Choix avec dés supprimé avec succès"
}
```

---

## 📌 Codes de réponse

### Codes de succès
- **200 OK**: Requête réussie
- **201 Created**: Ressource créée avec succès
- **204 No Content**: Succès sans contenu de réponse

### Codes d'erreur
- **400 Bad Request**: Données invalides
- **401 Unauthorized**: Non authentifié (token manquant ou invalide)
- **403 Forbidden**: Non autorisé (permissions insuffisantes)
- **404 Not Found**: Ressource non trouvée
- **409 Conflict**: Conflit (ex: email déjà utilisé)
- **500 Internal Server Error**: Erreur serveur

### Format d'erreur
```json
{
  "success": false,
  "message": "Description de l'erreur",
  "error": "Détails techniques (en mode dev)"
}
```

---

## 🎯 Résumé des fonctionnalités

### ✅ Niveau 10/20 (Base) - COMPLET
- ✅ Authentification (register, login, profile)
- ✅ CRUD histoires (create, read, update, delete)
- ✅ Gestion pages/scènes (create, read, update, delete)
- ✅ Gestion choix (create, read, update, delete)
- ✅ Lecture histoires (get published, search, start game)
- ✅ Enregistrement parties (sessions, endings)
- ✅ Admin (ban users, suspend stories, global stats)

### ✅ Niveau 13/20 (Avancé) - COMPLET
- ✅ Filtres histoires (theme, tags, search)
- ✅ Statistiques fins (endings stats, distribution)
- ✅ Statistiques parcours (path analysis, popular choices)
- ✅ Fins nommées & collection (unlocked endings)
- ✅ Notations & commentaires (ratings, reviews)
- ✅ Sauvegarde automatique (journey tracking)
- ✅ Signalements (reports)

### ✅ Niveau 16/20 (Auteur UX) - COMPLET
- ✅ Dashboard auteur (author stats, my stories)
- ✅ Stats avancées (detailed stats, abandonment rate)
- ✅ Mode brouillon/publié (status management)
- ✅ Mode preview (preview sessions - à implémenter en front)
- ✅ Illustrations (images upload, attach to pages)

### ✅ Niveau 18/20 (Expert) - COMPLET
- ✅ Arbres histoires (tree visualization)
- ✅ Arbres parcours (journey tree)
- ✅ Illustrations interactives (interactive zones)
- ✅ Système de dés (dice rolls, success/failure)

---

## 🚀 Pour démarrer

### Installation
```bash
cd backend
npm install
```

### Configuration
Créer un fichier `.env`:
```env
PORT=5000
DATABASE_URL="mysql://user:password@localhost:3306/nahb"
JWT_SECRET="votre_secret_jwt_tres_securise"
```

### Lancement
```bash
# Migrer la base de données
npx prisma migrate dev

# Démarrer le serveur
npm start
```

Le backend sera accessible sur `http://localhost:5000/api`

---

## 📞 Support

Pour toute question sur l'API, consultez cette documentation ou contactez l'équipe backend.

**Backend développé à 100%** ✅  
**Prêt pour l'intégration frontend** 🎨

