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
 *     responses:
 *       200:
 *         description: Liste des recettes avec info utilisateur
 *
 *   post:
 *     summary: Créer une recette
 *     tags: [Recipes]
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
 *               - userId
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
 *               userId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Recette créée
 */

const express = require("express");
const router = express.Router();

const recipeController = require("../controllers/recipe.controller");

// Routes
router.get("/", recipeController.getAllRecipes);
router.post("/", recipeController.createRecipe);
router.get("/:id", recipeController.getRecipeById);
router.put("/:id", recipeController.updateRecipe);
router.delete("/:id", recipeController.deleteRecipe);

module.exports = router;