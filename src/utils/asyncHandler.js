/**
 * Wrapper pour gérer les erreurs async/await automatiquement
 * Évite d'avoir à répéter try/catch dans chaque controller
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
