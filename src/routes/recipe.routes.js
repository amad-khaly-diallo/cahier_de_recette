const express = require("express");
const router = express.Router();
const protect = require("../middlewares/authMiddleware");
const checkOwner = require("../middlewares/checkOwner");
const Recipe = require("../models/Recipe");
const recipeController = require("../controllers/recipe.controller");

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
 *     summary: Lister toutes les recettes
 *     tags: [Recipes]
 *     responses:
 *       200:
 *         description: Liste des recettes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Recipe'
 */
// GET toutes les recettes (user connecté)
router.get("/", recipeController.getAllRecipes);

/**
 * @swagger
 * /api/recipes:
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
 *             $ref: '#/components/schemas/Recipe'
 *     responses:
 *       201:
 *         description: Recette créée
 */
// POST → créer recette
router.post("/", protect, recipeController.createRecipe);


/**
 * @swagger
 * /api/recipes/{id}:
 *   get:
 *     summary: Obtenir une recette par ID
 *     tags: [Recipes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Recette trouvée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Recipe'
 */
// GET une recette par ID
router.get("/:id", recipeController.getRecipeById);

/**
 * @swagger
 * /api/recipes/{id}:
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Recipe'
 *     responses:
 *       200:
 *         description: Recette mise à jour
 *
 */
// PUT → update recette (propriétaire ou admin dans le controller)
router.put("/:id", protect, checkOwner(Recipe, "id"), recipeController.updateRecipe);

/**
 * @swagger
 * /api/recipes/{id}:
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
 *     responses:
 *       200:
 *         description: Recette supprimée
 *
 */
// DELETE → delete recette (propriétaire ou admin dans le controller)
router.delete("/:id", protect, checkOwner(Recipe, "id"), recipeController.deleteRecipe);

module.exports = router;
