# 🚀 Guide d'Installation - Projet NAHB

## 📋 Table des matières

1. [Prérequis](#prérequis)
2. [Installation Première Fois](#installation-première-fois)
3. [Configuration](#configuration)
4. [Lancement du Projet](#lancement-du-projet)
5. [Comptes de Test](#comptes-de-test)
6. [Vérification](#vérification)
7. [Dépannage](#dépannage)
8. [Commandes Utiles](#commandes-utiles)

---

## 🔧 Prérequis

Avant de commencer, assure-toi d'avoir installé :

### Obligatoire
- **Node.js** (version 18 ou supérieure) - [Télécharger](https://nodejs.org/)
- **MySQL** (version 8.0 ou supérieure) - [Télécharger](https://dev.mysql.com/downloads/installer/)
- **Git** - [Télécharger](https://git-scm.com/downloads)

### Recommandé
- **VS Code** - [Télécharger](https://code.visualstudio.com/)
- **Extension REST Client** pour VS Code (pour tester l'API)
- **Postman** (alternative pour tester l'API) - [Télécharger](https://www.postman.com/downloads/)

### Vérifier les installations

Ouvre PowerShell ou un terminal et vérifie que tout est installé :

```bash
# Vérifier Node.js (doit afficher v18.x.x ou supérieur)
node --version

# Vérifier npm (doit afficher 9.x.x ou supérieur)
npm --version

# Vérifier MySQL (doit afficher 8.x.x)
mysql --version

# Vérifier Git
git --version
```

---

## 📥 Installation Première Fois

### 1. Cloner le projet

```bash
# Va dans le dossier où tu veux installer le projet
cd D:/workspace/2025-2026/FULLSTACK

# Clone le projet (remplace par l'URL de ton Git)
git clone [URL_DU_GIT] NAHB
cd NAHB
```

### 2. Installer les dépendances

#### Backend

```bash
cd backend
npm install
```

**Packages installés automatiquement :**
- express
- @prisma/client
- bcryptjs
- jsonwebtoken
- cors
- helmet
- dotenv

#### Frontend

```bash
cd ../frontend
npm install
```

**Packages installés automatiquement :**
- react
- react-dom
- react-router-dom
- axios
- vite

---

## ⚙️ Configuration

### 1. Configuration MySQL

#### Démarrer MySQL

**Windows :**
```bash
# Méthode 1 : Via les Services Windows
# Recherche "Services" → Trouve "MySQL80" → Clic droit → Démarrer

# Méthode 2 : Via ligne de commande (Admin)
net start MySQL80
```

**Mac/Linux :**
```bash
sudo systemctl start mysql
# OU
brew services start mysql
```

#### Créer la base de données

```bash
# Se connecter à MySQL (mot de passe root demandé)
mysql -u root -p

# Dans le prompt MySQL, exécute ces commandes :
```

```sql
-- Créer la base de données
CREATE DATABASE nahb_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Créer la base shadow pour Prisma (optionnel mais recommandé)
CREATE DATABASE nahb_db_shadow CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Vérifier
SHOW DATABASES;

-- Quitter MySQL
EXIT;
```

### 2. Configuration Backend

#### Créer le fichier `.env`

**Emplacement :** `backend/.env`

```bash
cd backend

# Copier le fichier exemple (si il existe)
cp .env.example .env

# OU créer un nouveau fichier .env
```

**Contenu du fichier `backend/.env` :**

```env
# ============================================
# Base de données MySQL
# ============================================
# Format: mysql://utilisateur:motdepasse@host:port/nom_base
DATABASE_URL="mysql://root:ton_mot_de_passe_mysql@localhost:3306/nahb_db"
SHADOW_DATABASE_URL="mysql://root:ton_mot_de_passe_mysql@localhost:3306/nahb_db_shadow"

# ============================================
# Authentification JWT
# ============================================
# Générer une clé secrète aléatoire sécurisée
JWT_SECRET="ton-super-secret-jwt-tres-long-et-securise-ici"
JWT_EXPIRATION="7d"

# ============================================
# Serveur
# ============================================
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173

# ============================================
# Upload fichiers (optionnel)
# ============================================
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880
```

**⚠️ IMPORTANT - Remplace :**
- `ton_mot_de_passe_mysql` par ton vrai mot de passe MySQL root
- `ton-super-secret-jwt-...` par une chaîne aléatoire longue

**Générer un JWT_SECRET sécurisé :**

```bash
# Windows PowerShell
[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes([System.Guid]::NewGuid()))

# Mac/Linux/Git Bash
openssl rand -base64 32

# Ou simplement utilise un long texte aléatoire
# Exemple: "hJ8sK2mP9xQ4rT6vW1yZ3bN5cM7dF0gH2jL4kN6pR8sT0uW2xY4zA6"
```

### 3. Configuration Frontend

#### Créer le fichier `.env`

**Emplacement :** `frontend/.env`

```bash
cd ../frontend

# Créer le fichier .env
```

**Contenu du fichier `frontend/.env` :**

```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=NAHB - Not Another Hero's Book
```

---

## 🎬 Lancement du Projet

### Première Fois - Initialisation Base de Données

**Une seule fois après l'installation :**

```bash
cd backend

# 1. Générer le client Prisma
npx prisma generate

# 2. Créer les tables dans la base de données
npx prisma migrate dev --name init

# 3. Remplir la base avec des données de test
npx prisma db seed
```

**Ce que ça fait :**
- Crée toutes les tables (users, stories, pages, choices, etc.)
- Crée 5 utilisateurs de test (admin, auteur, lecteur)
- Crée 3 histoires complètes avec pages et choix
- Crée des données de jeu, notations, etc.

### Démarrage Normal

#### Méthode 1 : Deux terminaux séparés (Recommandé)

**Terminal 1 - Backend :**
```bash
cd backend
npm run dev
```

**Attends de voir :**
```
🚀 Serveur démarré sur le port 5000
```

**Terminal 2 - Frontend :**
```bash
cd frontend
npm run dev
```

**Attends de voir :**
```
VITE v4.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
```

#### Méthode 2 : Script unique (Optionnel)

**À la racine du projet, crée un fichier `start.bat` (Windows) :**

```batch
@echo off
echo 🚀 Démarrage de NAHB...

start "NAHB Backend" cmd /k "cd backend && npm run dev"
timeout /t 3
start "NAHB Frontend" cmd /k "cd frontend && npm run dev"

echo ✅ Backend et Frontend lancés !
echo 🌐 Frontend: http://localhost:5173
echo 🔌 API: http://localhost:5000
```

**Ou `start.sh` (Mac/Linux) :**

```bash
#!/bin/bash
echo "🚀 Démarrage de NAHB..."

cd backend && npm run dev &
sleep 3
cd frontend && npm run dev &

echo "✅ Backend et Frontend lancés !"
echo "🌐 Frontend: http://localhost:5173"
echo "🔌 API: http://localhost:5000"
```

Puis lance simplement :
```bash
# Windows
./start.bat

# Mac/Linux
chmod +x start.sh
./start.sh
```

---

## 👤 Comptes de Test

Après avoir exécuté `npx prisma db seed`, tu peux te connecter avec :

### Compte Admin
```
Email: admin@nahb.com
Mot de passe: password123
```
**Accès :** Tout + Panel admin

### Compte Auteur
```
Email: auteur@nahb.com
Mot de passe: password123
```
**Accès :** Créer/modifier histoires + Dashboard auteur

### Compte Lecteur
```
Email: lecteur@nahb.com
Mot de passe: password123
```
**Accès :** Lire histoires, faire des parties

### Autres comptes
```
Email: alice@example.com | bob@example.com
Mot de passe: password123
```

---

## ✅ Vérification

### 1. Vérifier que tout fonctionne

#### Backend (API)

Ouvre ton navigateur et va sur :

```
http://localhost:5000/api/health
```

**Réponse attendue :**
```json
{
  "status": "OK",
  "message": "API NAHB en ligne"
}
```

#### Frontend

Ouvre ton navigateur et va sur :

```
http://localhost:5173
```

**Tu devrais voir :**
- La page d'accueil de NAHB
- Un bouton "Connexion"
- Un bouton "Inscription"

#### Base de données

```bash
cd backend

# Ouvrir Prisma Studio (interface graphique)
npx prisma studio
```

**Dans ton navigateur (http://localhost:5555) :**
- Vérifie qu'il y a des utilisateurs dans la table `users`
- Vérifie qu'il y a des histoires dans la table `stories`
- Explore les autres tables

### 2. Test complet de connexion

1. Va sur http://localhost:5173
2. Clique sur "Connexion"
3. Entre les identifiants : `lecteur@nahb.com` / `password123`
4. Clique sur "Se connecter"
5. Tu devrais être redirigé vers la liste des histoires

**✅ Si ça marche, tout est bon !**

---

## 🐛 Dépannage

### Problème : "Port 5000 is already in use"

**Solution :**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID [PID_NUMBER] /F

# Mac/Linux
lsof -i :5000
kill -9 [PID_NUMBER]
```

### Problème : "Cannot connect to database"

**Vérifications :**
1. MySQL est-il démarré ?
   ```bash
   # Windows
   net start MySQL80
   ```

2. Le mot de passe dans `.env` est-il correct ?
   ```bash
   # Teste la connexion manuellement
   mysql -u root -p
   ```

3. La base de données existe-t-elle ?
   ```sql
   SHOW DATABASES;
   ```

### Problème : "JWT_SECRET is not defined"

**Solution :**
Vérifie que le fichier `backend/.env` existe et contient `JWT_SECRET=...`

```bash
# Afficher le contenu du .env
cat backend/.env

# Si le fichier n'existe pas, crée-le avec le bon contenu
```

### Problème : "Prisma Client is not generated"

**Solution :**
```bash
cd backend
npx prisma generate
```

### Problème : "Table 'nahb_db.users' doesn't exist"

**Solution :**
```bash
cd backend

# Option 1 : Appliquer les migrations
npx prisma migrate dev

# Option 2 : Reset complet (ATTENTION : efface toutes les données)
npx prisma migrate reset
```

### Problème : Frontend - "Failed to fetch"

**Vérifications :**
1. Le backend est-il démarré sur le port 5000 ?
2. Le fichier `frontend/.env` contient-il `VITE_API_URL=http://localhost:5000/api` ?
3. Redémarre le frontend après avoir modifié le `.env`

### Problème : "Module not found" ou erreurs d'import

**Solution :**
```bash
# Backend
cd backend
rm -rf node_modules
npm install

# Frontend
cd frontend
rm -rf node_modules
npm install
```

---

## 🛠️ Commandes Utiles

### Backend

```bash
cd backend

# Démarrer le serveur en mode développement
npm run dev

# Ouvrir Prisma Studio (interface base de données)
npx prisma studio

# Créer une nouvelle migration
npx prisma migrate dev --name nom_de_la_migration

# Appliquer les migrations
npx prisma migrate deploy

# Reset complet de la base (ATTENTION : efface tout)
npx prisma migrate reset

# Regénérer le client Prisma
npx prisma generate

# Re-seed les données
npx prisma db seed

# Voir les logs de migration
npx prisma migrate status
```

### Frontend

```bash
cd frontend

# Démarrer le serveur de développement
npm run dev

# Build pour la production
npm run build

# Prévisualiser le build de production
npm run preview

# Linter (vérifier le code)
npm run lint
```

### Git (pour se synchroniser)

```bash
# Récupérer les dernières modifications
git pull

# Voir l'état des fichiers
git status

# Créer une nouvelle branche
git checkout -b ma-branche

# Envoyer ses modifications
git add .
git commit -m "Description des modifications"
git push
```

---

## 📚 Documentation Supplémentaire

### Fichiers importants à consulter

- **README.md** - Vue d'ensemble du projet
- **NIVEAU-10-COMPLET.md** - Documentation des fonctionnalités backend
- **FRONTEND-SERVICES-CREES.md** - Documentation des services frontend
- **backend/test-api.http** - Exemples de requêtes API (ouvrir avec REST Client)
- **docs/API.md** - Documentation complète de l'API
- **docs/ARCHITECTURE.md** - Architecture du projet

### URLs Importantes

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:5173 | Interface utilisateur |
| Backend API | http://localhost:5000/api | API REST |
| API Health | http://localhost:5000/api/health | Vérifier si l'API fonctionne |
| Prisma Studio | http://localhost:5555 | Interface base de données |

---

## 🎯 Workflow de Développement

### Première fois
1. ✅ Cloner le projet
2. ✅ Installer les dépendances (npm install)
3. ✅ Configurer les fichiers `.env`
4. ✅ Créer la base de données MySQL
5. ✅ Lancer les migrations Prisma
6. ✅ Seed les données de test
7. ✅ Démarrer backend et frontend
8. ✅ Tester avec un compte de test

### Tous les jours
1. `git pull` pour récupérer les modifications
2. `npm install` (si package.json a changé)
3. `npx prisma migrate dev` (si le schéma a changé)
4. Démarrer backend : `npm run dev`
5. Démarrer frontend : `npm run dev`
6. Coder ! 🚀

### Avant de commit
1. Vérifier que tout fonctionne
2. Tester les nouvelles fonctionnalités
3. `git add .`
4. `git commit -m "Description claire"`
5. `git push`

---

## 🆘 Besoin d'aide ?

### En cas de problème

1. **Vérifie les logs** dans le terminal (backend et frontend)
2. **Consulte la section Dépannage** ci-dessus
3. **Vérifie les fichiers `.env`** (erreurs les plus fréquentes)
4. **Reset la base de données** en dernier recours :
   ```bash
   cd backend
   npx prisma migrate reset
   npx prisma db seed
   ```

### Ressources

- **Documentation Prisma :** https://www.prisma.io/docs
- **Documentation React :** https://react.dev
- **Documentation Express :** https://expressjs.com
- **Documentation Vite :** https://vitejs.dev

---

## ✨ Checklist de Démarrage Rapide

Utilise cette checklist pour ton collègue :

```
Installation Complète :
□ Node.js installé (v18+)
□ MySQL installé et démarré
□ Projet cloné depuis Git
□ Backend : npm install
□ Frontend : npm install
□ Fichier backend/.env créé et configuré
□ Fichier frontend/.env créé
□ Base de données créée (nahb_db)
□ npx prisma generate
□ npx prisma migrate dev
□ npx prisma db seed
□ Backend démarre sur :5000
□ Frontend démarre sur :5173
□ Connexion avec lecteur@nahb.com réussie
□ API health répond OK

✅ Tout fonctionne !
```

---

**Bon développement ! 🚀**

*Dernière mise à jour : 27 novembre 2024*