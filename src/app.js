const express = require('express');
const cookieParser = require('cookie-parser');
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./docs/swagger");
const errorHandler = require("./middlewares/errorHandler");

// Routes
const userRoutes = require("./routes/user.routes");
const recipeRoutes = require("./routes/recipe.routes");
const commentRoutes = require("./routes/comment.routes");
const authRoutes = require("./routes/auth.routes");

const app = express();

// Middlewares de base
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Swagger Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes API
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/recipes", recipeRoutes);
app.use("/api/comment", commentRoutes);

// Route de santé (health check)
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API en ligne",
    timestamp: new Date().toISOString()
  });
});

// Route 404 pour les routes non trouvées
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.method} ${req.originalUrl} non trouvée`
  });
});

// Middleware de gestion d'erreurs (doit être le dernier)
app.use(errorHandler);

module.exports = app;
