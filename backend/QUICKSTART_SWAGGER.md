# 🚀 Quickstart Swagger - NAHB API

## Installation rapide

### 1. Installer les dépendances
```bash
cd backend
npm install
```

### 2. Configuration
Créer un fichier `.env` à la racine du dossier `backend` :
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/nahb
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173,http://localhost:3000
JWT_SECRET=your_jwt_secret_key_here
```

### 3. Lancer le serveur
```bash
npm run dev
```

Le serveur démarre sur `http://localhost:5000`

## Accéder à Swagger

### Option 1 : Interface Swagger UI (Recommandé)
```
http://localhost:5000/api-docs
```

### Option 2 : JSON brut
```
http://localhost:5000/swagger.json
```

### Option 3 : HTML Standalone (offline)
Ouvrir le fichier `swagger.html` dans un navigateur (nécessite que le serveur soit lancé)

## Premier Test

### 1. Créer un compte
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "Test123456!",
    "role": "author"
  }'
```

### 2. Se connecter
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123456!"
  }'
```

Copier le token retourné (dans `data.token`)

### 3. Utiliser le token dans Swagger UI
1. Cliquer sur le bouton "Authorize" (en haut à droite)
2. Entrer : `Bearer <votre_token>`
3. Cliquer "Authorize"
4. Maintenant tous les endpoints protégés sont accessibles

## Structure des Fichiers Swagger

```
backend/
├── swagger.json          # Configuration OpenAPI 3.0 complète
├── swagger.html          # Viewer HTML standalone
├── SWAGGER_GUIDE.md      # Guide d'utilisation détaillé
└── server.js             # Intégration dans le serveur Express
```

## Routes Principales

### 🔐 Authentification
- POST `/api/auth/register` - S'inscrire
- POST `/api/auth/login` - Se connecter
- GET `/api/auth/me` - Profil connecté

### 📚 Histoires
- GET `/api/stories` - Lister (avec filtres)
- POST `/api/stories` - Créer
- GET `/api/stories/{id}` - Détails
- PUT `/api/stories/{id}` - Modifier
- DELETE `/api/stories/{id}` - Supprimer

### 🎮 Gameplay
- POST `/api/games/start` - Commencer une partie
- POST `/api/games/{id}/choose` - Faire un choix
- POST `/api/games/dice/roll` - Lancer un dé

### 📊 Plus
- Évaluations, commentaires, statistiques, signalements...
- Administration pour les admins

## Troubleshooting

### Erreur CORS
Vérifier que `CORS_ORIGIN` dans `.env` inclut l'origin du client

### Token invalide
Le token JWT expire. Reconnecter-vous avec `/api/auth/login`

### 404 Not Found
Vérifier l'ID de la ressource existe

### Swagger UI ne charge pas
- Vérifier que le serveur tourne sur port 5000
- Essayer de rafraîchir la page
- Vérifier la console pour les erreurs CORS

## Environnement de Développement vs Production

### Développement
```
http://localhost:5000/api
```

### Production
```
https://api.nahb.com
```

Modifier les URLs dans Swagger en haut de la page

## Documentation Complète

Pour une documentation détaillée, consulter :
- `SWAGGER_GUIDE.md` - Guide complet avec exemples
- `API_DOCUMENTATION.md` - Documentation API originale
- Swagger UI interactive - Explorer les endpoints en temps réel

## Notes

- Tous les endpoints protégés nécessitent un token JWT
- Rate limiting activé (voir SWAGGER_GUIDE.md)
- Uploads limités à 5MB par fichier
- Les histoires sont créées en mode brouillon (draft)

Bon développement ! 🎉
