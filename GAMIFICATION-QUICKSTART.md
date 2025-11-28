# 🎮 Guide Rapide - Nouvelles Fonctionnalités v3.0

## 🚀 Démarrage Rapide

### 1. Installation Backend

```bash
cd backend

# Installer les dépendances (si nécessaire)
npm install

# Seed les achievements
node seedAchievements.js

# Démarrer le serveur
npm run dev
```

### 2. Installation Frontend

```bash
cd frontend

# Installer les dépendances (si nécessaire)
npm install

# Démarrer le dev server
npm run dev
```

### 3. Tester les Fonctionnalités

1. **Créer un compte** ou se connecter
2. **Jouer une histoire** pour gagner de l'XP
3. **Terminer une histoire** pour débloquer des succès
4. **Aller sur "My Profile"** pour voir :
   - 📚 Votre bibliothèque
   - 🏆 Vos succès
   - 🎨 Personnaliser votre avatar

---

## 🎯 Fonctionnalités Principales

### 🏆 Système de Succès

**Accès** : My Profile → Achievements

**Fonctionnalités** :
- 15+ succès à débloquer
- 4 raretés (Common, Rare, Epic, Legendary)
- 6 catégories (Reader, Author, Social, Explorer, Completionist, Special)
- Progression visible pour chaque succès
- Récompenses XP automatiques
- Popup animée lors du déblocage

**Actions qui donnent des succès** :
- Terminer des histoires
- Découvrir des fins
- Poster des commentaires
- Noter des histoires
- Créer des histoires (auteurs)
- Se connecter régulièrement

### 📚 Bibliothèque Personnelle

**Accès** : My Profile → My Library

**4 Sections** :
1. **📖 In Progress** : Histoires en cours avec % de progression
2. **✅ Completed** : Histoires terminées avec fins et temps
3. **❤️ Favorites** : Vos histoires favorites
4. **📋 Lists** : Listes de lecture personnalisées

**Fonctionnalités** :
- Bouton "Continue Reading" direct
- Toggle favori sur toutes les histoires
- Création de listes personnalisées
- Stats en temps réel
- Historique complet

### 🎨 Personnalisation de Profil

**Accès** : My Profile → Customize Profile

**Options disponibles** :
- **Avatar** : 8 styles différents
- **Couleur** : 8 couleurs prédéfinies
- **Cadre** : 6 cadres (None, Bronze, Silver, Gold, Diamond, Legendary)
- **Titre** : Basé sur vos accomplissements
- **Thème** : 6 thèmes (Light, Dark, Fantasy, Sci-Fi, Horror, Mystery)

**Système XP** :
- Niveau affiché avec barre d'XP
- Formule : XP requis = Niveau × 100
- XP gagné par actions (lire, commenter, noter)
- Titres débloqués par niveau ou stats

---

## 💡 Actions & Récompenses

| Action | XP | Effets |
|--------|----|----|
| Terminer une histoire | 100 XP | +1 histoire complétée, check achievements |
| Faire un choix | 5 XP | +1 choix fait |
| Poster un commentaire | 15 XP | +1 commentaire, check achievements |
| Noter une histoire | 10 XP | +1 note donnée, check achievements |
| Débloquer un succès | Variable | Selon rareté (25-1000 XP) |
| Créer une histoire | 0 XP | +1 histoire créée (stats auteur) |

---

## 🎖️ Titres Débloquables

### Par Niveau
- **Niveau 1** : Novice Reader
- **Niveau 5** : Apprentice Reader
- **Niveau 10** : Skilled Reader
- **Niveau 15** : Expert Reader
- **Niveau 20** : Master Reader
- **Niveau 30** : Legendary Reader
- **Niveau 50** : Mythic Reader

### Par Stats
- **10 histoires terminées** : Story Enthusiast
- **20 fins découvertes** : Completionist
- **20 commentaires** : Social Butterfly
- **30 jours actifs** : Veteran
- **1 histoire publiée** : Author
- **5 histoires publiées** : Prolific Author

---

## 🏆 Succès Disponibles

### 📚 Reader (4 succès)
- Premier Pas (1 histoire) - Common - 50 XP
- Lecteur Passionné (5 histoires) - Rare - 100 XP
- Maître des Histoires (20 histoires) - Epic - 250 XP
- Légende Vivante (50 histoires) - Legendary - 500 XP

### 🎯 Completionist (3 succès)
- Collectionneur de Fins (10 fins) - Rare - 150 XP
- Maître des Dénouements (25 fins) - Epic - 300 XP
- Tous les Chemins (50 fins) - Legendary - 600 XP

### 💬 Social (3 succès)
- Première Critique (1 commentaire) - Common - 25 XP
- Critique Littéraire (10 commentaires) - Rare - 100 XP
- Évaluateur Actif (10 notes) - Rare - 100 XP

