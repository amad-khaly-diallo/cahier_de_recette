const Recipe = require('../models/Recipe');

const getAllRecipes = async (req, res) => {
  try {
    const { ingredient, author, sortBy, sortOrder, page, limit } = req.query;

    // Construire le filtre
    const filter = {};
    if (ingredient) filter.ingredients = { $in: [ingredient] }; // recettes qui contiennent l’ingrédient
    if (author) filter.userId = author;

    // Construire le tri
    let sort = {};
    if (sortBy === 'popularity') {
      sort = { likes: sortOrder === 'asc' ? 1 : -1 };
    } else {
      sort = { createdAt: sortOrder === 'asc' ? 1 : -1 };
    }

    // Pagination
    const pageNumber = parseInt(page) || 1;
    const pageSize = parseInt(limit) || 10;
    const skip = (pageNumber - 1) * pageSize;

    const recipes = await Recipe.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(pageSize)
      .populate('userId', 'name email');

    const total = await Recipe.countDocuments(filter);

    res.json({
      page: pageNumber,
      limit: pageSize,
      total,
      recipes
    });
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
        select: "name email"
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