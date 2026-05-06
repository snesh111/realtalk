import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import postRoutes from "./routes/post.routes.js";
import commentRoutes from "./routes/comment.routes.js";
import voteRoutes from "./routes/vote.routes.js";
import userRoutes from "./routes/user.routes.js";
import errorHandler from "./middleware/errorHandler.js";

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth",     authRoutes);
app.use("/api/posts",    postRoutes);
app.use("/api",          commentRoutes);
app.use("/api/votes",    voteRoutes);
app.use("/api/users",    userRoutes);

// Global error handler — always last
app.use(errorHandler);

export default app;