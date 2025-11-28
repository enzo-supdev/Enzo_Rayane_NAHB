# 🎮 Système de Combat et HP - Guide Auteur

## 📋 Vue d'ensemble

Le système de combat et HP permet aux auteurs de créer des histoires interactives avec gestion des points de vie et des stats du personnage. Les choix peuvent maintenant infliger des dégâts, soigner, ou modifier les statistiques du joueur.

## 🎯 Activation du système

### Dans l'éditeur d'histoire

1. **Ouvrir votre histoire** en mode édition
2. **Cliquer sur l'onglet "⚙️ Paramètres de l'Histoire"**
3. **Cocher "💥 Activer le système de combat"**

### Configuration disponible

#### Options de mort
- **☠️ Autoriser la mort du personnage** : Si activé, les HP peuvent descendre à 0 (Game Over)
- Si désactivé, les HP ne peuvent pas descendre en dessous de 1

#### Limites des statistiques
Configurez les valeurs maximales pour chaque stat :
- **HP Max** : 1-999 (défaut: 100)
- **Attaque Max** : 1-999 (défaut: 100)
- **Défense Max** : 1-999 (défaut: 100)
- **Magie Max** : 1-999 (défaut: 100)

#### Statistiques initiales
Définissez les valeurs de départ du joueur :
- **HP Initiaux** : Points de vie de départ
- **Attaque Initiale** : Puissance d'attaque de base
- **Défense Initiale** : Capacité de défense de base
- **Magie Initiale** : Puissance magique de base

## ⚔️ Configuration des choix avec effets

### Dans l'éditeur de page

Lorsque vous ajoutez un choix à une page, vous verrez une nouvelle section **"⚔️ Effets de Combat"** (si le système est activé).

### Types d'actions disponibles

1. **Aucun effet** : Choix standard sans impact sur les stats
2. **💥 Dégâts** : Le choix fait perdre des HP
3. **💚 Soin** : Le choix restaure des HP
4. **⚔️ Attaque** : Modifie la stat d'attaque
5. **🛡️ Défense** : Modifie la stat de défense
6. **✨ Buff** : Améliore plusieurs stats
7. **💀 Debuff** : Réduit plusieurs stats

### Configuration des effets

Pour chaque choix, vous pouvez définir :

#### HP (Points de Vie)
- **Valeur négative** : Inflige des dégâts
  - Exemple : `-20` = perte de 20 HP
- **Valeur positive** : Soigne le joueur
  - Exemple : `+15` = gain de 15 HP

#### Attaque, Défense, Magie
- **Valeur positive** : Augmente la stat
  - Exemple : `+5` attaque = gain de 5 points d'attaque
- **Valeur négative** : Réduit la stat
  - Exemple : `-3` défense = perte de 3 points de défense

#### Description de l'action
Un texte explicatif pour le joueur :
- "Vous affrontez le garde et perdez 25 HP dans le combat"
- "La potion magique restaure 30 HP"
- "Votre entraînement augmente votre attaque de 10 points"

## 💡 Exemples d'utilisation

### Exemple 1 : Combat avec perte de HP

```
Page : "Affronter le Dragon"
Choix : "Attaquer avec l'épée"
  - Type d'action : Dégâts
  - HP : -30
  - Description : "Le dragon vous blesse avec ses griffes (-30 HP)"
```

### Exemple 2 : Découverte de potion

```
Page : "Coffre mystérieux"
Choix : "Boire la potion rouge"
  - Type d'action : Soin
  - HP : +50
  - Description : "La potion vous revigore (+50 HP)"
```

### Exemple 3 : Entraînement

```
Page : "Camp d'entraînement"
Choix : "S'entraîner au combat"
  - Type d'action : Buff
  - Attaque : +10
  - Défense : +5
  - Description : "Votre entraînement porte ses fruits"
```

### Exemple 4 : Piège

```
Page : "Couloir piégé"
Choix : "Avancer sans précaution"
  - Type d'action : Debuff
  - HP : -15
  - Défense : -5
  - Description : "Le piège vous blesse et affaiblit votre armure"
```

## 🎲 Combinaison avec les dés

Vous pouvez combiner les effets de combat avec les jets de dés :

```
Page : "Porte verrouillée"
Choix : "Forcer la porte"
  - Jet de dé requis : D20 ≥ 15
  - Type d'action : Dégâts
  - HP : -10
  - Description : "Vous vous blessez en forçant (échec = -10 HP)"
```

Si le jet de dé échoue, le joueur subit les dégâts sans atteindre la page suivante.

## ⚡ Gestion automatique

Le système gère automatiquement :

### Limites
- Les stats ne peuvent pas dépasser les valeurs max configurées
- Les stats ne peuvent pas descendre en dessous de 0
- Les HP respectent la limite de mort (0 ou 1 selon configuration)

### Game Over
Si les HP atteignent 0 et que la mort est autorisée :
- Le jeu se termine automatiquement
- Message "Game Over - Your character has died"
- La partie est marquée comme "abandonnée"

## 🎨 Interface joueur

Le joueur verra en permanence :
- 💚 HP actuels / HP max
- ⚔️ Attaque actuelle
- 🛡️ Défense actuelle
- ✨ Magie actuelle

Lors d'un choix avec effet :
- La description de l'action s'affiche
- Les modifications de stats sont appliquées
- Les nouvelles valeurs sont visibles immédiatement

## 🔧 Modèles de données

### Backend - Story Model
```javascript
combatSystem: {
  enabled: Boolean,
  allowDeath: Boolean,
  maxHealth: Number,
  maxAttack: Number,
  maxDefense: Number,
  maxMagic: Number
}
```

### Backend - Choice Model
```javascript
actionType: String, // 'none', 'damage', 'heal', 'attack', 'defend', 'buff', 'debuff'
actionEffects: {
  healthChange: Number,
  attackChange: Number,
  defenseChange: Number,
  magicChange: Number
},
actionDescription: String
```

## 📝 Bonnes pratiques

1. **Équilibrage** : Testez votre histoire pour équilibrer dégâts et soins
2. **Clarté** : Utilisez des descriptions explicites pour les effets
3. **Cohérence** : Gardez une logique cohérente (boss = gros dégâts, etc.)
4. **Alternatives** : Offrez plusieurs chemins avec différents niveaux de risque
5. **Récompenses** : Récompensez l'exploration avec des bonus de stats

## 🚀 Workflow recommandé

1. **Planifier** : Dessinez votre arbre de décisions
2. **Activer** : Cochez le système de combat dans les paramètres
3. **Configurer** : Définissez les limites et stats initiales
4. **Créer** : Ajoutez vos pages et choix
5. **Tester** : Jouez votre histoire en mode preview
6. **Ajuster** : Modifiez les valeurs selon votre expérience
7. **Publier** : Rendez votre histoire publique

## 🎯 Astuces avancées

### Histoires difficiles
- HP Max: 50
- Dégâts fréquents: -15 à -25
- Soins rares: +20 max
- Autoriser la mort

### Histoires narratives
- HP Max: 200
- Dégâts légers: -5 à -10
- Soins généreux: +30 à +50
- Mort désactivée (HP min = 1)

### RPG complet
- HP Max: 100
- Attaque/Défense évolutives
- Boss finaux: -40 HP
- Entraînements: +10 stats
- Équipements: +5 à +15 stats

---

📚 **Documentation complète** : Voir `API_DOCUMENTATION.md` pour les endpoints
🔗 **Architecture** : Voir `docs/architecture/` pour les schémas
