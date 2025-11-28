# 🎮 Nouvelles Fonctionnalités NAHB - Guide Complet

## 📋 Vue d'ensemble

Ce document détaille les nouvelles fonctionnalités ajoutées à l'application NAHB (Narratives and Adventures Hypertext Book) pour enrichir l'expérience interactive des récits.

---

## ✨ Fonctionnalités Implémentées

### 1. 📦 Système d'Inventaire

**Description**: Les joueurs peuvent collecter et gérer des objets tout au long de leur aventure.

**Caractéristiques**:
- Interface visuelle intuitive avec icônes pour chaque objet
- Gestion automatique de l'inventaire dans le modèle Game
- Objets requis pour certains choix (système de verrouillage)
- Objets donnés en récompense lors de certains choix

**Utilisation dans les choix**:
```javascript
{
  itemRequired: 'Clé rouillée',  // Objet nécessaire pour ce choix
  itemGiven: 'Épée magique'       // Objet reçu après ce choix
}
```

**Composant Frontend**: `Inventory.jsx`
- Affichage en grille avec icônes automatiques
- Animations au survol
- Indication visuelle si l'inventaire est vide

---

### 2. ⚔️ Variables de Personnage (Stats RPG)

**Description**: Système de statistiques de personnage pour ajouter une dimension RPG aux histoires.

**Statistiques disponibles**:
- ❤️ **Santé (Health)**: 0-100
- ⚔️ **Attaque (Attack)**: Puissance offensive
- 🛡️ **Défense (Defense)**: Protection
- ✨ **Magie (Magic)**: Pouvoir magique

**Configuration de l'histoire**:
```javascript
{
  hasCharacterStats: true,
  initialStats: {
    health: 100,
    attack: 15,
    defense: 10,
    magic: 5
  }
}
```

**Modificateurs de stats dans les choix**:
```javascript
{
  statsModifier: {
    health: -10,    // Perte de santé
    attack: +5,     // Gain d'attaque
    defense: 0,     // Pas de changement
    magic: +2       // Gain de magie
  }
}
```

**Composant Frontend**: `PlayerStats.jsx`
- Barre de santé avec code couleur (vert/jaune/rouge)
- Affichage visuel des stats avec icônes
- Animations et effets visuels

---

### 3. 🎯 Zones Cliquables sur Images

**Description**: Ajout de zones interactives sur les images pour une exploration immersive.

**Types de zones**:
- Rectangle
- Cercle
- Polygone (pour formes complexes)

**Configuration d'une zone**:
```javascript
{
  x: 10,              // Position X en %
  y: 30,              // Position Y en %
  width: 20,          // Largeur en %
  height: 30,         // Hauteur en %
  shape: 'rectangle', // rectangle | circle | polygon
  targetPage: pageId, // Page de destination
  description: 'Un coffre mystérieux'
}
```

**Composant Frontend**: `InteractiveZones.jsx`
- Zones surbrillées au survol
- Tooltips avec descriptions
- Animations pulsantes pour attirer l'attention
- Support tactile pour mobiles

---

### 4. ⏱️ Timers sur Choix

**Description**: Ajout de contraintes temporelles pour créer de la tension dramatique.

**Configuration**:
```javascript
{
  timeLimit: 30  // Durée en secondes
}
```

**Comportements**:
- Compte à rebours visuel avec barre de progression
- Changement de couleur selon l'urgence (vert → jaune → rouge)
- Animations d'alerte en cas de temps critique
- Sélection automatique du premier choix si timeout
- Désactivation des choix après expiration

**Composant Frontend**: `TimedChoice.jsx`
- Timer affiché en format MM:SS
- Animations pulsantes en mode urgence
- Message de timeout personnalisable

---

### 5. 💬 Système de Commentaires

**Description**: Les utilisateurs peuvent commenter et noter les histoires.

**Fonctionnalités**:
- ⭐ Notation par étoiles (1-5)
- ✍️ Commentaires textuels (max 1000 caractères)
- ❤️ Système de likes
- ✏️ Édition de ses propres commentaires
- 🗑️ Suppression (auteur ou admin)
- 📄 Pagination des commentaires
- 🕐 Horodatage et indication de modification

**Composant Frontend**: `CommentsSection.jsx`
- Interface intuitive avec formulaire de création
- Affichage des étoiles interactives
- Gestion des likes en temps réel
- Mode édition inline

**Routes API**:
```
POST   /api/stories/:storyId/comments
GET    /api/stories/:storyId/comments
PUT    /api/comments/:commentId
DELETE /api/comments/:commentId
POST   /api/comments/:commentId/like
```

---

## 🎨 Interface Utilisateur

### Composants Créés

1. **Inventory.jsx** + **Inventory.css**
   - Grille responsive d'objets
   - Icônes automatiques par type d'objet
   - Effet hover avec transformation 3D

2. **PlayerStats.jsx** + **PlayerStats.css**
   - Design en dégradé moderne
   - Barre de santé dynamique
   - Stats en grille avec icônes

