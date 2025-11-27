# 📦 Installation Complète du Backend NAHB

## Prérequis

- ✅ Node.js v18 ou supérieur
- ✅ MongoDB v6 ou supérieur
- ✅ npm ou yarn
- ✅ Git

## Installation Étape par Étape

### 1️⃣ Installation de MongoDB

#### Windows
```powershell
# Téléchargez et installez MongoDB depuis:
# https://www.mongodb.com/try/download/community

# Créez le dossier de données
mkdir C:\data\db

# Démarrez MongoDB
net start MongoDB
```

#### Mac (via Homebrew)
```bash
brew tap mongodb/brew
brew install mongodb-community@6
brew services start mongodb-community
```

#### Linux (Ubuntu)
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
```

### 2️⃣ Cloner et configurer le projet

```bash
# Cloner le repo
git clone <your-repo-url>
cd Enzo_Rayane_NAHB/backend

# Installer les dépendances
npm install
```

### 3️⃣ Configuration

Le fichier `.env` existe déjà avec des valeurs par défaut. Pour la production, modifiez :

```env
# Changez absolument ce secret en production !
JWT_SECRET=votre_nouveau_secret_tres_securise_et_long

# Optionnel : personnalisez d'autres variables
PORT=5000
MONGODB_URI=mongodb://localhost:27017/nahb
CORS_ORIGIN=http://localhost:5173
```

### 4️⃣ Vérifier la connexion MongoDB

```bash
# Test de connexion
mongosh
> use nahb
> db.stats()
```

Si ça fonctionne, MongoDB est prêt ! 🎉

### 5️⃣ Lancer le serveur

```bash
# Mode développement (avec hot-reload)
npm run dev
```

Vous devriez voir :
```
✅ Connected to MongoDB
🚀 Server running on port 5000
📝 Environment: development
```

### 6️⃣ Peupler la base de données avec des exemples

```bash
# Créer des données de test
npm run seed
```

Cela va créer :
- 4 utilisateurs (admin, 2 auteurs, 1 lecteur)
- 3 histoires complètes
- Des pages et des choix

**Identifiants de test :**
```
Admin:    admin@nahb.com / admin123
Author 1: fantasy@nahb.com / password123
Author 2: scifi@nahb.com / password123
Reader:   reader@nahb.com / password123
```

### 7️⃣ Tester l'API

#### Via curl

```bash
# Health check
curl http://localhost:5000/api/health

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"fantasy@nahb.com","password":"password123"}'

# Liste des histoires
curl http://localhost:5000/api/stories
```

#### Via navigateur

Ouvrez : http://localhost:5000/api/stories

#### Via Postman / Thunder Client

Importez les requêtes depuis `API_DOCUMENTATION.md`

---

## 🐛 Résolution de problèmes

### MongoDB ne démarre pas

**Erreur : "Unable to start service"**
```bash
# Windows : vérifier le service
sc query MongoDB

# Redémarrer
net stop MongoDB
net start MongoDB
```

**Erreur : "Can't connect to MongoDB"**
```bash
# Vérifier que MongoDB écoute
netstat -an | findstr "27017"

# Tester la connexion
mongosh mongodb://localhost:27017
```

### Port 5000 déjà utilisé

```bash
# Changer le port dans .env
PORT=5001

# Ou tuer le processus (Windows)
netstat -ano | findstr :5000
taskkill /PID <pid> /F
```

### npm install échoue

```bash
# Nettoyer le cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Erreur "Cannot find module"

```bash
# Réinstaller
npm install
```

---

## ✅ Checklist d'installation

- [ ] Node.js v18+ installé
- [ ] MongoDB installé et démarré
- [ ] Dépendances npm installées
- [ ] Fichier .env configuré
- [ ] Connexion MongoDB OK
- [ ] Serveur démarre sans erreur
- [ ] Health check répond
- [ ] Seed exécuté avec succès
- [ ] Login API fonctionne

---

## 🚀 Prochaines étapes

1. ✅ Backend installé et fonctionnel
2. 📱 Installer et démarrer le frontend
3. 🔗 Connecter frontend et backend
4. 🎨 Tester l'application complète

Consultez le `QUICKSTART.md` pour plus de détails !
