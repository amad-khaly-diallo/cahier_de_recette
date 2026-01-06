
const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const protect = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Gestion des utilisateurs
 */

/**
 * @swagger
 * /api/users/auth/register:
 *   post:
 *     summary: Créer un utilisateur
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Utilisateur créé
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Récupérer tous les utilisateurs
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Liste des utilisateurs
 */

// Auth
router.post("/auth/register", userController.createUser);
router.post("/auth/login", userController.loginUser);
router.post("/auth/logout", protect, userController.logoutUser);

// CRUD Users
router.get("/", protect, admin, userController.getAllUsers); // seulement admin
router.get("/:id", protect, userController.getUserById); // user ou admin
router.put("/:id", protect, userController.updateUser); // user ou admin
router.delete("/:id", protect, admin, userController.deleteUser); // seulement admin

module.exports = router;
