# 🎮 NAHB - Mise à Jour Majeure v2.0

## 🆕 Nouvelles Fonctionnalités Ajoutées

### ✨ Système d'Inventaire Visuel
- 📦 Collecte et gestion d'objets
- 🎨 Interface intuitive avec icônes automatiques
- 🔒 Objets requis pour débloquer certains choix
- 🎁 Récompenses d'objets après certaines actions

### ⚔️ Variables de Personnage (Stats RPG)
- ❤️ Santé (0-100) avec barre de vie colorée
- ⚔️ Attaque - Puissance offensive
- 🛡️ Défense - Protection
- ✨ Magie - Pouvoir magique
- 📊 Interface visuelle moderne avec stats en temps réel

### 🎯 Zones Cliquables sur Images
- 🖼️ Images interactives avec zones cliquables
- 💡 Tooltips informatifs au survol
- 🎨 Animations et effets visuels
- 📱 Support tactile pour mobiles

### ⏱️ Timers sur Choix
- ⏰ Compte à rebours visuel pour créer de la tension
- 🚨 Changement de couleur selon l'urgence (vert → jaune → rouge)
- 🎯 Sélection automatique si temps écoulé
- 📊 Barre de progression décroissante

### 💬 Système de Commentaires
- ⭐ Notation des histoires (1-5 étoiles)
- ✍️ Commentaires textuels avec édition
- ❤️ Système de likes
- 🗑️ Suppression (auteur ou admin)
- 📄 Pagination des commentaires

---

## 📋 Fichiers Créés

### Backend
```
backend/
  models/
    Comment.model.js          ✨ Nouveau modèle
  controllers/
    comment.controller.js     ✨ Contrôleur commentaires
  routes/
    comment.routes.js         ✨ Routes commentaires
```

### Frontend
```
frontend/src/
  components/common/
    Inventory.jsx             ✨ Composant inventaire
    Inventory.css
    PlayerStats.jsx           ✨ Composant stats
    PlayerStats.css
    InteractiveZones.jsx      ✨ Zones interactives
    InteractiveZones.css
    TimedChoice.jsx           ✨ Choix chronométrés
    TimedChoice.css
    CommentsSection.jsx       ✨ Section commentaires
    CommentsSection.css
  services/
    commentService.js         ✨ Service API commentaires
```

### Documentation
```
docs/
  NOUVELLES-FONCTIONNALITES.md  ✨ Guide complet
```

---

## 🎯 Modèles Mis à Jour

### Story
```javascript
{
  hasInventory: Boolean,
  hasCharacterStats: Boolean,
  initialStats: {
    health: 100,
    attack: 10,
    defense: 5,
    magic: 0
  }
}
```

### Choice
```javascript
{
  timeLimit: 30,              // Secondes
  itemRequired: 'Clé',        // Objet requis
  itemGiven: 'Épée',          // Objet donné
  statsModifier: {
    health: -10,
    attack: +5,
    defense: 0,
    magic: +2
  }
}
```

### Game
```javascript
{
  inventory: ['Potion', 'Clé'],
  playerStats: {
    health: 85,
    attack: 15,
    defense: 10,
    magic: 5
  }
}
```

---

## 🚀 Installation et Lancement

### 1. Installer les dépendances

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Charger les données d'exemple

```bash
cd backend
node seed.js
```

Cela créera :
- ✅ 4 utilisateurs (admin, 2 auteurs, 1 lecteur)
- ✅ 3 histoires publiées avec toutes les nouvelles features
- ✅ 1 histoire brouillon

### 3. Lancer l'application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Serveur: http://localhost:5000

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Interface: http://localhost:5173

---

## 🧪 Comptes de Test

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| Admin | admin@nahb.com | admin123 |
| Auteur | fantasy@nahb.com | password123 |
| Auteur | scifi@nahb.com | password123 |
| Lecteur | reader@nahb.com | password123 |

---

## 📚 Histoires d'Exemple

### 1. La Quête du Dragon Éternel 🐉
- ⚔️ Stats de personnage activées
- 📦 Inventaire avec objets collectables
- 🎲 Jets de dés pour actions risquées
- 🎁 Objets : Potion de soin, Carte ancienne, Amulette magique

### 2. Station Orbitale Alpha 🚀
- ⏱️ Choix chronométrés (15-20s)
- 🔧 Items requis pour certaines actions
- 🎲 Manœuvres d'urgence avec dés
- ⚡ Tension dramatique élevée

