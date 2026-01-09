const Comment = require('../models/Comment');
const Recipe = require('../models/Recipe');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @route POST /api/comment/:recipeId/comments
 * @desc Ajouter un commentaire à une recette
 */
const createComment = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const { recipeId } = req.params;
  const userId = req.user._id;

  // Validation des champs requis
  if (!content || !content.trim()) {
    return res.status(400).json({
      success: false,
      error: "Le contenu du commentaire est requis"
    });
  }

  // Vérifier que la recette existe
  const recipe = await Recipe.findById(recipeId);
  if (!recipe) {
    return res.status(404).json({
      success: false,
      error: "Recette non trouvée"
    });
  }

  const comment = await Comment.create({
    content: content.trim(),
    recipeId,
    userId
  });

  // Populate pour retourner les informations de l'utilisateur
  await comment.populate('userId', 'name email');

  res.status(201).json({
    success: true,
    data: comment
  });
});

/**
 * @route GET /api/comment/recipes/:recipeId/comments
 * @desc Lister les commentaires d'une recette
 */
const getComments = asyncHandler(async (req, res) => {
  const { recipeId } = req.params;

  // Vérifier que la recette existe
  const recipe = await Recipe.findById(recipeId);
  if (!recipe) {
    return res.status(404).json({
      success: false,
      error: "Recette non trouvée"
    });
  }

  const comments = await Comment
    .find({ recipeId })
    .sort({ createdAt: -1 })
    .populate('userId', 'name email');

  res.status(200).json({
    success: true,
    count: comments.length,
    data: comments
  });
});

/**
 * @route PUT /api/comment/recipes/:recipeId/comments/:id
 * @desc Modifier un commentaire
 */
const updateComment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  // Validation du contenu
  if (!content || !content.trim()) {
    return res.status(400).json({
      success: false,
      error: "Le contenu du commentaire est requis"
    });
  }

  const comment = await Comment.findById(id);
  
  if (!comment) {
    return res.status(404).json({
      success: false,
      error: "Commentaire non trouvé"
    });
  }

  // Vérifier que l'utilisateur est le propriétaire ou un admin
  if (comment.userId.toString() !== req.user._id.toString() && !req.user.isAdmin) {
    return res.status(403).json({
      success: false,
      error: "Vous n'êtes pas autorisé à modifier ce commentaire"
    });
  }

  comment.content = content.trim();
  await comment.save();

  await comment.populate('userId', 'name email');

  res.status(200).json({
    success: true,
    data: comment
  });
});

/**
 * @route DELETE /api/comment/recipes/:recipeId/comments/:id
 * @desc Supprimer un commentaire
 */
const deleteComment = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const comment = await Comment.findById(id);
  
  if (!comment) {
    return res.status(404).json({
      success: false,
      error: "Commentaire non trouvé"
    });
  }

  // Vérifier que l'utilisateur est le propriétaire ou un admin
  if (comment.userId.toString() !== req.user._id.toString() && !req.user.isAdmin) {
    return res.status(403).json({
      success: false,
      error: "Vous n'êtes pas autorisé à supprimer ce commentaire"
    });
  }

  await comment.deleteOne();

  res.status(200).json({
    success: true,
    message: "Commentaire supprimé avec succès"
  });
});

module.exports = {
  createComment,
  getComments,
  updateComment,
  deleteComment
};