3. **InteractiveZones.jsx** + **InteractiveZones.css**
   - Overlay transparent sur image
   - Zones surbrillées au hover
   - Tooltips informatifs

4. **TimedChoice.jsx** + **TimedChoice.css**
   - Timer visuel avec animations
   - Choix désactivés après expiration
   - Barre de progression décroissante

5. **CommentsSection.jsx** + **CommentsSection.css**
   - Interface de commentaires complète
   - Système de notation par étoiles
   - Gestion des likes et édition

---

## 📊 Modèles de Données Mis à Jour

### Story Model
```javascript
{
  hasInventory: Boolean,
  hasCharacterStats: Boolean,
  initialStats: {
    health: Number,
    attack: Number,
    defense: Number,
    magic: Number
  }
}
```

### Choice Model
```javascript
{
  timeLimit: Number,           // Secondes
  itemRequired: String,        // Nom de l'objet requis
  itemGiven: String,           // Objet donné
  statsModifier: {             // Modificateurs de stats
    health: Number,
    attack: Number,
    defense: Number,
    magic: Number
  }
}
```

### Game Model
```javascript
{
  inventory: [String],         // Liste des objets
  playerStats: {               // Stats actuelles
    health: Number,
    attack: Number,
    defense: Number,
    magic: Number
  }
}
```

### Comment Model (nouveau)
```javascript
{
  story: ObjectId,
  author: ObjectId,
  content: String,
  rating: Number,
  likes: [ObjectId],
  isEdited: Boolean,
  editedAt: Date
}
```

---

## 🎯 Exemples d'Utilisation

### Histoire 1: Fantasy avec Stats et Inventaire
```javascript
- Stats initiales: HP 100, ATK 15, DEF 10, MAG 5
- Inventaire activé
- Choix modifiant les stats
- Items à collecter (Potion, Carte, Amulette)
```

### Histoire 2: Sci-Fi avec Timers
```javascript
- Stats activées
- Choix chronométrés (15-20 secondes)
- Items requis pour certaines actions
- Jets de dés pour actions critiques
```

### Histoire 3: Mystère avec Zones Interactives
```javascript
- Zones cliquables sur images
- Items à découvrir
- Énigmes visuelles
```

---

## 🚀 Lancer l'Application

### Backend
```bash
cd backend
npm install
node seed.js      # Charger les données d'exemple
npm run dev       # Démarrer le serveur
```

### Frontend
```bash
cd frontend
npm install
npm run dev       # Démarrer l'interface
```

---

## 🧪 Données de Test

Le fichier `seed.js` créé automatiquement :
- 4 utilisateurs (admin, 2 auteurs, 1 lecteur)
- 4 histoires avec différentes features
  - Histoire 1: Fantasy avec stats et inventaire complet
  - Histoire 2: Sci-Fi avec timers et items
  - Histoire 3: Mystère avec zones interactives
  - Histoire 4: Brouillon (non publié)

**Identifiants de test**:
```
Admin:    admin@nahb.com / admin123
Auteur 1: fantasy@nahb.com / password123
Auteur 2: scifi@nahb.com / password123
Lecteur:  reader@nahb.com / password123
```

---

## 📱 Responsive Design

Toutes les nouvelles fonctionnalités sont responsive :
- Grille d'inventaire adaptive
- Stats compactées sur mobile
- Zones interactives tactiles
- Timer optimisé pour petits écrans
- Commentaires en colonne sur mobile

---

## 🔧 Personnalisation

### Ajouter un Nouveau Type d'Objet

Dans `Inventory.jsx`, ajouter l'icône :
```javascript
const icons = {
  'nouveauItem': '🎁',
  // ...
};
```

### Modifier les Stats Initiales

Dans la création de l'histoire :
```javascript
initialStats: {
  health: 150,  // Augmenter la santé
  attack: 20,   // Personnaliser
  // ...
}
```

---

## 🐛 Débogage

### Problèmes Courants

1. **Inventaire ne s'affiche pas**
   - Vérifier `hasInventory: true` dans Story
   - Vérifier que Game.inventory existe

2. **Timer ne fonctionne pas**
   - Vérifier `timeLimit` dans Choice
   - Console pour erreurs JavaScript

3. **Stats ne changent pas**
   - Vérifier `statsModifier` dans Choice
   - Vérifier que `hasCharacterStats: true`

4. **Zones interactives invisibles**
   - Vérifier coordonnées (0-100%)
   - Vérifier que l'image est chargée

---

## 🎉 Conclusion

Ces nouvelles fonctionnalités transforment NAHB en une plateforme de récits interactifs complète et moderne, offrant :
- 🎮 Mécaniques de jeu RPG
- 🖼️ Exploration visuelle immersive
- ⏰ Tension narrative avec timers
- 💬 Engagement communautaire via commentaires
- 📦 Système de progression avec inventaire

L'application est maintenant prête pour créer des expériences narratives riches et engageantes !

---

**Version**: 2.0
**Date**: Novembre 2025
**Auteur**: Équipe NAHB
