const express = require("express");
const router = express.Router();
const { auth } = require("../middlewares/authMiddleware");
const commentController = require("../controllers/comment.controller");

router.post("/", auth, commentController.createComment);
router.get("/recipe/:recipeId", commentController.getComments);
router.put("/:id", auth, commentController.updateComment);
router.delete("/:id", auth, commentController.deleteComment);

module.exports = router;
