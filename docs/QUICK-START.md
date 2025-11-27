# ⚡ Quick Start - 5 Minutes

Guide ultra-rapide pour démarrer NAHB en 5 minutes.

## 🎯 Checklist Express

```bash
# 1️⃣ INSTALLER (2 min)
git clone [URL_GIT]
cd NAHB
cd backend && npm install
cd ../frontend && npm install

# 2️⃣ CRÉER LA BASE (30 sec)
mysql -u root -p
# Dans MySQL:
CREATE DATABASE nahb_db;
EXIT;

# 3️⃣ CONFIGURER (1 min)
# Copier les fichiers .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Éditer backend/.env:
# - Ligne 4: Remplacer "password" par ton mot de passe MySQL
# - Ligne 10: Mettre une longue clé aléatoire pour JWT_SECRET

# 4️⃣ INITIALISER (1 min)
cd backend
npx prisma generate
npx prisma migrate dev
npx prisma db seed

# 5️⃣ LANCER (30 sec)
# Terminal 1:
cd backend
npm run dev

# Terminal 2:
cd frontend
npm run dev

# ✅ DONE!
# Frontend: http://localhost:5173
# Backend: http://localhost:5000
```

## 🔐 Se Connecter

```
Email: lecteur@nahb.com
Password: password123
```

## 🆘 Problème ?

Consulte [INSTALLATION-GUIDE.md](./INSTALLATION-GUIDE.md) pour le guide détaillé.

## 📋 Checklist de Vérification

- [ ] Node.js installé
- [ ] MySQL démarré
- [ ] `npm install` dans backend/
- [ ] `npm install` dans frontend/
- [ ] `backend/.env` créé et configuré
- [ ] `frontend/.env` créé
- [ ] Base `nahb_db` créée
- [ ] `npx prisma migrate dev` exécuté
- [ ] `npx prisma db seed` exécuté
- [ ] Backend sur :5000
- [ ] Frontend sur :5173
- [ ] Connexion réussie

✅ **Tout marche !**

---

**Temps total : 5 minutes** ⏱️