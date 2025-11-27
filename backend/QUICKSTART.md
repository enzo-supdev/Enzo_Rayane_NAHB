# 🚀 Guide de Démarrage Rapide - NAHB Backend

## Option 1 : Démarrage Local (Recommandé pour développement)

### 1. Prérequis
- Node.js v18+ installé
- MongoDB v6+ installé et en cours d'exécution

### 2. Installation

```bash
cd backend
npm install
```

### 3. Configuration

Le fichier `.env` est déjà configuré avec des valeurs par défaut pour le développement local.

**Important** : Changez `JWT_SECRET` en production !

### 4. Démarrer MongoDB

**Windows :**
```powershell
# Si MongoDB est installé comme service
net start MongoDB

# Ou avec mongod directement
mongod --dbpath "C:\data\db"
```

**Mac/Linux :**
```bash
# Via Homebrew
brew services start mongodb-community

# Ou directement
mongod --config /usr/local/etc/mongod.conf
```

### 5. Lancer le serveur

```bash
# Mode développement (avec hot-reload)
npm run dev

# Le serveur démarre sur http://localhost:5000
```

### 6. Vérifier que ça fonctionne

```bash
# Health check
curl http://localhost:5000/api/health
```

Vous devriez voir :
```json
{"status":"OK","timestamp":"..."}
```

---

## Option 2 : Démarrage avec Docker

### 1. Prérequis
- Docker et Docker Compose installés

### 2. Démarrer tous les services

```bash
# Depuis la racine du projet
docker-compose up -d

# Voir les logs
docker-compose logs -f backend

# Arrêter les services
docker-compose down
```

Le backend sera accessible sur `http://localhost:5000`

---

## 🧪 Tester l'API

### Créer un compte

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "test123",
    "role": "author"
  }'
```

Vous recevrez un token JWT dans la réponse.

### Se connecter

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123"
  }'
```

### Créer une histoire (avec le token)

```bash
curl -X POST http://localhost:5000/api/stories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "Ma Première Aventure",
    "description": "Une histoire test",
    "theme": "fantasy"
  }'
```

---

## 📊 Accéder à MongoDB

### Via MongoDB Compass (GUI)

Connection string : `mongodb://localhost:27017/nahb`

### Via mongosh (CLI)

```bash
mongosh
use nahb
db.users.find()
```

---

## 🔧 Scripts disponibles

```bash
npm start          # Démarrer en mode production
npm run dev        # Démarrer en mode développement
npm test           # Lancer les tests
npm run test:coverage  # Tests avec couverture
```

---

## 📁 Structure des données

Après le premier démarrage, les collections suivantes seront créées dans MongoDB :

- `users` - Utilisateurs
- `stories` - Histoires
- `pages` - Pages/scènes
- `choices` - Choix
- `games` - Parties en cours/terminées
- `ratings` - Notes et commentaires
- `reports` - Signalements

---

## 🐛 Résolution de problèmes

### MongoDB ne démarre pas

**Windows :**
```powershell
# Vérifier si le service existe
sc query MongoDB

# Créer le répertoire de données
mkdir C:\data\db
```

### Port 5000 déjà utilisé

Modifier le port dans `.env` :
```env
PORT=5001
```

### Erreur de connexion MongoDB

Vérifier que MongoDB est bien démarré :
```bash
mongosh --eval "db.adminCommand('ping')"
```

### Erreur JWT

Vérifier que `JWT_SECRET` est bien défini dans `.env`

---

## 📖 Documentation complète

- [README.md](./README.md) - Documentation complète du projet
- [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) - Documentation de l'API

---

## 🎯 Prochaines étapes

1. ✅ Backend démarré
2. 📱 Démarrer le frontend (voir `frontend/README.md`)
3. 🎨 Tester l'application complète sur `http://localhost:5173`
4. 📊 Créer des données de test
5. 🚀 Déployer en production

---

## 💡 Conseils

- Utilisez **Postman** ou **Thunder Client** (VS Code) pour tester l'API
- Consultez les logs du serveur pour débugger
- Les images uploadées sont dans `backend/uploads/`
- En mode dev, les erreurs sont détaillées dans la réponse

---

Besoin d'aide ? Consultez la documentation complète ou les issues GitHub !
