const swaggerJSDoc = require("swagger-jsdoc");
const path = require("path");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: " Recipe API",
      version: "1.0.0",
      description: `
API REST pour gérer :
- Authentification (JWT + Cookies)
- Recettes
- Commentaires
- Relations MongoDB (populate)
      `
    },

    servers: [
      {
        url: "http://localhost:3000",
        description: "Serveur local"
      }
    ],

    tags: [
      { name: "Auth", description: "Inscription, connexion et déconnexion" },
      { name: "Users", description: "Gestion des utilisateurs" },
      { name: "Recipes", description: "Gestion des recettes" },
      { name: "Comments", description: "Gestion des commentaires" }
    ],

    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "token",
          description: "JWT stocké dans un cookie HTTP"
        }
      },

      schemas: {
        Recipe: {
          type: "object",
          required: ["title", "ingredients", "instructions", "userId"],
          properties: {
            title: { type: "string", example: "Spaghetti Carbonara" },
            ingredients: {
              type: "array",
              items: { type: "string" },
              example: ["spaghetti", "œufs", "parmesan"]
            },
            instructions: {
              type: "string",
              example: "Cuire les pâtes puis mélanger avec la sauce."
            },
            preparationTime: { type: "number", example: 10 },
            cookingTime: { type: "number", example: 15 },
            servings: { type: "number", example: 2 },
            likes: { type: "number", example: 25 },
            userId: {
              type: "string",
              example: "695cdc84e5812e67da59f5b1"
            },
            createdAt: { type: "string", format: "date-time" }
          }
        },

        Comment: {
          type: "object",
          required: ["content", "recipeId"],
          properties: {
            content: {
              type: "string",
              example: "Super recette, facile et rapide 👍"
            },
            recipeId: {
              type: "string",
              example: "695e41f8a22305b1ae2a2c72"
            },
            userId: {
              type: "string",
              example: "695cdc84e5812e67da59f5b1"
            },
            createdAt: { type: "string", format: "date-time" }
          }
        },
        User: {
          type: "object",
          required: ["name", "email", "password"],
          properties: {
            name: { type: "string", example: "Khaly" },
            email: { type: "string", example: "khaly@example.com" },
            password: { type: "string", example: "123456" },
            isAdmin: { type: "boolean", example: false },
            createdAt: { type: "string", format: "date-time" }
          }
        }
      }
    },
  },

  apis: [
    path.join(__dirname, "../routes/*.js")
  ]
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
