const mongoose = require('mongoose');

const recetteSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    ingredients: { type: [String], required: true },
    instructions: { type: String, required: true },
    preparationTime: { type: Number },
    cookingTime: { type: Number },
    servings: { type: Number },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Recipe', recetteSchema);