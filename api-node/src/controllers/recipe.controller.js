const Recipe = require('../models/Recipe');

// GET /api/recipes
const getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find().populate('userId', 'name email');
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/recipes
const createRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.create(req.body);
    res.status(201).json(recipe);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// GET /api/recipes/:id
const getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate({
      path: "comments",
      options: {
        sort: { createdAt: -1 },
        limit: 10
      },
      populate: {
        path: "userId",
        select: "username avatar"
      }
    });
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });
    res.json(recipe);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/recipes/:id
const updateRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });
    res.json(recipe);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE /api/recipes/:id
const deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndDelete(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });
    res.json({ message: "Recipe deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllRecipes,
  createRecipe,
  getRecipeById,
  updateRecipe,
  deleteRecipe
};