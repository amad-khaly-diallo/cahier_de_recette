# Recipe API – Node.js / Express / MongoDB

API REST pour gérer des **recettes**, des **commentaires**, l’**authentification utilisateur** avec JWT et des fonctionnalités avancées comme le **filtrage**, le **tri** et le **populate** MongoDB.

---

## Stack technique

* **Node.js**
* **Express.js**
* **MongoDB + Mongoose**
* **JWT (authentification)**
* **Cookie-parser**
* **Postman** (tests)

---

## Fonctionnalités

### Authentification

* Inscription / connexion utilisateur
* JWT stocké en **cookie**
* Middleware `auth` pour sécuriser les routes

### Recettes

* Créer / lire / modifier / supprimer une recette
* Chaque recette est liée à un **user**
* Likes par recette
* Dates automatiques (`createdAt`, `updatedAt`)

### Commentaires

* Ajouter un commentaire sur une recette
* Un commentaire appartient à :

  * un **user**
  * une **recipe**
* Suppression / modification protégée (auteur uniquement)

### Relations & Populate

* Populate automatique :

  * recette → commentaires
  * commentaire → user
* Virtual `comments` sur le modèle `Recipe`

### Filtrage & Tri

* Filtrer par :

  * ingrédient
  * auteur (`userId`)
* Trier par :

  * date (`createdAt`)
  * popularité (`likes`)

---

## Structure du projet

```
src/
│
├── controllers/
│   ├── recipe.controller.js
│   ├── comment.controller.js
│   └── auth.controller.js
│
├── models/
│   ├── Recipe.js
│   ├── Comment.js
│   └── User.js
│
├── routes/
│   ├── recipe.routes.js
│   ├── comment.routes.js
│   └── auth.routes.js
│
├── middlewares/
│   └── auth.js
│
├── utils/
│   └── generateTokens.js
│
├── app.js
└── server.js
```

---

## Modèles Mongoose

### Recipe

```js
{
  title: String,
  ingredients: [String],
  instructions: String,
  preparationTime: Number,
  cookingTime: Number,
  servings: Number,
  userId: ObjectId,
  likes: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Comment

```js
{
  content: String,
  recipeId: ObjectId,
  userId: ObjectId,
  createdAt: Date,
  updatedAt: Date
}
```

---

## Exemples de routes

### GET toutes les recettes

```
GET /api/recipes
```

### GET une recette + commentaires

```
GET /api/recipes/:id
```

### Filtrage + tri

```
GET /api/recipes?ingredient=tomate&sortBy=likes&sortOrder=desc
```

### Créer un commentaire (auth requis)

```
POST /api/comments
```

---

## Seeder (Postman)

Un **tableau JSON** est fourni pour remplir rapidement la base de données avec :

* Plusieurs recettes
* Plusieurs utilisateurs
* Des likes réalistes

 À envoyer directement via **Postman (POST)**

---

## Sécurité

* Routes sensibles protégées par middleware JWT
* Un utilisateur ne peut modifier/supprimer que **ses propres données**
* Vérification du token côté serveur

---

## Lancer le projet

```bash
npm install
npm run dev
```

Créer un fichier `.env` :

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
```

---

## À améliorer (next level)

* Upload images (Cloudinary)
* Système de likes utilisateurs
* Recherche full-text
* Tests Jest
