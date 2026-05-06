import express from "express";
import {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  markSolution,
  getCategoryCounts,
} from "../controllers/post.controller.js";
import protect from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.get("/category-counts",     getCategoryCounts);
router.get("/",                    getPosts);
router.get("/:postId",             getPost);
router.post("/",                   protect, upload.single("image"), createPost);
router.patch("/:postId",           protect, upload.single("image"), updatePost);
router.delete("/:postId",          protect, deletePost);
router.patch("/:postId/solution",  protect, markSolution);

export default router;
