const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Le titre est requis"],
      trim: true,
      minlength: [3, "Le titre doit contenir au moins 3 caractères"],
      maxlength: [100, "Le titre ne peut pas dépasser 100 caractères"]
    },
    ingredients: {
      type: [String],
      required: [true, "Les ingrédients sont requis"],
      validate: {
        validator: function(v) {
          return v.length > 0;
        },
        message: "Au moins un ingrédient est requis"
      }
    },
    instructions: {
      type: String,
      required: [true, "Les instructions sont requises"],
      trim: true,
      minlength: [10, "Les instructions doivent contenir au moins 10 caractères"]
    },
    preparationTime: {
      type: Number,
      min: [0, "Le temps de préparation ne peut pas être négatif"]
    },
    cookingTime: {
      type: Number,
      min: [0, "Le temps de cuisson ne peut pas être négatif"]
    },
    servings: {
      type: Number,
      min: [1, "Le nombre de portions doit être au moins 1"]
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, "L'ID utilisateur est requis"]
    },
    likes: {
      type: Number,
      default: 0,
      min: [0, "Le nombre de likes ne peut pas être négatif"]
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Index pour améliorer les performances
recipeSchema.index({ userId: 1 });
recipeSchema.index({ createdAt: -1 });
recipeSchema.index({ likes: -1 });

// Virtual pour les commentaires
recipeSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "recipeId"
});

module.exports = mongoose.model('Recipe', recipeSchema);
