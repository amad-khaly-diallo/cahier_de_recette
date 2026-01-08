const Comment = require('../models/Comment');

// POST /api/comments
const createComment = async (req, res) => {
  try {
    const { content } = req.body;
    const { recipeId } = req.params;
    const userId = req.user.id;
    
    if (!content || !recipeId) return res.status(400).json({ message: "Données manquantes" });

    const comment = await Comment.create({
      content,
      recipeId,
      userId: userId
    });

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/comments/recipe/:recipeId
const getComments = async (req, res) => {
  try {
    const { recipeId } = req.params;

    const comments = await Comment
      .find({ recipeId })
      .sort({ createdAt: -1 })
      .populate('userId', 'name');

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/comments/:id
const updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({ message: "Commentaire introuvable" });
    }

    if (comment.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Non autorisé" });
    }

    comment.content = content;
    await comment.save();

    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/comments/:id
const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({ message: "Commentaire introuvable" });
    }

    if (comment.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Non autorisé" });
    }

    await comment.deleteOne();
    res.status(200).json({ message: "Commentaire supprimé" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createComment,
  getComments,
  updateComment,
  deleteComment
};
