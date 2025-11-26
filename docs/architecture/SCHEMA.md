# 📋 Schéma de Données - NAHB

## Diagramme Entité-Relation (Niveau 16/20)

```
USER (1 --- Many) STORY
  ├─ id (PK)                    STORY
  ├─ pseudo (UNIQUE)              ├─ id (PK)
  ├─ email (UNIQUE)               ├─ title
  ├─ password (hash)              ├─ description
  ├─ role (ENUM)                  ├─ tags (JSON)
  ├─ isBanned                     ├─ status (DRAFT/PUBLISHED)
  └─ timestamps                   ├─ authorId (FK → User)
                                  ├─ startPageId (FK → Page)
     USER (1 --- Many) RATING      └─ timestamps
     ├─ id (PK)
     ├─ score (1-5)             PAGE (Many --- 1) STORY
     ├─ comment                    ├─ id (PK)
     ├─ userId (FK)               ├─ content (TEXT)
     ├─ storyId (FK)              ├─ isEnd (BOOLEAN)
     └─ UNIQUE(userId, storyId)   ├─ order (INT)
                                  ├─ storyId (FK)
                                  └─ timestamps
     USER (1 --- Many) GAME_SESSION

GAME_SESSION                    CHOICE (Many --- 1) PAGE
  ├─ id (PK)                      ├─ id (PK)
  ├─ userId (FK)                  ├─ text
  ├─ storyId (FK)                 ├─ pageId (FK)
  ├─ endPageId (FK → Page)        ├─ targetPageId (FK → Page)
  └─ playedAt                     ├─ order
                                  └─ timestamps

USER (1 --- Many) UNLOCKED_ENDING

UNLOCKED_ENDING
  ├─ id (PK)
  ├─ userId (FK)
  ├─ storyId (FK)
  ├─ pageId (FK → Page/isEnd)
  ├─ UNIQUE(userId, storyId, pageId)
  └─ unlockedAt

USER (1 --- Many) PLAYER_JOURNEY

PLAYER_JOURNEY                  JOURNEY_STEP
  ├─ id (PK)                      ├─ id (PK)
  ├─ userId (FK)                  ├─ journeyId (FK)
  ├─ storyId (FK)                 ├─ pageId (FK)
  ├─ status (in_progress/...)     ├─ choiceId (FK, nullable)
  ├─ startedAt                    ├─ stepOrder
  ├─ completedAt (nullable)       └─ visitedAt
  └─ updatedAt

USER (1 --- 1) AUTHOR_PROFILE

AUTHOR_PROFILE
  ├─ id (PK)
  ├─ userId (FK, UNIQUE)
  ├─ bio
  ├─ profileImage
  └─ timestamps

STORY (1 --- Many) STATISTICS
STORY (1 --- Many) STORY_STATISTICS

STATISTICS
  ├─ id (PK)
  ├─ storyId (FK, UNIQUE)
  ├─ totalPlays
  ├─ completedPlays
  ├─ abandonedPlays
  ├─ averageRating
  └─ totalRatings

STORY_STATISTICS
  ├─ id (PK)
  ├─ storyId (FK)
  ├─ pageId (FK)
  ├─ viewCount
  ├─ chosenCount
  └─ UNIQUE(storyId, pageId)

STORY (1 --- Many) REPORT
  
REPORT
  ├─ id (PK)
  ├─ storyId (FK)
  ├─ userId (FK)
  ├─ reason
  ├─ status (pending/resolved/dismissed)
  ├─ details
  └─ timestamps

STORY (1 --- Many) PLAYER_JOURNEY

PAGE (1 --- Many) INTERACTIVE_ZONE
  
INTERACTIVE_ZONE
  ├─ id (PK)
  ├─ pageId (FK)
  ├─ targetPageId (FK)
  ├─ shapeType (rectangle/circle/polygon)
  ├─ coordinates (JSON)
  ├─ tooltip
  ├─ order
  └─ timestamps

PAGE (1 --- Many) IMAGE

IMAGE
  ├─ id (PK)
  ├─ pageId (FK, nullable)
  ├─ authorId (FK)
  ├─ url
  ├─ filename
  ├─ mimeType
  └─ timestamps

CHOICE (1 --- 0..1) DICE_CHOICE

DICE_CHOICE
  ├─ id (PK)
  ├─ choiceId (FK, UNIQUE)
  ├─ diceType (D6/D20/D100)
  ├─ requiredValue
  ├─ condition (=/>=/<=/>/< )
  ├─ successPageId (FK)
  ├─ failPageId (FK)
  └─ timestamps

DICE_CHOICE (1 --- Many) DICE_ROLL

DICE_ROLL
  ├─ id (PK)
  ├─ diceChoiceId (FK)
  ├─ result (INT)
  ├─ success (BOOLEAN)
  └─ rolledAt

STORY (1 --- 1) STORY_TREE

STORY_TREE
  ├─ id (PK)
  ├─ storyId (FK, UNIQUE)
  ├─ nodes (JSON)
  └─ timestamps

STORY_TREE (1 --- Many) TREE_NODE
  
TREE_NODE
  ├─ id (PK)
  ├─ treeId (FK)
  ├─ pageId (FK)
  ├─ x (FLOAT)
  ├─ y (FLOAT)
  ├─ level (INT)
  └─ order (INT)

STORY (1 --- Many) PATH_ANALYSIS

PATH_ANALYSIS
  ├─ id (PK)
  ├─ storyId (FK)
  ├─ pageId (FK)
  ├─ percentage (FLOAT)
  ├─ totalVisits (INT)
  └─ UNIQUE(storyId, pageId)

STORY (1 --- Many) PREVIEW_SESSION

PREVIEW_SESSION
  ├─ id (PK)
  ├─ authorId (FK)
  ├─ storyId (FK)
  ├─ currentPageId (FK, nullable)
  └─ timestamps
```

