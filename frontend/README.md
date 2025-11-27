# Frontend NAHB - Thème Médiéval 🏰

Application React avec Vite et thème médiéval complet.

## 🎨 Thème Médiéval

- **Palette de couleurs** : Marrons, ors, rouges sang
- **Typographie** : 
  - Titres : Cinzel Decorative (médiéval)
  - Headers : Cinzel
  - Corps : IM Fell English (style parchemin)
- **Design** : Cartes effet parchemin, bordures style bois, ombres profondes
- **Animations** : Effets de scintillement, hover avec élévation

## 🚀 Démarrage

```bash
# Installer les dépendances
npm install

# Lancer en développement (port 3000)
npm run dev

# Build pour production
npm run build
```

## 📁 Structure

```
src/
├── components/
│   ├── auth/
│   │   └── ProtectedRoute.jsx
│   └── common/
│       └── Navbar.jsx
├── context/
│   └── AuthContext.jsx
├── hooks/
│   └── useAuth.js
├── pages/
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   └── StoryList.jsx
├── services/
│   ├── api.js
│   ├── authService.js
│   ├── storyService.js
│   └── gameService.js
├── styles/
│   ├── variables.css
│   └── global.css
├── App.jsx
└── main.jsx
```

## ✨ Fonctionnalités

- ✅ Authentification complète (login/register)
- ✅ Navigation avec Navbar médiévale
- ✅ Page d'accueil avec hero section
- ✅ Liste des histoires avec filtres
- ✅ Routes protégées (auteur/admin)
- ✅ Thème médiéval complet
- ✅ Responsive design

## 🎭 Pages Disponibles

- `/` - Page d'accueil
- `/login` - Connexion
- `/register` - Inscription
- `/stories` - Liste des histoires
- `/author/*` - Espace auteur (protégé)
- `/admin/*` - Administration (protégé)

## 🎨 Composants Réutilisables

- `Navbar` - Navigation avec détection du rôle utilisateur
- `ProtectedRoute` - Protection des routes par authentification et rôle

## 🔐 Gestion d'Authentification

Le système utilise JWT stocké dans localStorage avec :
- Context API pour l'état global
- Hook personnalisé `useAuth()`
- Intercepteurs Axios pour les tokens
- Redirection automatique si déconnecté

## 🎨 Variables CSS Disponibles

Voir `src/styles/variables.css` pour toutes les variables :
- Couleurs (primary, secondary, accent)
- Espacements (xs à 2xl)
- Typographie (font-family, font-size)
- Ombres et bordures
- Transitions

## 📝 Notes

- Le frontend communique avec le backend sur `http://localhost:5000`
- Le proxy Vite est configuré pour `/api`
- Les fonts Google sont chargées depuis le CDN
- Les émojis sont utilisés pour l'iconographie médiévale

Bon développement ! ⚔️
