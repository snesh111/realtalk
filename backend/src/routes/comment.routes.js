import express from "express";
import {
  getComments,
  createComment,
  updateComment,
  deleteComment,
} from "../controllers/comment.controller.js";
import protect from "../middleware/auth.js";

const router = express.Router({ mergeParams: true });

router.get("/posts/:postId/comments",      getComments);
router.post("/posts/:postId/comments",     protect, createComment);
router.patch("/comments/:commentId",       protect, updateComment);
router.delete("/comments/:commentId",      protect, deleteComment);

export default router;