### ✍️ Author (2 succès)
- Auteur en Herbe (1 histoire) - Rare - 200 XP
- Auteur Prolifique (5 histoires) - Epic - 400 XP

### ⭐ Special (2 succès)
- Dévouement (7 jours) - Epic - 300 XP
- Vétéran (30 jours) - Legendary - 1000 XP

---

## 🔧 API Endpoints

### Achievements
```
GET  /api/achievements/all          # Liste tous les succès
GET  /api/achievements/my           # Mes succès avec progression
POST /api/achievements/seed         # Seed achievements (admin)
```

### Profile
```
GET  /api/profile/my                # Mon profil complet
GET  /api/profile/:userId           # Profil public d'un user
PUT  /api/profile/my                # Mettre à jour personnalisation
GET  /api/profile/leaderboard       # Classement global
```

### Library
```
GET    /api/library                 # Ma bibliothèque complète
POST   /api/library/favorites/:id   # Toggle favori
GET    /api/library/favorites/:id/check  # Check si favori
POST   /api/library/lists           # Créer liste de lecture
POST   /api/library/lists/:listId/stories/:storyId  # Ajouter story
DELETE /api/library/lists/:listId/stories/:storyId  # Retirer story
DELETE /api/library/lists/:listId   # Supprimer liste
```

---

## 📱 Interface Utilisateur

### Navigation
```
Navbar → "My Profile" → 3 onglets:
  - 📚 My Library
  - 🏆 Achievements  
  - 🎨 Customize Profile
```

### Composants Créés
- `Achievements.jsx` - Liste des succès avec filtres
- `AchievementPopup.jsx` - Popup de déblocage animé
- `Library.jsx` - Bibliothèque avec 4 sections
- `ProfileCustomizer.jsx` - Éditeur de profil
- `UserProfile.jsx` - Page principale avec onglets

---

## 🎨 Design

### Couleurs des Raretés
- **Common** : Gris (#9ca3af)
- **Rare** : Bleu (#3b82f6)
- **Epic** : Violet (#a855f7)
- **Legendary** : Or (#f59e0b)

### Animations
- ✨ Popup de succès avec shake et glow
- 📊 Barres de progression animées
- 🎭 Hover effects sur cartes
- 🌟 Glow sur cadres légendaires

### Responsive
- ✅ Mobile-first design
- ✅ Grilles adaptatives
- ✅ Onglets scrollables
- ✅ Touch-friendly

---

## 🧪 Testing

### Tester les Succès
1. Jouer et terminer une histoire → "Premier Pas"
2. Poster un commentaire → "Première Critique"
3. Noter une histoire → Stats mises à jour
4. Vérifier dans "Achievements" la progression

### Tester la Bibliothèque
1. Commencer une histoire → Apparaît dans "In Progress"
2. Terminer l'histoire → Passe dans "Completed"
3. Cliquer ❤️ → Ajout aux favoris
4. Créer une liste → Visible dans "Lists"

### Tester la Personnalisation
1. Changer avatar, couleur, cadre
2. Sélectionner un titre
3. Sauvegarder
4. Vérifier dans la preview
5. Rafraîchir la page → Persistance

---

## 🐛 Troubleshooting

### Les succès ne se débloquent pas
```bash
# Re-seed les achievements
cd backend
node seedAchievements.js
```

### La bibliothèque est vide
- Terminer au moins une histoire (non-preview)
- La bibliothèque se crée automatiquement

### XP ne s'ajoute pas
- Vérifier la console backend pour erreurs
- Vérifier que les routes profile sont actives
- UserProfile créé automatiquement à la première action

### Erreur 404 sur /api/profile
- Vérifier que server.js inclut les nouvelles routes
- Redémarrer le serveur backend

---

## 📚 Documentation Complète

Pour plus de détails :
- 📖 `docs/GAMIFICATION-FEATURES.md` - Documentation complète
- 🎮 `NOUVELLES-FONCTIONNALITES-README.md` - Anciennes features
- 📋 `README.md` - Documentation générale du projet

---

## ✨ Prochaines Améliorations Possibles

- [ ] Leaderboard public visible
- [ ] Badges de profil
- [ ] Achievements secrets
- [ ] Système de quêtes quotidiennes
- [ ] Récompenses cosmétiques
- [ ] Partage de succès sur social
- [ ] Comparaison avec amis
- [ ] Events temporaires

---

## 🎉 Enjoy!

Vous avez maintenant un système de gamification complet ! Les utilisateurs peuvent :
- ✅ Débloquer des succès
- ✅ Progresser en niveau
- ✅ Personnaliser leur profil
- ✅ Organiser leur bibliothèque
- ✅ Collectionner des titres
- ✅ Gagner de l'XP

**Have fun! 🚀🎮**
