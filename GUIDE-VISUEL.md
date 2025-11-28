# 📖 Guide Visuel - Accès aux Nouvelles Fonctionnalités

## 🚀 Comment accéder aux nouvelles features ?

### Étape 1 : Démarrer l'application

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

### Étape 2 : Se connecter

1. Ouvrir le navigateur : `http://localhost:5173`
2. Se connecter avec un compte existant ou créer un nouveau compte
3. Une fois connecté, vous verrez la barre de navigation

### Étape 3 : Accéder à "Mon Profil"

Dans la barre de navigation en haut de la page, cliquez sur :

```
👤 Mon Profil
```

## 🎯 Navigation dans le Profil

Vous verrez **3 onglets principaux** :

### 1. 📚 My Library (Bibliothèque)

**Accès direct** : Cliquez sur l'onglet "📚 My Library"

**Ce que vous voyez** :
- **Statistiques en haut** : Favoris, En cours, Terminées, Listes
- **4 sous-onglets** :
  - **📖 In Progress** : Histoires en cours avec % de progression
  - **✅ Completed** : Histoires terminées avec badge et temps
  - **❤️ Favorites** : Vos histoires préférées
  - **📋 Lists** : Vos listes de lecture personnalisées

**Actions possibles** :
- ❤️ Ajouter aux favoris (cliquer sur le cœur)
- 📖 Continuer une histoire (bouton "Continue Reading")
- 📋 Créer une liste (bouton "+ Create List")
- 🗑️ Supprimer une liste

---

### 2. 🏆 Achievements (Succès)

**Accès direct** : Cliquez sur l'onglet "🏆 Achievements"

**Ce que vous voyez** :
- **Barre de progression globale** : X/Y débloqués (%)
- **Boutons de filtre** :
  - All (tous)
  - Unlocked (débloqués)
  - Locked (verrouillés)
  - 📚 Reader
  - ✍️ Author
  - 💬 Social
  - 🎯 Completionist

**Cartes de succès** :
- **Débloqués** : Icône visible, nom, description, XP gagné, date
- **Verrouillés** : Icône 🔒, nom ???, progression actuelle

**Comment débloquer** :
- Jouez des histoires
- Terminez des histoires
- Découvrez des fins
- Postez des commentaires
- Notez des histoires

---

### 3. 🎨 Customize Profile (Personnalisation)

**Accès direct** : Cliquez sur l'onglet "🎨 Customize Profile"

**Ce que vous voyez** :

#### Colonne gauche - Preview (Aperçu)
- Avatar avec cadre sélectionné
- Votre nom d'utilisateur
- Votre titre actuel (badge)
- Niveau et barre d'XP

#### Colonne droite - Options
1. **Avatar Style** : Grille de 8 avatars différents
2. **Color** : Palette de 8 couleurs
3. **Frame** : 6 cadres (None, Bronze, Silver, Gold, Diamond, Legendary)
4. **Title** : Menu déroulant avec titres débloqués
5. **Theme** : 6 thèmes (Light, Dark, Fantasy, Sci-Fi, Horror, Mystery)
6. **Bouton "Save Changes"** : Sauvegarder les modifications

**Comment personnaliser** :
1. Cliquez sur un avatar → Il s'affiche dans la preview
2. Cliquez sur une couleur → Le fond de l'avatar change
3. Sélectionnez un cadre → Il apparaît autour de l'avatar
4. Choisissez un titre → Il s'affiche sous votre nom
5. Cliquez "Save Changes" → Vos modifications sont enregistrées

---

## 🎮 Système XP et Niveaux

### Comment gagner de l'XP ?

Visible dans la section "Customize Profile" → Barre d'XP

**Actions qui donnent de l'XP** :
- ✅ Terminer une histoire : **100 XP**
- 🎯 Faire un choix : **5 XP**
- 💬 Poster un commentaire : **15 XP**
- ⭐ Noter une histoire : **10 XP**
- 🏆 Débloquer un succès : **25 à 1000 XP** (selon rareté)

### Formule de niveau
- Niveau 1 → 2 : 100 XP requis
- Niveau 2 → 3 : 200 XP requis
- Niveau 10 → 11 : 1000 XP requis
- **Formule** : XP requis = Niveau × 100

