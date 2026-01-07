const mongoose = require('mongoose');

const recetteSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    ingredients: { type: [String], required: true },
    instructions: { type: String, required: true },
    preparationTime: { type: Number },
    cookingTime: { type: Number },
    servings: { type: Number },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    likes: { type: Number, default: 0 }
  },
  { timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true } 
  }
);
// Populate comments when fetching a recipe
recetteSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "recipeId"
});
module.exports = mongoose.model('Recipe', recetteSchema);