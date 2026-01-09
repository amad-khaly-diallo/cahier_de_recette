const express = require("express");
const router = express.Router();
const protect = require("../middlewares/authMiddleware");
const checkOwner = require("../middlewares/checkOwner");
const validateObjectId = require("../middlewares/validateObjectId");
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
 *         description: Liste des recettes récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Recipe'
 *       500:
 *         description: Erreur serveur
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
 *         description: Recette créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Recipe'
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non authentifié
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
 *         description: ID de la recette
 *     responses:
 *       200:
 *         description: Recette trouvée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Recipe'
 *       404:
 *         description: Recette non trouvée
 */
// GET une recette par ID
router.get("/:id", validateObjectId("id"), recipeController.getRecipeById);

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
 *         description: ID de la recette
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Recipe'
 *     responses:
 *       200:
 *         description: Recette mise à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Recipe'
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Pas autorisé (propriétaire ou admin requis)
 *       404:
 *         description: Recette non trouvée
 */
// PUT → update recette (propriétaire ou admin dans le controller)
router.put("/:id", protect, validateObjectId("id"), checkOwner(Recipe, "id"), recipeController.updateRecipe);

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
 *         description: ID de la recette
 *     responses:
 *       200:
 *         description: Recette supprimée avec succès
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Pas autorisé (propriétaire ou admin requis)
 *       404:
 *         description: Recette non trouvée
 */
// DELETE → delete recette (propriétaire ou admin dans le controller)
router.delete("/:id", protect, validateObjectId("id"), checkOwner(Recipe, "id"), recipeController.deleteRecipe);

module.exports = router;
