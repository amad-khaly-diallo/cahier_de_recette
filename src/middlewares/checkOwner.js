const asyncHandler = require("../utils/asyncHandler");

/**
 * Middleware pour vérifier si l'utilisateur est propriétaire de la ressource
 * ou s'il est administrateur
 * 
 * @param {Model} model - Le modèle Mongoose (ex: Recipe, Comment)
 * @param {string} idParam - Le nom du paramètre dans l'URL (par défaut: "id")
 * @returns {Function} Middleware Express
 */
const checkOwner = (model, idParam = "id") => {
  return asyncHandler(async (req, res, next) => {
    const resource = await model.findById(req.params[idParam]);
    
    if (!resource) {
      return res.status(404).json({
        success: false,
        error: "Ressource non trouvée"
      });
    }

    // Vérifier si l'utilisateur est le propriétaire ou un admin
    const isOwner = resource.userId.toString() === req.user._id.toString();
    const isAdmin = req.user.isAdmin;

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        error: "Accès refusé, vous n'êtes pas l'auteur de cette ressource"
      });
    }

    next();
  });
};

module.exports = checkOwner;