---

## 📊 Dictionnaire de Données

### USER (Utilisateurs)

| Colonne | Type | Null | Clé | Description |
|---------|------|------|-----|-------------|
| id | VARCHAR(36) | Non | PK | UUID unique |
| pseudo | VARCHAR(50) | Non | UNIQUE | Nom d'utilisateur |
| email | VARCHAR(100) | Non | UNIQUE | Adresse email |
| password | VARCHAR(255) | Non | | Hash bcrypt (10 rounds) |
| role | ENUM | Non | | READER / AUTHOR / ADMIN |
| isBanned | BOOLEAN | Non | | Défaut: false |
| createdAt | DATETIME | Non | | Date création |
| updatedAt | DATETIME | Non | | Date modification |
| Indices | | | | email, pseudo |

### STORY (Histoires)

| Colonne | Type | Null | Clé | Description |
|---------|------|------|-----|-------------|
| id | VARCHAR(36) | Non | PK | UUID unique |
| title | VARCHAR(200) | Non | | Titre histoire |
| description | TEXT | Non | | Description longue |
| tags | JSON | Oui | | Tags/Catégories |
| status | ENUM | Non | | DRAFT / PUBLISHED |
| authorId | VARCHAR(36) | Non | FK | Référence User |
| startPageId | VARCHAR(36) | Oui | FK | Page de départ |
| createdAt | DATETIME | Non | | Date création |
| updatedAt | DATETIME | Non | | Date modification |
| Indices | | | | authorId, status |

### PAGE (Pages/Scènes)

| Colonne | Type | Null | Clé | Description |
|---------|------|------|-----|-------------|
| id | VARCHAR(36) | Non | PK | UUID unique |
| storyId | VARCHAR(36) | Non | FK | Référence Story |
| content | TEXT | Non | | Texte de la page |
| isEnd | BOOLEAN | Non | | Est-ce une fin ? |
| order | INT | Non | | Ordre affichage |
| createdAt | DATETIME | Non | | Date création |
| updatedAt | DATETIME | Non | | Date modification |
| Indices | | | | storyId, isEnd |

### CHOICE (Choix)

| Colonne | Type | Null | Clé | Description |
|---------|------|------|-----|-------------|
| id | VARCHAR(36) | Non | PK | UUID unique |
| pageId | VARCHAR(36) | Non | FK | Page source |
| text | VARCHAR(500) | Non | | Texte du choix |
| targetPageId | VARCHAR(36) | Non | FK | Page cible |
| order | INT | Non | | Ordre affichage |
| createdAt | DATETIME | Non | | Date création |
| updatedAt | DATETIME | Non | | Date modification |
| Indices | | | | pageId, targetPageId |

### RATING (Notations)

