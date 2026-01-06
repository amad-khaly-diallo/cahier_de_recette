// model = le modèle mongoose (ex: Recipe)
// idParam = le nom du paramètre dans l'URL (ex: "id")
const checkOwner = (model, idParam = "id") => {
  return async (req, res, next) => {
    try {
      const resource = await model.findById(req.params[idParam]);
      if (!resource) return res.status(404).json({ message: "Ressource non trouvée" });

      // Si c'est le propriétaire ou un admin, ok
      if (resource.userId.toString() === req.user._id.toString() || req.user.isAdmin) {
        next();
      } else {
        res.status(403).json({ message: "Forbidden: vous n'êtes pas l'auteur" });
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
};

module.exports = checkOwner;