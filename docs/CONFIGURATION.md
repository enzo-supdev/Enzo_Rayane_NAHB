# 📋 Configuration & Setup Guide

## Fichiers de Configuration

### Backend

#### `.env` (Variables d'environnement)
```env
# ============================================
# Base de données MySQL + Prisma
# ============================================
DATABASE_URL="mysql://user:password@localhost:3306/nahb_db"
SHADOW_DATABASE_URL="mysql://user:password@localhost:3306/nahb_db_shadow"

# ============================================
# Authentification JWT
# ============================================
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRATION="7d"

# ============================================
# Serveur
# ============================================
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000

# ============================================
# Upload fichiers
# ============================================
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880

# ============================================
# Logger
# ============================================
LOG_LEVEL=debug
```

#### `prisma/schema.prisma`
Défini les modèles de données et les relations.
- 20+ modèles (User, Story, Page, Choice, etc.)
- Relations avec cascading deletes
- Enums (Role, StoryStatus, DiceType, etc.)
- Indices pour performance

#### `package.json`
```json
{
  "name": "nahb-backend",
  "version": "1.0.0",
  "scripts": {
    "dev": "node src/server.js",
    "start": "node src/server.js",
    "test": "jest",
    "test:unit": "jest --testPathPattern=unit",
    "test:integration": "jest --testPathPattern=integration"
  },
  "dependencies": {
    "express": "^4.18.0",
    "@prisma/client": "^4.0.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.0",
    "joi": "^17.9.0"
  },
  "devDependencies": {
    "nodemon": "^2.0.0",
    "jest": "^29.0.0"
  }
}
```

#### `.env.example`
Version de référence du fichier `.env` à commiter dans Git.

### Frontend

#### `.env`
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME="NAHB - Not Another Hero's Book"
VITE_ENVIRONMENT=development
VITE_ENABLE_TREE_VISUALIZATION=true
VITE_ENABLE_DICE_SYSTEM=true
VITE_ENABLE_INTERACTIVE_ZONES=true
```

#### `vite.config.js`
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false
  }
})
```

#### `package.json`
```json
{
  "name": "nahb-frontend",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint src"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "axios": "^1.4.0",
    "react-router-dom": "^6.11.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.0.0",
    "vite": "^4.3.0"
  }
}
```

### Docker

#### `Dockerfile` (Backend)
```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
EXPOSE 5000

CMD ["npm", "start"]
```

#### `Dockerfile` (Frontend)
```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM node:18-alpine
RUN npm install -g serve
COPY --from=builder /app/dist ./dist

EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
```

#### `docker-compose.yml`
Orchestration des services (DB, Backend, Frontend).

---

## Installation Étapes par Étapes

### 1️⃣ Préparation Base de Données

#### MySQL local
```bash
# Créer la base de données
mysql -u root -p
> CREATE DATABASE nahb_db;
> CREATE DATABASE nahb_db_shadow;
> EXIT;
```

#### Ou Docker
```bash
docker run -d \
  --name nahb_mysql \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=nahb_db \
  -p 3306:3306 \
  mysql:8.0
```

### 2️⃣ Configurer Backend

```bash
cd backend

# Copier et éditer le .env
cp .env.example .env

# Éditer avec votre config MySQL
vim .env

# Installer les dépendances
npm install

# Migrations Prisma
npx prisma migrate dev --name init

# Seed les données
npx prisma db seed

# Optionnel : Visualiser la BD
npx prisma studio
```

### 3️⃣ Configurer Frontend

```bash
cd frontend

# Copier le .env
cp .env.example .env

# (Vérifier que VITE_API_URL pointe vers le backend)

# Installer les dépendances
npm install
```

### 4️⃣ Lancer l'Application

#### Option 1 : Développement Local
```bash
# Terminal 1 - Backend
cd backend && npm run dev
# Server on http://localhost:5000

# Terminal 2 - Frontend
cd frontend && npm run dev
# App on http://localhost:3000
```

#### Option 2 : Docker Compose
```bash
docker-compose up -d

# Initialiser après 30 secondes
docker-compose exec backend npx prisma db seed

# Accéder
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
```

---

## Configuration Avancée

### JWT Secret Generation
```bash
# Générer une clé secrète sécurisée
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Puis utiliser dans .env
JWT_SECRET=<the_generated_secret>
```

### Prisma Studio
```bash
# Visualiser et éditer les données
npx prisma studio

# Accès sur http://localhost:5555
```

### MySQL Client
```bash
# Connexion directe à MySQL
mysql -u root -p -h localhost

# Voir les bases
SHOW DATABASES;

# Utiliser nahb_db
USE nahb_db;

# Lister les tables
SHOW TABLES;

# Voir un utilisateur
SELECT * FROM users LIMIT 1;
```

---

## Troubleshooting Configuration

### "Can't find .env file"
```bash
# Vérifier que le fichier existe
ls -la backend/.env

# Créer à partir du template
cp backend/.env.example backend/.env
```

### "DATABASE_URL format error"
```
Format correct:
mysql://user:password@host:port/database

Exemples:
mysql://root:root@localhost:3306/nahb_db
mysql://nahb_user:nahb_password@db:3306/nahb_db (Docker)
```

### "Port 3000 or 5000 already in use"
```bash
# Changer le port dans .env
PORT=5001

# Ou kill le processus existant
# macOS/Linux
lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### "JWT_SECRET not defined"
```bash
# Ajouter à backend/.env
JWT_SECRET="your-secret-key-here"

# Ou générer une nouvelle clé
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### "Migration failed"
```bash
# Réinitialiser (attention: données perdues)
npx prisma migrate reset

# Ou appliquer les migrations
npx prisma migrate deploy

# Vérifier les migrations
npx prisma migrate status
```

---

## Configuration de Production

### Backend `.env` (Production)
```env
NODE_ENV=production
PORT=5000
DATABASE_URL=mysql://prod_user:prod_password@prod_db_host:3306/nahb_prod
SHADOW_DATABASE_URL=mysql://prod_user:prod_password@prod_db_host:3306/nahb_prod_shadow
JWT_SECRET=<very-long-random-secret>
JWT_EXPIRATION=7d
CORS_ORIGIN=https://yourdomain.com
LOG_LEVEL=warn
```

### Déploiement Docker
```bash
# Build images
docker build -t nahb-backend ./backend
docker build -t nahb-frontend ./frontend

# Push to registry
docker tag nahb-backend:latest your-registry/nahb-backend:latest
docker push your-registry/nahb-backend:latest

# Deploy (with docker-compose on production server)
docker-compose -f docker-compose.prod.yml up -d
```

---

## Checklist de Configuration

- [ ] MySQL en cours d'exécution
- [ ] Backend `.env` configuré
- [ ] Frontend `.env` configuré
- [ ] npm install sur backend ET frontend
- [ ] prisma migrate dev
- [ ] prisma db seed
- [ ] Backend tourne sur port 5000
- [ ] Frontend tourne sur port 3000
- [ ] Seed data visibles (npm run prisma studio)
- [ ] Comptes de test accessibles
- [ ] API endpoints répondent aux /health checks

---

**Version** : 1.0.0  
**Dernière mise à jour** : 26/11/2025
