const express = require("express");
const router = express.Router();
const protect = require("../middlewares/authMiddleware");
const commentController = require("../controllers/comment.controller");
/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: Gestion des commentaires
 */

/**
 * @swagger
 * /api/recipes/{recipeId}/comments:
 *  post:
 *    summary: Ajouter un commentaire à une recette
 *    tags: [Comments]
 *    security:
 *      - cookieAuth: []
 *    parameters:
 *      - in: path
 *        name: recipeId
 *        required: true
 *        schema:
 *          type: string
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              content:
 *                type: string
 *    responses:
 *      201:
 *        description: Commentaire ajouté
 */
// ajouter un commentaire à une recette (auth requis)
router.post("/:recipeId/comments", protect, commentController.createComment);


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
 *     responses:
 *       200:
 *         description: Liste des commentaires
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 *
 */
// Lister les commentaires d'une recette
router.get("/recipes/:recipeId/comments", commentController.getComments);


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
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Commentaire modifié
 */
// Modifier un commentaire (auth + propriétaire)
router.put("/recipes/:recipeId/comments/:id", protect, commentController.updateComment);


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
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Commentaire supprimé
 */
// Supprimer un commentaire (auth + propriétaire)
router.delete("/recipes/:recipeId/comments/:id", protect, commentController.deleteComment);



module.exports = router;
