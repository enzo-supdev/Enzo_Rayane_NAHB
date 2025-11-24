# 📋 Liste des Fonctionnalités - Projet NAHB
## Reformulation claire et structurée

---

## 🎯 NIVEAU 10/20 - FONCTIONNALITÉS DE BASE

### 1. Authentification et Gestion des Comptes

#### 1.1 Inscription d'un utilisateur
- Un visiteur peut créer un compte avec :
  - Un pseudo unique
  - Une adresse email valide
  - Un mot de passe sécurisé (minimum 8 caractères)
- Le système assigne automatiquement un rôle (auteur/lecteur/admin)
- Validation des données avant création du compte

#### 1.2 Connexion / Déconnexion
- Un utilisateur peut se connecter avec son email et mot de passe
- Le système génère un token JWT pour maintenir la session
- L'utilisateur reste connecté jusqu'à déconnexion manuelle
- Possibilité de se déconnecter à tout moment

---

### 2. Création et Gestion d'Histoires (Auteur)

#### 2.1 Créer une nouvelle histoire
- Un auteur peut créer une histoire avec :
  - Un titre (obligatoire, max 200 caractères)
  - Une description courte (max 1000 caractères)
  - Des tags en texte libre (pour catégoriser)
- L'histoire est créée en statut "brouillon" par défaut

#### 2.2 Modifier ses histoires
- L'auteur peut modifier :
  - Le titre
  - La description
  - Les tags
  - Le statut (brouillon/publié)
- Seul l'auteur propriétaire peut modifier son histoire

#### 2.3 Supprimer ses histoires
- L'auteur peut supprimer définitivement une de ses histoires
- La suppression entraîne la suppression de toutes les pages et choix associés

#### 2.4 Gérer le statut de publication
- Passer une histoire de "brouillon" à "publié"
- Seules les histoires "publiées" sont visibles par les lecteurs
- Possibilité de remettre en brouillon

#### 2.5 Définir la page de départ
- L'auteur peut choisir quelle page sera le point d'entrée de l'histoire
- Cette page s'affiche en premier quand un lecteur commence l'histoire

---

### 3. Création de Pages et Choix

#### 3.1 Créer des pages (scènes)
- Pour chaque histoire, l'auteur peut créer des pages contenant :
  - Du texte (le contenu narratif de la scène)
  - Un indicateur "page finale" (oui/non)
- Une page peut être une scène intermédiaire ou une fin d'histoire

#### 3.2 Ajouter des choix à une page
- Sur chaque page non-finale, l'auteur peut ajouter des choix
- Chaque choix contient :
  - Un texte descriptif (ex: "Ouvrir la porte", "Fuir")
  - Un lien vers une autre page de la même histoire
- Un choix peut mener vers une page intermédiaire ou une page finale

#### 3.3 Modifier les pages et choix
- L'auteur peut modifier le contenu d'une page
- L'auteur peut modifier le texte d'un choix
- L'auteur peut changer la destination d'un choix

#### 3.4 Supprimer des pages et choix
- Suppression possible si la page n'est pas référencée ailleurs
- Vérification des dépendances avant suppression

---

### 4. Lecture d'Histoires (Lecteur)

#### 4.1 Consulter la liste des histoires
- Affichage de toutes les histoires publiées
- Chaque histoire affiche :
  - Son titre
  - Sa description
  - Ses tags
- Interface de liste claire et navigable

#### 4.2 Rechercher une histoire
- Champ de recherche par titre
- Filtrage en temps réel des résultats

#### 4.3 Lire une histoire
- Clic sur une histoire pour démarrer la lecture
- Affichage de la page de départ de l'histoire
- Le lecteur voit :
  - Le texte de la scène actuelle
  - Les choix disponibles (boutons ou liens)

#### 4.4 Naviguer dans l'histoire
- Clic sur un choix pour aller à la page suivante
- Navigation fluide entre les pages
- Affichage immédiat de la nouvelle scène

#### 4.5 Atteindre une fin
- Quand le lecteur arrive sur une page finale :
  - Message clair indiquant que c'est la fin
  - Plus de choix disponibles
  - Message de conclusion

