const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, "Le contenu du commentaire est requis"],
      trim: true,
      minlength: [1, "Le commentaire ne peut pas être vide"],
      maxlength: [500, "Le commentaire ne peut pas dépasser 500 caractères"]
    },
    recipeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recipe",
      required: [true, "L'ID de la recette est requis"]
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "L'ID de l'utilisateur est requis"]
    }
  },
  { timestamps: true }
);

// Index pour améliorer les performances
commentSchema.index({ recipeId: 1 });
commentSchema.index({ userId: 1 });
commentSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Comment", commentSchema);

