const Recipe = require('../models/Recipe');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @route GET /api/recipes
 * @desc Lister toutes les recettes avec filtres, tri et pagination
 */
const getAllRecipes = asyncHandler(async (req, res) => {
  const { ingredient, author, sortBy, sortOrder, page, limit } = req.query;

  // Construire le filtre
  const filter = {};
  if (ingredient) {
    filter.ingredients = { $in: [ingredient] };
  }
  if (author) {
    filter.userId = author;
  }

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

  // Validation de la pagination
  if (pageNumber < 1 || pageSize < 1) {
    return res.status(400).json({
      success: false,
      error: "Les paramètres de pagination doivent être positifs"
    });
  }

  const recipes = await Recipe.find(filter)
    .sort(sort)
    .skip(skip)
    .limit(pageSize)
    .populate('userId', 'name email');

  const total = await Recipe.countDocuments(filter);

  res.status(200).json({
    success: true,
    pagination: {
      page: pageNumber,
      limit: pageSize,
      total,
      pages: Math.ceil(total / pageSize)
    },
    data: recipes
  });
});

/**
 * @route POST /api/recipes
 * @desc Créer une nouvelle recette
 */
const createRecipe = asyncHandler(async (req, res) => {
  const { title, ingredients, instructions, userId } = req.body;

  // Validation des champs requis
  if (!title || !ingredients || !instructions || !userId) {
    return res.status(400).json({
      success: false,
      error: "Veuillez fournir un titre, des ingrédients, des instructions et un userId"
    });
  }

  // Validation que ingredients est un tableau
  if (!Array.isArray(ingredients) || ingredients.length === 0) {
    return res.status(400).json({
      success: false,
      error: "Les ingrédients doivent être un tableau non vide"
    });
  }

  // Ajouter le userId depuis l'utilisateur connecté si non fourni
  const recipeData = {
    ...req.body,
    userId: userId || (req.user ? req.user._id : null)
  };

  if (!recipeData.userId) {
    return res.status(400).json({
      success: false,
      error: "userId est requis"
    });
  }

  const recipe = await Recipe.create(recipeData);

  res.status(201).json({
    success: true,
    data: recipe
  });
});

/**
 * @route GET /api/recipes/:id
 * @desc Obtenir une recette par ID
 */
const getRecipeById = asyncHandler(async (req, res) => {
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
  }).populate('userId', 'name email');

  if (!recipe) {
    return res.status(404).json({
      success: false,
      error: "Recette non trouvée"
    });
  }

  res.status(200).json({
    success: true,
    data: recipe
  });
});

/**
 * @route PUT /api/recipes/:id
 * @desc Mettre à jour une recette
 */
const updateRecipe = asyncHandler(async (req, res) => {
  const recipe = await Recipe.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  );

  if (!recipe) {
    return res.status(404).json({
      success: false,
      error: "Recette non trouvée"
    });
  }

  res.status(200).json({
    success: true,
    data: recipe
  });
});

/**
 * @route DELETE /api/recipes/:id
 * @desc Supprimer une recette
 */
const deleteRecipe = asyncHandler(async (req, res) => {
  const recipe = await Recipe.findByIdAndDelete(req.params.id);

  if (!recipe) {
    return res.status(404).json({
      success: false,
      error: "Recette non trouvée"
    });
  }

  res.status(200).json({
    success: true,
    message: "Recette supprimée avec succès"
  });
});

module.exports = {
  getAllRecipes,
  createRecipe,
  getRecipeById,
  updateRecipe,
  deleteRecipe
};
