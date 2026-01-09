const express = require("express");
const router = express.Router();
const protect = require("../middlewares/authMiddleware");
const validateObjectId = require("../middlewares/validateObjectId");
const commentController = require("../controllers/comment.controller");
/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: Gestion des commentaires
 */

/**
 * @swagger
 * /api/comment/{recipeId}/comments:
 *   post:
 *     summary: Ajouter un commentaire à une recette
 *     tags: [Comments]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: recipeId
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
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 example: "Super recette, facile et rapide 👍"
 *     responses:
 *       201:
 *         description: Commentaire ajouté
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 */
// ajouter un commentaire à une recette (auth requis)
router.post("/:recipeId/comments", protect, validateObjectId("recipeId"), commentController.createComment);


/**
 * @swagger
 * /api/comment/recipes/{recipeId}/comments:
 *   get:
 *     summary: Lister les commentaires d'une recette
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: recipeId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la recette
 *     responses:
 *       200:
 *         description: Liste des commentaires
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 */
// Lister les commentaires d'une recette
router.get("/recipes/:recipeId/comments", validateObjectId("recipeId"), commentController.getComments);


/**
 * @swagger
 * /api/comment/recipes/{recipeId}/comments/{id}:
 *   put:
 *     summary: Modifier un commentaire
 *     tags: [Comments]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: recipeId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la recette
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du commentaire
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 example: "Commentaire modifié"
 *     responses:
 *       200:
 *         description: Commentaire modifié
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 */
// Modifier un commentaire (auth + propriétaire)
router.put("/recipes/:recipeId/comments/:id", protect, validateObjectId("recipeId"), validateObjectId("id"), commentController.updateComment);


/**
 * @swagger
 * /api/comment/recipes/{recipeId}/comments/{id}:
 *   delete:
 *     summary: Supprimer un commentaire
 *     tags: [Comments]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: recipeId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la recette
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du commentaire
 *     responses:
 *       200:
 *         description: Commentaire supprimé
 *       404:
 *         description: Commentaire non trouvé
 */
// Supprimer un commentaire (auth + propriétaire)
router.delete("/recipes/:recipeId/comments/:id", protect, validateObjectId("recipeId"), validateObjectId("id"), commentController.deleteComment);



module.exports = router;