| Colonne | Type | Null | Clé | Description |
|---------|------|------|-----|-------------|
| id | VARCHAR(36) | Non | PK | UUID unique |
| userId | VARCHAR(36) | Non | FK | Utilisateur |
| storyId | VARCHAR(36) | Non | FK | Histoire notée |
| score | TINYINT | Non | | 1-5 étoiles |
| comment | VARCHAR(500) | Oui | | Commentaire |
| createdAt | DATETIME | Non | | Date création |
| updatedAt | DATETIME | Non | | Date modification |
| Indices | | | | storyId |
| Unique | | | | (userId, storyId) |

### GAME_SESSION (Sessions de jeu)

| Colonne | Type | Null | Clé | Description |
|---------|------|------|-----|-------------|
| id | VARCHAR(36) | Non | PK | UUID unique |
| userId | VARCHAR(36) | Non | FK | Joueur |
| storyId | VARCHAR(36) | Non | FK | Histoire jouée |
| endPageId | VARCHAR(36) | Non | FK | Fin atteinte |
| playedAt | DATETIME | Non | | Date partie |
| Indices | | | | userId, storyId, endPageId |

### UNLOCKED_ENDING (Fins déverrouillées)

| Colonne | Type | Null | Clé | Description |
|---------|------|------|-----|-------------|
| id | VARCHAR(36) | Non | PK | UUID unique |
| userId | VARCHAR(36) | Non | FK | Joueur |
| storyId | VARCHAR(36) | Non | FK | Histoire |
| pageId | VARCHAR(36) | Non | FK | Fin atteinte |
| unlockedAt | DATETIME | Non | | Date déverrouillage |
| Indices | | | | storyId, pageId |
| Unique | | | | (userId, storyId, pageId) |

### PLAYER_JOURNEY (Parcours joueur)

| Colonne | Type | Null | Clé | Description |
|---------|------|------|-----|-------------|
| id | VARCHAR(36) | Non | PK | UUID unique |
| userId | VARCHAR(36) | Non | FK | Joueur |
| storyId | VARCHAR(36) | Non | FK | Histoire |
| status | VARCHAR(20) | Non | | in_progress/completed/abandoned |
| startedAt | DATETIME | Non | | Date début |
| completedAt | DATETIME | Oui | | Date fin |
| updatedAt | DATETIME | Non | | Dernière mise à jour |
| Indices | | | | userId, storyId, status |

### JOURNEY_STEP (Étapes du parcours)

| Colonne | Type | Null | Clé | Description |
|---------|------|------|-----|-------------|
| id | VARCHAR(36) | Non | PK | UUID unique |
| journeyId | VARCHAR(36) | Non | FK | Parcours |
| pageId | VARCHAR(36) | Non | FK | Page visitée |
| choiceId | VARCHAR(36) | Oui | FK | Choix fait |
| stepOrder | INT | Non | | Ordre étape |
| visitedAt | DATETIME | Non | | Timestamp visite |
| Indices | | | | journeyId, pageId |

---

## 🔑 Clés Primaires et Étrangères

### Primary Keys
- Tous les modèles utilisent UUID v4
- Générés côté application

### Foreign Keys
- Cascading deletes pour les relations
- Références intégrité maintenue
- Indexes automatiques sur FK

### Unique Constraints
- pseudo, email dans USER
- (userId, storyId) dans RATING
- (userId, storyId, pageId) dans UNLOCKED_ENDING
- (storyId, pageId) dans STORY_STATISTICS

---

## 📈 Indices (Indexes)

**Sur clés étrangères** (auto par Prisma)
- storyId
- pageId
- userId
- authorId

**Sur filtres courants**
- User.email, User.pseudo
- Story.status, Story.authorId
- Page.storyId, Page.isEnd
- Rating.storyId
- PlayerJourney.status

---

## 💾 Normalisation

**3NF (Third Normal Form)**
- Pas de données redondantes
- Dépendances fonctionnelles correctes
- Pas de colonnes partiellement dépendantes

**Exceptions acceptées**
- tags en JSON (dénormalisé volontairement pour performance)
- coordinates en JSON (pour flexibilité)
- nodes en JSON (pour tree structure)

---

**Dernière mise à jour** : 26/11/2025  
**Version schéma** : 1.0.0 (Niveau 16/20)
