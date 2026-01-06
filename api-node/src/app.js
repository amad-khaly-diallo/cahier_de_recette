const express = require('express');
const cookieParser = require('cookie-parser');
const userRoutes = require("./routes/user.routes");
const recipeRoutes = require("./routes/recipe.routes");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./docs/swagger");

const app = express();

app.use(express.json());
app.use(cookieParser());

// Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (req, res) => res.send('api is running'))
app.use("/api/users", userRoutes);
app.use("/api/recipes", recipeRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

module.exports = app;