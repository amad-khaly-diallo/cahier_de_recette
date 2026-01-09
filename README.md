# Cahier de Recettes API

API REST complète pour gérer des recettes, des commentaires et l'authentification utilisateur. Développée avec Node.js, Express et MongoDB.

![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![Express](https://img.shields.io/badge/Express-5.2-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-9.1-brightgreen)
![License](https://img.shields.io/badge/License-ISC-yellow)

---

## Table des matières

- [Fonctionnalités](#fonctionnalités)
- [Stack technique](#stack-technique)
- [Installation](#installation)
- [Configuration](#configuration)
- [Structure du projet](#structure-du-projet)
- [Endpoints API](#endpoints-api)
- [Documentation Swagger](#documentation-swagger)
- [Exemples d'utilisation](#exemples-dutilisation)
- [Sécurité](#sécurité)
- [Gestion des erreurs](#gestion-des-erreurs)

---

## Fonctionnalités

### Authentification
- Inscription et connexion utilisateur
- JWT stocké dans un cookie HTTP-only sécurisé
- Déconnexion avec suppression du cookie
- Middleware de protection des routes
- Vérification des droits administrateur

### Recettes
- CRUD complet (Create, Read, Update, Delete)
- Filtrage par ingrédient et auteur
- Tri par date ou popularité (likes)
- Pagination des résultats
- Populate automatique des informations utilisateur
- Virtual pour les commentaires associés

### Commentaires
- Ajouter un commentaire à une recette
- Lister tous les commentaires d'une recette
- Modifier et supprimer ses propres commentaires
- Protection par propriétaire (auteur ou admin)

### Utilisateurs
- Gestion des profils utilisateur
- Système de rôles (utilisateur/admin)
- Mise à jour des informations personnelles
- Suppression utilisateur (admin uniquement)

---

## Stack technique

- **Runtime**: Node.js
- **Framework**: Express.js 5.2
- **Base de données**: MongoDB avec Mongoose
- **Authentification**: JWT (JSON Web Tokens)
- **Documentation**: Swagger/OpenAPI
- **Sécurité**: bcrypt pour le hashage des mots de passe
- **Cookies**: cookie-parser pour la gestion des cookies

---

## Installation

### Prérequis

- Node.js (version 18 ou supérieure)
- MongoDB (local ou Atlas)
- npm ou yarn

### Étapes d'installation

1. **Cloner le repository** (ou télécharger le projet)

```bash
git clone <votre-repo>
cd cahier_de_recette
```

2. **Installer les dépendances**

```bash
npm install
```

3. **Créer le fichier `.env`**

Créez un fichier `.env` à la racine du projet :

```env
# Port du serveur
PORT=3000

# URI de connexion MongoDB
MONGO_URI=mongodb://localhost:27017/cahier_recettes
# Ou pour MongoDB Atlas :
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/cahier_recettes

# Secret pour JWT
JWT_SECRET=votre_secret_jwt_super_securise_ici

# Durée de vie du token JWT (optionnel)
JWT_EXPIRES_IN=24h

# Environnement
NODE_ENV=development
```

4. **Lancer le serveur**

```bash
npm run dev
```

Le serveur démarre sur `http://localhost:3000`

---

## Configuration

### Variables d'environnement

| Variable | Description | Exemple |
|----------|-------------|---------|
| `PORT` | Port du serveur Express | `3000` |
| `MONGO_URI` | URI de connexion MongoDB | `mongodb://localhost:27017/cahier_recettes` |
| `JWT_SECRET` | Secret pour signer les tokens JWT | `votre_secret_securise` |
| `JWT_EXPIRES_IN` | Durée de validité du token | `24h` |
| `NODE_ENV` | Environnement (development/production) | `development` |

---

## Structure du projet

```
cahier_de_recette/
│
├── src/
│   ├── app.js                    # Configuration Express
│   ├── server.js                 # Point d'entrée du serveur
│   │
│   ├── config/
│   │   └── db.js                 # Connexion MongoDB
│   │
│   ├── controllers/
│   │   ├── user.controller.js   # Logique métier utilisateurs
│   │   ├── recipe.controller.js # Logique métier recettes
│   │   └── comment.controller.js# Logique métier commentaires
│   │
│   ├── middlewares/
│   │   ├── authMiddleware.js     # Authentification JWT
│   │   ├── adminMiddleware.js   # Vérification admin
│   │   ├── checkOwner.js        # Vérification propriétaire
│   │   ├── errorHandler.js      # Gestion centralisée des erreurs
│   │   └── validateObjectId.js  # Validation ObjectId MongoDB
│   │
│   ├── models/
│   │   ├── User.js              # Modèle utilisateur
│   │   ├── Recipe.js            # Modèle recette
│   │   └── Comment.js           # Modèle commentaire
│   │
│   ├── routes/
│   │   ├── auth.routes.js       # Routes authentification
│   │   ├── user.routes.js       # Routes utilisateurs
│   │   ├── recipe.routes.js     # Routes recettes
│   │   └── comment.routes.js    # Routes commentaires
│   │
│   ├── utils/
│   │   ├── generateTokens.js    # Génération tokens JWT
│   │   └── asyncHandler.js      # Wrapper pour async/await
│   │
│   └── docs/
│       └── swagger.js            # Configuration Swagger
│
├── public/
│   ├── index.html                # Page d'accueil
│   └── styles.css                # Styles de la page d'accueil
│
├── .env                          # Variables d'environnement (à créer)
├── package.json                  # Dépendances npm
└── README.md                     # Documentation
```

---

## Endpoints API

### Base URL
```
http://localhost:3000/api
```

### Authentification

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| `POST` | `/api/auth/register` | Inscription d'un nouvel utilisateur | Non |
| `POST` | `/api/auth/login` | Connexion utilisateur | Non |
| `POST` | `/api/auth/logout` | Déconnexion utilisateur | Oui |

### Utilisateurs

| Méthode | Endpoint | Description | Auth | Admin |
|---------|----------|-------------|------|-------|
| `GET` | `/api/users` | Lister tous les utilisateurs | Oui | Oui |
| `GET` | `/api/users/:id` | Obtenir un utilisateur par ID | Oui | Non |
| `PUT` | `/api/users/:id` | Mettre à jour un utilisateur | Oui | Non |
| `DELETE` | `/api/users/:id` | Supprimer un utilisateur | Oui | Oui |

### Recettes

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| `GET` | `/api/recipes` | Lister toutes les recettes (avec filtres) | Non |
| `GET` | `/api/recipes/:id` | Obtenir une recette par ID | Non |
| `POST` | `/api/recipes` | Créer une nouvelle recette | Oui |
| `PUT` | `/api/recipes/:id` | Mettre à jour une recette | Oui |
| `DELETE` | `/api/recipes/:id` | Supprimer une recette | Oui |

**Paramètres de requête pour GET `/api/recipes`** :
- `ingredient` : Filtrer par ingrédient
- `author` : Filtrer par auteur (userId)
- `sortBy` : Trier par (`popularity` ou `date`)
- `sortOrder` : Ordre de tri (`asc` ou `desc`)
- `page` : Numéro de page (défaut: 1)
- `limit` : Nombre de résultats par page (défaut: 10)

### Commentaires

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| `POST` | `/api/comment/:recipeId/comments` | Ajouter un commentaire | Oui |
| `GET` | `/api/comment/recipes/:recipeId/comments` | Lister les commentaires d'une recette | Non |
| `PUT` | `/api/comment/recipes/:recipeId/comments/:id` | Modifier un commentaire | Oui |
| `DELETE` | `/api/comment/recipes/:recipeId/comments/:id` | Supprimer un commentaire | Oui |

### Health Check

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/health` | Vérifier l'état de l'API |

---

## Documentation Swagger

Une documentation interactive est disponible via Swagger UI :

**URL**: `http://localhost:3000/api-docs`

Vous pouvez y tester tous les endpoints directement depuis l'interface web.

---

## Exemples d'utilisation

### 1. Inscription d'un utilisateur

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Khaly",
    "email": "khaly@example.com",
    "password": "123456"
  }'
```

**Réponse** :
```json
{
  "success": true,
  "data": {
    "id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "name": "Khaly",
    "email": "khaly@example.com",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### 2. Connexion

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "khaly@example.com",
    "password": "123456"
  }' \
  -c cookies.txt
```

Le token JWT est automatiquement stocké dans un cookie.

### 3. Créer une recette

```bash
curl -X POST http://localhost:3000/api/recipes \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "title": "Spaghetti Carbonara",
    "ingredients": ["spaghetti", "œufs", "parmesan", "lardons"],
    "instructions": "Cuire les pâtes. Mélanger les œufs avec le parmesan. Faire revenir les lardons. Mélanger le tout.",
    "preparationTime": 10,
    "cookingTime": 15,
    "servings": 4,
    "userId": "65a1b2c3d4e5f6g7h8i9j0k1"
  }'
```

### 4. Lister les recettes avec filtres

```bash
curl "http://localhost:3000/api/recipes?ingredient=tomate&sortBy=popularity&sortOrder=desc&page=1&limit=5"
```

### 5. Ajouter un commentaire

```bash
curl -X POST http://localhost:3000/api/comment/65a1b2c3d4e5f6g7h8i9j0k1/comments \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "content": "Super recette, facile et rapide !"
  }'
```

---

## Sécurité

### Authentification
- Les tokens JWT sont stockés dans des cookies HTTP-only pour éviter les attaques XSS
- Les cookies sont sécurisés en production (`secure: true`)
- Les tokens expirent après 24 heures (configurable)

### Validation
- Validation des ObjectId MongoDB avant traitement
- Validation des données d'entrée dans les controllers
- Messages d'erreur sans exposition d'informations sensibles

### Autorisations
- Un utilisateur ne peut modifier/supprimer que ses propres ressources
- Les administrateurs ont accès à toutes les ressources
- Vérification du propriétaire via middleware `checkOwner`

### Hashage des mots de passe
- Utilisation de bcrypt avec 10 rounds de salage
- Les mots de passe ne sont jamais retournés dans les réponses

---

## Gestion des erreurs

L'API utilise un système de gestion d'erreurs centralisé qui retourne des réponses cohérentes :

### Format de réponse standard

**Succès** :
```json
{
  "success": true,
  "data": { ... }
}
```

**Erreur** :
```json
{
  "success": false,
  "error": "Message d'erreur clair"
}
```

### Codes de statut HTTP

- `200` : Succès
- `201` : Ressource créée
- `400` : Requête invalide
- `401` : Non authentifié
- `403` : Accès refusé
- `404` : Ressource non trouvée
- `500` : Erreur serveur

---

## Interface web

Une page d'accueil est disponible à la racine :

**URL**: `http://localhost:3000/`

Elle présente :
- Un lien vers la documentation Swagger
- La liste des endpoints disponibles
- Des informations sur l'utilisation de l'API

---

## Modèles de données

### User
```javascript
{
  name: String (requis, 2-50 caractères),
  email: String (requis, unique, format email),
  password: String (requis, min 6 caractères, hashé),
  isAdmin: Boolean (défaut: false),
  createdAt: Date,
  updatedAt: Date
}
```

### Recipe
```javascript
{
  title: String (requis, 3-100 caractères),
  ingredients: [String] (requis, au moins 1),
  instructions: String (requis, min 10 caractères),
  preparationTime: Number (optionnel, min 0),
  cookingTime: Number (optionnel, min 0),
  servings: Number (optionnel, min 1),
  userId: ObjectId (requis, référence User),
  likes: Number (défaut: 0),
  createdAt: Date,
  updatedAt: Date
}
```

### Comment
```javascript
{
  content: String (requis, 1-500 caractères),
  recipeId: ObjectId (requis, référence Recipe),
  userId: ObjectId (requis, référence User),
  createdAt: Date,
  updatedAt: Date
}
```

---

## Tests

Pour tester l'API, vous pouvez utiliser :

- **Swagger UI** : `http://localhost:3000/api-docs`
- **Postman** : Importer la collection d'endpoints
- **cURL** : Voir les exemples ci-dessus
- **Thunder Client** (extension VS Code)