---

### 5. Enregistrement des Parties

#### 5.1 Sauvegarder une partie terminée
- À la fin d'une lecture, le système enregistre :
  - L'utilisateur qui a joué
  - L'histoire jouée
  - La page de fin atteinte
  - La date et l'heure de fin

---

### 6. Administration de Base

#### 6.1 Bannir un auteur
- L'admin peut interdire à un auteur de publier
- Les histoires de l'auteur banni ne sont plus visibles

#### 6.2 Suspendre une histoire
- L'admin peut retirer temporairement une histoire de la liste publique
- L'histoire passe en statut "suspendue"

#### 6.3 Voir les statistiques globales
- L'admin voit le nombre total de parties jouées par histoire
- Vue d'ensemble de l'activité du site

---

## 📊 NIVEAU 13/20 - FONCTIONNALITÉS AVANCÉES

### 7. Filtrage et Thématiques

#### 7.1 Ajouter un thème aux histoires
- L'auteur peut associer un thème à son histoire :
  - Fantasy
  - Science-fiction
  - Horreur
  - Romance
  - Aventure
  - Mystère
  - Autre

#### 7.2 Filtrer les histoires par thème
- Le lecteur peut filtrer la liste des histoires
- Affichage uniquement des histoires du thème sélectionné
- Possibilité de cumuler plusieurs filtres

---

### 8. Statistiques pour les Lecteurs

#### 8.1 Statistiques de fin simples
- Pour chaque histoire, affichage :
  - Du nombre de fois que chaque fin a été atteinte
  - Du nombre total de parties jouées
- Visible par tous les lecteurs

#### 8.2 Statistiques de parcours
- À la fin d'une partie, le lecteur voit :
  - "Vous avez pris le même chemin que X% des joueurs"
  - Comparaison avec les autres parcours

#### 8.3 Répartition par fin
- Graphique ou pourcentages montrant :
  - La popularité de chaque fin
  - Les fins les plus/moins atteintes

---

### 9. Collection de Fins

#### 9.1 Nommer les fins
- L'auteur peut donner un label à chaque page finale :
  - "Fin héroïque"
  - "Fin tragique"
  - "Fin mystérieuse"
  - Etc.

#### 9.2 Débloquer des fins
- Quand un lecteur atteint une fin pour la première fois :
  - La fin est ajoutée à sa collection personnelle
  - Enregistrement permanent du déblocage

#### 9.3 Voir ses fins débloquées
- Le lecteur peut consulter la liste de toutes les fins qu'il a débloquées
- Pour chaque histoire, il voit :
  - Quelles fins il a découvertes
  - Quelles fins restent à découvrir
  - Date de déblocage

---

### 10. Notation et Commentaires

#### 10.1 Noter une histoire
- Un lecteur peut attribuer une note de 1 à 5 étoiles
- Un utilisateur ne peut noter qu'une fois par histoire
- Possibilité de modifier sa note ultérieurement

#### 10.2 Laisser un commentaire
- Le lecteur peut écrire un commentaire (max 500 caractères)
- Le commentaire est associé à la note
- Visible par tous les utilisateurs

#### 10.3 Afficher les notes
- Sur chaque fiche d'histoire, affichage :
  - De la note moyenne (ex: 4.3/5)
  - Du nombre total d'évaluations
  - Des derniers commentaires

---

### 11. Sauvegarde Automatique en Cours de Partie

#### 11.1 Enregistrer la progression
- Le système sauvegarde automatiquement :
  - La page actuelle où se trouve le lecteur
  - Le parcours complet (liste des pages visitées)
  - La date de dernière mise à jour

#### 11.2 Reprendre une partie
- Quand le lecteur revient :
  - Affichage d'un bouton "Reprendre"
  - Retour automatique à la dernière page visitée
  - Conservation de tout l'historique

#### 11.3 Plusieurs parties simultanées
- Un lecteur peut avoir plusieurs parties en cours
- Une par histoire différente

---

### 12. Signalement d'Histoires

