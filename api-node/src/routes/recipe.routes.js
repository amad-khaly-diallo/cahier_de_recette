/**
 * @swagger
 * tags:
 *   name: Recipes
 *   description: Gestion des recettes
 */

/**
 * @swagger
 * /api/recipes:
 *   get:
 *     summary: Récupérer toutes les recettes
 *     tags: [Recipes]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Liste des recettes avec info utilisateur
 *
 *   post:
 *     summary: Créer une recette
 *     tags: [Recipes]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - ingredients
 *               - instructions
 *             properties:
 *               title:
 *                 type: string
 *               ingredients:
 *                 type: array
 *                 items:
 *                   type: string
 *               instructions:
 *                 type: string
 *               preparationTime:
 *                 type: number
 *               cookingTime:
 *                 type: number
 *               servings:
 *                 type: number
 *     responses:
 *       201:
 *         description: Recette créée
 */

/**
 * @swagger
 * /api/recipes/{id}:
 *   get:
 *     summary: Récupérer une recette par ID
 *     tags: [Recipes]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la recette
 *     responses:
 *       200:
 *         description: Recette trouvée
 *
 *   put:
 *     summary: Mettre à jour une recette
 *     tags: [Recipes]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la recette
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               ingredients:
 *                 type: array
 *                 items:
 *                   type: string
 *               instructions:
 *                 type: string
 *               preparationTime:
 *                 type: number
 *               cookingTime:
 *                 type: number
 *               servings:
 *                 type: number
 *     responses:
 *       200:
 *         description: Recette mise à jour
 *
 *   delete:
 *     summary: Supprimer une recette
 *     tags: [Recipes]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la recette
 *     responses:
 *       200:
 *         description: Recette supprimée
 */

const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const checkOwner = require("../middleware/checkOwner");
const Recipe = require("../models/Recipe");
const recipeController = require("../controllers/recipe.controller");

// GET toutes les recettes → user connecté
router.get("/", protect, recipeController.getAllRecipes);

// POST → créer recette
router.post("/", protect, recipeController.createRecipe);

// GET une recette par ID
router.get("/:id", protect, recipeController.getRecipeById);

// PUT → update recette (propriétaire ou admin dans le controller)
router.put("/:id", protect, checkOwner(Recipe, "id"), recipeController.updateRecipe);

// DELETE → delete recette (propriétaire ou admin dans le controller)
router.delete("/:id", protect, checkOwner(Recipe, "id"), recipeController.deleteRecipe);

module.exports = router;
