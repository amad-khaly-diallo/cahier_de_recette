const mongoose = require('mongoose');

/**
 * Middleware pour valider les ObjectId MongoDB
 */
const validateObjectId = (paramName = 'id') => {
  return (req, res, next) => {
    const id = req.params[paramName];
    
    if (!id) {
      return res.status(400).json({
        success: false,
        error: `Paramètre ${paramName} manquant`
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: `ID invalide: ${id}`
      });
    }

    next();
  };
};

module.exports = validateObjectId;