#### 12.1 Signaler une histoire inappropriée
- Un lecteur peut signaler une histoire avec :
  - Une raison (contenu inapproprié, spam, violation de droits, autre)
  - Une description détaillée du problème
- Le signalement est envoyé à l'équipe de modération

#### 12.2 Traiter les signalements (Admin)
- L'admin voit tous les signalements avec :
  - Le statut (en attente, examiné, résolu)
  - Les détails du signalement
  - L'histoire concernée
- L'admin peut suspendre l'histoire ou rejeter le signalement

---

## 🎨 NIVEAU 16/20 - CÔTÉ AUTEUR ET UX/UI

### 13. Profil et Dashboard Auteur

#### 13.1 Page "Mes histoires"
- L'auteur voit la liste complète de ses histoires
- Pour chaque histoire, affichage :
  - Du titre et statut
  - Du nombre de lectures
  - De la note moyenne
  - D'un bouton d'accès rapide à l'édition

#### 13.2 Statistiques de base par histoire
- Pour chaque histoire de l'auteur :
  - Nombre total de lectures
  - Nombre de parties complétées
  - Note moyenne et nombre de notes
  - Fins les plus/moins atteintes

---

### 14. Statistiques Avancées pour Auteurs

#### 14.1 Distribution détaillée par fin
- Graphique montrant :
  - Le pourcentage de joueurs atteignant chaque fin
  - L'évolution dans le temps
  - Comparaison entre les fins

#### 14.2 Nombre de lectures
- Total de lectures de l'histoire
- Évolution quotidienne/hebdomadaire/mensuelle
- Graphique de tendance

#### 14.3 Parties abandonnées
- Nombre de joueurs ayant quitté sans finir
- Points d'abandon fréquents dans l'histoire
- Taux d'abandon en pourcentage

#### 14.4 Statistiques de choix
- Pour chaque choix de chaque page :
  - Pourcentage de joueurs l'ayant choisi
  - Identification des choix populaires/impopulaires

---

### 15. Mode Brouillon et Publication

#### 15.1 Travailler en brouillon
- L'auteur peut créer et modifier sans publier
- Les histoires en brouillon ne sont visibles que par l'auteur
- Pas de limite de temps en brouillon

#### 15.2 Publier une histoire
- Bouton "Publier" pour rendre l'histoire accessible
- Vérifications avant publication :
  - Page de départ définie
  - Au moins une fin accessible
  - Pas de pages orphelines

#### 15.3 Retirer de la publication
- Possibilité de repasser en brouillon
- L'histoire disparaît de la liste publique
- Conservation de toutes les statistiques

---

### 16. Mode Preview (Test)

#### 16.1 Tester son histoire
- L'auteur peut jouer à sa propre histoire en mode test
- Parcours complet comme un lecteur normal
- Interface identique à la lecture publique

#### 16.2 Séparation des statistiques
- Les parties en mode preview ne comptent pas dans les vraies stats
- Marquage spécial des sessions de test
- Permet de tester sans fausser les données

#### 16.3 Notes de test
- Possibilité de prendre des notes pendant le test
- Identification des problèmes de narration
- Liste de corrections à effectuer

---

### 17. Illustrations

#### 17.1 Ajouter une image de couverture
- L'auteur peut uploader une image pour son histoire
- Formats acceptés : JPG, PNG, GIF, WEBP
- Taille max : 5 MB
- Affichage dans la liste des histoires

#### 17.2 Illustrer les pages
- Possibilité d'ajouter une image à chaque page
- L'image s'affiche au-dessus ou à côté du texte
- Améliore l'immersion narrative

#### 17.3 Gestion des images
- Bibliothèque d'images uploadées par l'auteur
- Réutilisation possible sur plusieurs pages
- Suppression et remplacement d'images

---

### 18. Amélioration UX/UI

#### 18.1 Interface soignée
- Design cohérent et professionnel
- Navigation intuitive
- Hiérarchie visuelle claire
- Interface responsive (mobile, tablette, desktop)

#### 18.2 Messages d'erreur et de succès
- Notifications claires et visibles
- Messages contextuels
- Feedback immédiat sur les actions