### Titres débloqués par niveau
- Niveau 1 : Novice Reader
- Niveau 5 : Apprentice Reader
- Niveau 10 : Skilled Reader
- Niveau 15 : Expert Reader
- Niveau 20 : Master Reader
- Niveau 30 : Legendary Reader
- Niveau 50 : Mythic Reader

---

## 💡 Fonctionnalités Automatiques

### 1. Ajout automatique aux favoris
Cliquez sur ❤️ sur n'importe quelle carte d'histoire → Ajout instantané

### 2. Suivi automatique de progression
Pendant que vous jouez :
- La progression est enregistrée automatiquement
- Visible dans "In Progress" avec %
- Bouton "Continue Reading" pour reprendre

### 3. Historique automatique
Quand vous terminez une histoire :
- Elle passe automatiquement dans "Completed"
- Affiche la fin atteinte
- Enregistre le temps de lecture
- Enregistre votre note (si vous en avez donné une)

### 4. Déblocage de succès
Automatique dès que vous atteignez l'objectif :
- **Popup animée** apparaît en haut à droite
- Affiche le succès débloqué avec effet de brillance
- XP ajouté automatiquement
- Disparaît après 5 secondes (ou clic sur X)

---

## 📱 Navigation Rapide

### Depuis n'importe où dans l'app

**Navbar** (en haut de chaque page) :
```
🏰 NAHB | 📚 Histoires | 👤 Mon Profil | ✍️ Mes Créations | ⚔️ Administration
```

**Pour accéder rapidement** :
- Profil complet : Cliquez "👤 Mon Profil"
- Bibliothèque : Mon Profil → My Library
- Succès : Mon Profil → Achievements
- Personnalisation : Mon Profil → Customize Profile

---

## 🎨 Exemples Visuels

### Bibliothèque - Section "In Progress"
```
┌────────────────────────────────────────┐
│ 📚 My Library                          │
│ ═══════════════════════════════════════│
│ Stats: 5 Favoris | 3 En cours | ...    │
├────────────────────────────────────────┤
│ [📖 In Progress] [✅ Completed] ...    │
├────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐   │
│  │ [Image]      │  │ [Image]      │   │
│  │ Titre 1      │  │ Titre 2      │   │
│  │ ▓▓▓▓░░░░ 45% │  │ ▓▓▓▓▓▓░░ 78% │   │
│  │ [Continue]❤️ │  │ [Continue]❤️ │   │
│  └──────────────┘  └──────────────┘   │
└────────────────────────────────────────┘
```

### Achievements - Carte de succès
```
┌────────────────────────────────┐
│           🏆                   │
│   Premier Pas           COMMON │
│                                │
│   Terminer votre première     │
│   histoire                     │
│                                │
│   📚 reader                    │
│   +50 XP | Unlocked: 20/11/25  │
└────────────────────────────────┘
```

### Personnalisation - Preview
```
┌──────────────────┐
│   ┌────────────┐ │  Gold Frame
│   │    👤      │ │  
│   │   (Blue)   │ │  Avatar
│   └────────────┘ │
│                  │
│   Username       │
│   [Master Reader]│  Title Badge
│                  │
│   Level 15       │
│   ▓▓▓▓▓▓░░ 750XP │  XP Bar
└──────────────────┘
```

---

## ✅ Checklist de Test

Pour vérifier que tout fonctionne :

- [ ] Se connecter à l'application
- [ ] Voir "👤 Mon Profil" dans la navbar
- [ ] Cliquer sur "Mon Profil"
- [ ] Voir les 3 onglets (Library, Achievements, Customize)
- [ ] Onglet Library → Voir les 4 sections
- [ ] Onglet Achievements → Voir la liste des succès
- [ ] Onglet Customize → Voir la preview et les options
- [ ] Jouer une histoire → XP gagné visible
- [ ] Terminer une histoire → Succès débloqué
- [ ] Popup de succès apparaît
- [ ] Histoire dans "Completed"
- [ ] Favoris fonctionnent (❤️)
- [ ] Personnalisation fonctionne et persiste

---

## 🎉 C'est parti !

Vous êtes maintenant prêt à explorer toutes les nouvelles fonctionnalités ! 

**Bon jeu et amusez-vous bien ! 🚀🎮**
