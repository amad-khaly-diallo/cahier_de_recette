/**
 * Middleware pour vérifier si l'utilisateur est administrateur
 * Doit être utilisé après le middleware protect
 */
const admin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: "Non autorisé, authentification requise"
    });
  }

  if (!req.user.isAdmin) {
    return res.status(403).json({
      success: false,
      error: "Accès refusé, droits administrateur requis"
    });
  }

  next();
};

module.exports = admin;