#### 18.3 Confirmations pour actions destructrices
- Pop-up de confirmation avant :
  - Suppression d'une histoire
  - Suppression d'une page
  - Suppression d'un choix
- Possibilité d'annuler

#### 18.4 Indicateurs de chargement
- Spinners lors des opérations longues
- Barres de progression
- Messages de patience

---

## 🏆 NIVEAU 18/20 - EXPERT : ARBRES, INTERACTIVITÉ & HASARD

### 19. Visualisation d'Arbres (Auteur)

#### 19.1 Générer l'arbre de l'histoire
- Bouton pour générer une représentation visuelle
- Création automatique d'un graphe
- Affichage de toutes les pages et liens

#### 19.2 Vue arborescente interactive
- Affichage sous forme d'arbre ou de graphe
- Zoom et déplacement
- Clic sur un nœud pour voir les détails

#### 19.3 Identification des problèmes
- Détection automatique des :
  - Pages orphelines (non accessibles)
  - Impasses (pages sans choix qui ne sont pas des fins)
  - Boucles infinies
- Signalement visuel des erreurs

#### 19.4 Export de l'arbre
- Possibilité d'exporter en :
  - Image SVG
  - Fichier JSON
  - Diagramme Mermaid
  - PDF

---

### 20. Visualisation de Parcours (Lecteur)

#### 20.1 Voir son parcours complet
- Après avoir terminé une histoire, le lecteur peut visualiser :
  - Toutes les pages qu'il a visitées
  - Les choix qu'il a faits
  - Le chemin dans l'arbre de l'histoire

#### 20.2 Arbre avec mise en évidence
- Affichage de l'arbre complet de l'histoire
- Son propre parcours est surligné
- Les pages non visitées sont grisées

#### 20.3 Comparaison avec d'autres joueurs
- Affichage des chemins les plus populaires
- "Votre chemin est emprunté par X% des joueurs"
- Identification des choix rares/originaux

#### 20.4 Historique de toutes ses parties
- Liste de toutes les histoires jouées
- Pour chaque partie :
  - Date de jeu
  - Fin atteinte
  - Parcours emprunté
  - Accès à la visualisation

---

### 21. Images Interactives

#### 21.1 Définir des zones cliquables (Auteur)
- Sur une illustration, l'auteur peut :
  - Dessiner des zones rectangulaires, circulaires ou polygonales
  - Associer chaque zone à une page cible
  - Ajouter un tooltip au survol

#### 21.2 Créer des choix visuels
- Au lieu de boutons texte classiques :
  - Le lecteur clique directement sur l'image
  - Différentes zones mènent à différentes pages
  - Plus immersif et interactif

#### 21.3 Éditeur de zones
- Interface de dessin pour créer les zones :
  - Outil rectangle
  - Outil cercle
  - Outil polygone libre
  - Prévisualisation en temps réel

#### 21.4 Jouer avec images interactives
- Le lecteur survole l'image et voit les zones actives
- Clic sur une zone pour continuer l'histoire
- Effet visuel au survol (highlight)

---

### 22. Système de Hasard avec Dés

#### 22.1 Créer un choix avec jet de dé (Auteur)
- L'auteur peut ajouter une condition de dé à un choix :
  - Type de dé (D6, D20, D100)
  - Valeur requise (ex: >= 15)
  - Page en cas de succès
  - Page en cas d'échec

#### 22.2 Lancer les dés (Lecteur)
- Quand le lecteur rencontre un choix avec dé :
  - Affichage de l'exigence (ex: "Lancer un D20, réussir 15+")
  - Bouton "Lancer le dé"
  - Animation du lancement

#### 22.3 Résultat du jet
- Affichage du résultat :
  - Valeur obtenue
  - Succès ou échec
  - Redirection automatique vers la page appropriée

#### 22.4 Historique des jets
- Conservation de tous les jets de dés effectués
- Visible dans le parcours du joueur
- Statistiques sur les réussites/échecs

#### 22.5 Types de conditions
- Égal à (==)
- Supérieur ou égal (>=)
- Inférieur ou égal (<=)
- Strictement supérieur (>)
- Strictement inférieur (<)

