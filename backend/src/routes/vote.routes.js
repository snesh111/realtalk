import express from "express";
import { castVote } from "../controllers/vote.controller.js";
import protect from "../middleware/auth.js";
import { validateVote } from "../validators/vote.validator.js";

const router = express.Router();

router.post("/", protect, validateVote, castVote);

export default router;
