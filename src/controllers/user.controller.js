const User = require("../models/User");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/generateTokens");
const asyncHandler = require("../utils/asyncHandler");

/**
 * @route GET /api/users
 * @desc Lister tous les utilisateurs (admin uniquement)
 */
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password");
  
  res.status(200).json({
    success: true,
    count: users.length,
    data: users
  });
});

/**
 * @route POST /api/auth/register
 * @desc Créer un nouvel utilisateur
 */
const createUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Validation des champs requis
  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      error: "Veuillez fournir un nom, un email et un mot de passe"
    });
  }

  // Vérifier si l'utilisateur existe déjà
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({
      success: false,
      error: "Cet email est déjà utilisé"
    });
  }

  // Hash du mot de passe
  const hashedPassword = await bcrypt.hash(password, 10);
  
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    isAdmin: false
  });

  res.status(201).json({
    success: true,
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt
    }
  });
});

/**
 * @route POST /api/auth/login
 * @desc Connecter un utilisateur
 */
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validation des champs requis
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error: "Veuillez fournir un email et un mot de passe"
    });
  }

  // Trouver l'utilisateur avec le mot de passe
  const user = await User.findOne({ email }).select("+password");
  
  if (!user) {
    return res.status(401).json({
      success: false,
      error: "Identifiants invalides"
    });
  }

  // Vérifier le mot de passe
  const isMatch = await bcrypt.compare(password, user.password);
  
  if (!isMatch) {
    return res.status(401).json({
      success: false,
      error: "Identifiants invalides"
    });
  }

  // Générer le JWT
  const token = generateToken(user._id);

  // Envoyer le token dans un cookie httpOnly
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000, // 24 heures
  });

  res.status(200).json({
    success: true,
    message: "Connexion réussie",
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin
      }
    }
  });
});

/**
 * @route GET /api/users/:id
 * @desc Obtenir un utilisateur par ID
 */
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  
  if (!user) {
    return res.status(404).json({
      success: false,
      error: "Utilisateur non trouvé"
    });
  }

  res.status(200).json({
    success: true,
    data: user
  });
});

/**
 * @route PUT /api/users/:id
 * @desc Mettre à jour un utilisateur
 */
const updateUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const updateData = {};

  // Construire l'objet de mise à jour
  if (name) updateData.name = name;
  if (email) updateData.email = email;
  if (password) {
    // Hash le nouveau mot de passe
    updateData.password = await bcrypt.hash(password, 10);
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    updateData,
    {
      new: true,
      runValidators: true
    }
  ).select("-password");

  if (!user) {
    return res.status(404).json({
      success: false,
      error: "Utilisateur non trouvé"
    });
  }

  res.status(200).json({
    success: true,
    data: user
  });
});

/**
 * @route DELETE /api/users/:id
 * @desc Supprimer un utilisateur (admin uniquement)
 */
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      error: "Utilisateur non trouvé"
    });
  }

  res.status(200).json({
    success: true,
    message: "Utilisateur supprimé avec succès"
  });
});

/**
 * @route POST /api/auth/logout
 * @desc Déconnecter l'utilisateur
 */
const logoutUser = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  
  res.status(200).json({
    success: true,
    message: "Déconnexion réussie"
  });
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
  logoutUser
};