---

### 23. Analyse Avancée des Chemins

#### 23.1 Chemins les plus empruntés
- Identification automatique des parcours populaires
- Top 10 des chemins les plus fréquents
- Pourcentage pour chaque chemin

#### 23.2 Chemins les moins empruntés
- Liste des parcours rares
- Identification des branches "secrètes"
- Fins difficiles à découvrir

#### 23.3 Nœuds critiques
- Identification des pages décisives :
  - Pages où beaucoup de chemins convergent
  - Pages où l'histoire se divise beaucoup
  - Pages à fort taux d'abandon

#### 23.4 Heatmap de popularité
- Visualisation colorée de l'arbre :
  - Rouge = très fréquenté
  - Vert = moyennement fréquenté
  - Bleu = rarement visité
  - Gris = jamais visité

---

## 🔧 NIVEAU 18/20 - QUALITÉ LOGICIELLE

### 24. Tests

#### 24.1 Tests unitaires
- Tests des modèles (User, Story, Page, etc.)
- Tests des fonctions utilitaires
- Tests des validations
- Couverture de code > 70%

#### 24.2 Tests d'intégration
- Tests des routes API
- Tests des flux complets (inscription → création histoire → lecture)
- Tests des relations entre modèles

#### 24.3 Tests front-end
- Tests des composants React
- Tests des interactions utilisateur
- Tests de navigation

---

### 25. Dockerisation

#### 25.1 Dockerfile backend
- Image Node.js
- Installation des dépendances
- Configuration de l'environnement
- Exposition du port API

#### 25.2 Dockerfile frontend (optionnel)
- Image Node.js pour build
- Serveur statique (nginx)
- Configuration du proxy

#### 25.3 Docker Compose
- Orchestration de tous les services :
  - Backend (API)
  - Frontend (interface web)
  - Base de données (MongoDB/MySQL)
- Configuration des volumes
- Configuration du réseau

#### 25.4 Lancement simplifié
- Une seule commande : `docker-compose up`
- Variables d'environnement configurées
- Initialisation automatique de la DB

---

### 26. Déploiement

#### 26.1 Déploiement du backend
- Choix de plateforme :
  - Render
  - Railway
  - Heroku
  - AWS
  - OVH
- Configuration des variables d'environnement
- URL publique accessible

#### 26.2 Déploiement du frontend
- Choix de plateforme :
  - Vercel
  - Netlify
  - GitHub Pages
  - Render
- Build optimisé pour production
- Configuration du domaine

#### 26.3 Base de données en production
- MongoDB Atlas (gratuit)
- Ou MySQL hébergé
- Backups automatiques
- Sécurisation des accès

#### 26.4 Configuration CORS
- Autoriser le frontend à accéder au backend
- Configuration des origines autorisées
- Gestion des credentials

---

## 📝 Résumé par Niveau

### Niveau 10/20 (6 catégories)
1. ✅ Authentification et comptes
2. ✅ Création/gestion d'histoires
3. ✅ Pages et choix
4. ✅ Lecture d'histoires
5. ✅ Enregistrement parties
6. ✅ Administration de base

### Niveau 13/20 (+6 catégories)
7. ✅ Filtrage et thématiques
8. ✅ Statistiques lecteurs
9. ✅ Collection de fins
10. ✅ Notation et commentaires
11. ✅ Sauvegarde automatique
12. ✅ Signalement

### Niveau 16/20 (+6 catégories)
13. ✅ Profil auteur
14. ✅ Statistiques avancées auteur
15. ✅ Mode brouillon/publication
16. ✅ Mode preview
17. ✅ Illustrations
18. ✅ Amélioration UX/UI

### Niveau 18/20 (+8 catégories)
19. ✅ Visualisation d'arbres (auteur)
20. ✅ Visualisation de parcours (lecteur)
21. ✅ Images interactives
22. ✅ Système de dés
23. ✅ Analyse avancée
24. ✅ Tests
25. ✅ Dockerisation
26. ✅ Déploiement

---
