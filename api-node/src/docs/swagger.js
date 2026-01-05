const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Cahier de Recettes API",
      version: "1.0.0",
      description: "API pour gérer Users et Recettes"
    },
    servers: [
      { url: "http://localhost:3000" }
    ]
  },
  apis: ["./src/routes/*.js"] // on va documenter nos routes ici
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
