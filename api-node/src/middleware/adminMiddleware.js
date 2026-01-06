// Vérifie si l'utilisateur connecté est admin
const admin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authorized" });
  }

  if (req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: "Admin only" });
  }
};

module.exports = admin;
