# 🚀 Guide de Démarrage Rapide - NAHB

## ⚡ Démarrage en 5 minutes (Local)

### Prérequis
```bash
✓ Node.js 18+ installé
✓ npm 9+ installé
✓ MySQL 8.0+ en cours d'exécution
```

### 1️⃣ Cloner et installer

```bash
# Cloner le repo
git clone https://github.com/enzo-supdev/Enzo_Rayane_NAHB.git
cd Enzo_Rayane_NAHB

# Backend
cd backend
npm install

# Frontend (nouvelle fenêtre)
cd frontend
npm install
```

### 2️⃣ Configuration base de données

```bash
# Backend/.env
cd backend
cp .env.example .env

# Éditer .env avec vos credentials MySQL:
# DATABASE_URL="mysql://user:password@localhost:3306/nahb_db"
# SHADOW_DATABASE_URL="mysql://user:password@localhost:3306/nahb_db_shadow"
# JWT_SECRET="secret-key-random"
```

### 3️⃣ Initialiser la BD

```bash
cd backend

# Migration Prisma
npx prisma migrate dev --name init

# Seed les données de test
npx prisma db seed
```

### 4️⃣ Lancer les serveurs

```bash
# Terminal 1 - Backend
cd backend
npm run dev
# Server sur http://localhost:5000

# Terminal 2 - Frontend
cd frontend
npm run dev
# App sur http://localhost:5173
```

### 5️⃣ Tester

Accédez à `http://localhost:5173` et connectez-vous avec :
```
Email: lecteur@nahb.com
Password: password123
```

---

## 🐳 Démarrage avec Docker (3 étapes)

### 1️⃣ Docker Compose

```bash
# À la racine du projet
docker-compose up -d

# Attendre ~30 secondes le lancement des services
```

### 2️⃣ Initialiser la BD

```bash
# Dans une autre fenêtre
docker-compose exec backend npx prisma migrate deploy
docker-compose exec backend npx prisma db seed
```

### 3️⃣ Accéder à l'app

- **Frontend** : http://localhost:3000
- **Backend API** : http://localhost:5000/api
- **MySQL** : localhost:3306

---

## 📚 Premiers Pas

### Comptes de test (après seed)

| Rôle | Email | Mot de passe |
|------|-------|-------------|
| Admin | admin@nahb.com | password123 |
| Auteur 1 | auteur@nahb.com | password123 |
| Auteur 2 | auteur2@nahb.com | password123 |
| Lecteur 1 | lecteur@nahb.com | password123 |
| Lecteur 2 | lecteur2@nahb.com | password123 |

### Ce que vous pouvez faire

#### Comme Lecteur 📖
1. Se connecter
2. Voir la liste des histoires publiées
3. Lire "L'Aventure Fantastique"
4. Faire des choix et atteindre une fin
5. Noter et commenter l'histoire
6. Voir vos fins déverrouillées

#### Comme Auteur ✍️
1. Se connecter
2. Accédez au dashboard "Mes histoires"
3. Créez une nouvelle histoire (titre, description, tags)
4. Ajoutez des pages (scènes)
5. Créez des choix reliant les pages
6. Publiez votre histoire
7. Consultez les statistiques

#### Comme Admin 👑
1. Se connecter avec le compte admin
2. Accédez à la zone admin
3. Consultez les statistiques globales
4. Gérez les utilisateurs (bannir si besoin)

---

## 🔧 Commands Utiles

### Backend

```bash
cd backend

# Lancer en mode dev
npm run dev

# Voir les endpoints API
npm run test

# Générer migration
npx prisma migrate dev --name nom_migration

# Voir la BD dans l'interface Prisma
npx prisma studio

# Reset la BD (développement)
npx prisma migrate reset
```

### Frontend

```bash
cd frontend

# Mode développement
npm run dev

# Build production
npm run build

# Prévisualiser le build
npm run preview
```

### Docker

```bash
# Démarrer tous les services
docker-compose up -d

# Arrêter
docker-compose down

# Logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db

# Lancer une commande dans un container
docker-compose exec backend npx prisma studio
docker-compose exec db mysql -u root -p
```

---

## 🐛 Troubleshooting

### "Port 3000/5000 already in use"
```bash
# Tuer le processus sur le port
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :3000
kill -9 <PID>
```

### "Cannot connect to database"
```bash
# Vérifier que MySQL est en cours d'exécution
mysql -u root -p

# Tester la connexion
npx prisma db execute --stdin < test.sql
```

### "JWT_SECRET undefined"
```bash
# Assurez-vous que .env existe et est configuré
cat backend/.env

# Régénérer une clé secrète (remplacer YOUR_SECRET)
openssl rand -base64 32
```

### "Migration pending"
```bash
cd backend
# Appliquer les migrations
npx prisma migrate deploy

# Ou réinitialiser en dev
npx prisma migrate reset
```

---

## 📊 Vérifier l'Installation

### Backend Health

```bash
# Test ping
curl http://localhost:5000/api/health

# Réponse attendue
{ "status": "ok", "timestamp": "2025-11-26T..." }
```

### Frontend

Accédez à http://localhost:5173 et vous devriez voir :
- Page de login
- Champs email et password
- Lien "Créer un compte"

### Base de données

```bash
# Se connecter à MySQL
mysql -u root -p

# Utiliser la DB
USE nahb_db;

# Voir les tables
SHOW TABLES;

# Vérifier un compte
SELECT * FROM users LIMIT 1;
```

---

## 📈 Structure des Fichiers Clés

```
NAHB/
├── backend/
│   ├── .env                    # Configuration locale
│   ├── prisma/
│   │   ├── schema.prisma       # Modèles de données
│   │   └── seed.js             # Données de test
│   └── src/
│       ├── server.js           # Point d'entrée
│       ├── routes/             # 45+ endpoints
│       └── controllers/        # Logique métier
│
├── frontend/
│   ├── .env                    # Configuration API
│   └── src/
│       ├── main.jsx            # Entrée React
│       ├── components/         # Composants
│       └── services/           # Appels API
│
└── docs/
    ├── architecture/           # Documentation technique
    └── mockups/               # Wireframes
```

---

## 🎯 Prochaines Étapes

1. **Exploration** : Utilisez les comptes de test
2. **Lecture** : Consultez `README.md` pour la doc complète
3. **Architecture** : Lisez `docs/architecture/ARCHITECTURE.md`
4. **Code** : Parcourez les contrôleurs backend pour comprendre le flow
5. **Tests** : Lancez `npm test` pour valider

---

## 📞 Besoin d'aide ?

### Documentation complète
- **README.md** : Vue d'ensemble, installation, features
- **ARCHITECTURE.md** : Flux de données, patterns, scalabilité
- **SCHEMA.md** : Modèles de données, relations, dictionnaire
- **NEEDS.txt** : Checklist de complétude par niveau

### Fichiers importants
- **prisma/schema.prisma** : Tous les modèles avec relations
- **routes/** : Endpoints disponibles
- **.env.example** : Variables à configurer

---

**Statut** : ✅ Niveau 16/20 - Prêt pour la présentation  
**Dernière mise à jour** : 26/11/2025  
**Version** : 1.0.0