### 3. Le Mystère du Manoir Abandonné 🏚️
- 🎯 Zones interactives sur images
- 🔑 Système d'énigmes avec objets
- 🖼️ Exploration visuelle immersive

---

## 🎨 Captures d'Écran

### Interface d'Inventaire
```
┌─────────────────────────────────┐
│  📦 Inventaire                  │
├─────────────────────────────────┤
│  ⚔️      🛡️      🧪      🔑    │
│  Épée   Bouclier Potion   Clé   │
└─────────────────────────────────┘
```

### Statistiques du Joueur
```
┌─────────────────────────────────┐
│  ⚔️ Statistiques                │
├─────────────────────────────────┤
│  ❤️ Santé:    [████████░░] 85% │
│  ⚔️ Attaque:  15                │
│  🛡️ Défense:  10                │
│  ✨ Magie:    5                 │
└─────────────────────────────────┘
```

### Timer sur Choix
```
┌─────────────────────────────────┐
│  ⏱️ Temps restant: 0:15         │
│  [██████████████░░░░░░░░] 60%   │
├─────────────────────────────────┤
│  1. Agir rapidement             │
│  2. Réfléchir plus longtemps    │
└─────────────────────────────────┘
```

---

## 📖 Documentation Complète

Pour plus de détails, consultez :
- 📘 [Guide des nouvelles fonctionnalités](./docs/NOUVELLES-FONCTIONNALITES.md)
- 📗 [Documentation API](./docs/API-DOCUMENTATION.md)
- 📕 [Architecture](./docs/architecture/ARCHITECTURE.md)

---

## 🎯 Utilisation des Nouvelles Features

### Créer une Histoire avec Stats

```javascript
const story = {
  title: "Mon Histoire RPG",
  hasCharacterStats: true,
  hasInventory: true,
  initialStats: {
    health: 100,
    attack: 15,
    defense: 10,
    magic: 5
  }
};
```

### Ajouter un Choix avec Timer et Modificateurs

```javascript
const choice = {
  text: "Foncer dans le danger !",
  timeLimit: 15,
  itemGiven: "Épée légendaire",
  statsModifier: {
    health: -20,
    attack: +10,
    defense: 0,
    magic: +5
  }
};
```

### Créer des Zones Interactives

```javascript
const interactiveZones = [
  {
    x: 10,        // Position X (%)
    y: 30,        // Position Y (%)
    width: 20,    // Largeur (%)
    height: 30,   // Hauteur (%)
    shape: 'rectangle',
    description: "Un coffre mystérieux"
  }
];
```

---

## 🔧 Configuration

### Variables d'environnement Backend (.env)

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/nahb
JWT_SECRET=votre_secret_jwt
NODE_ENV=development
```

### Variables Frontend (vite.config.js)

```javascript
server: {
  port: 5173,
  proxy: {
    '/api': 'http://localhost:5000'
  }
}
```

---

## 🐛 Dépannage

### L'inventaire ne s'affiche pas
✅ Vérifiez que `hasInventory: true` dans Story
✅ Vérifiez que `game.inventory` existe

### Les stats ne changent pas
✅ Vérifiez `hasCharacterStats: true` dans Story
✅ Vérifiez `statsModifier` dans Choice

### Le timer ne démarre pas
✅ Vérifiez que `timeLimit` est défini (en secondes)
✅ Vérifiez la console pour erreurs JavaScript

### Zones interactives invisibles
✅ Vérifiez les coordonnées (0-100%)
✅ Vérifiez que l'image est bien chargée

---

## 🚀 Prochaines Étapes

- [ ] Tests unitaires avec Jest
- [ ] Mode multijoueur coopératif
- [ ] Éditeur visuel de zones interactives
- [ ] Système de succès/achievements
- [ ] Export/Import d'histoires
- [ ] Traduction multi-langues

---

## 👥 Contribution

Les contributions sont bienvenues ! N'hésitez pas à :
1. Fork le projet
2. Créer une branche feature
3. Commit vos changements
4. Push vers la branche
5. Ouvrir une Pull Request

---

## 📄 Licence

MIT License - Voir le fichier LICENSE pour plus de détails

---

## 🎉 Remerciements

Merci d'utiliser NAHB ! Ces nouvelles fonctionnalités transforment la plateforme en un système complet de narration interactive moderne.

**Version**: 2.0  
**Date**: Novembre 2025  
**Équipe**: Enzo & Rayane

---

*Créez des histoires inoubliables avec NAHB ! 📖✨*
