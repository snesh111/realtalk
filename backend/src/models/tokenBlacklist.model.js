import mongoose from "mongoose";

const tokenBlacklistSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  }
);

// TTL index — auto delete expired tokens
tokenBlacklistSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 }
);

const TokenBlacklist = mongoose.model(
  "TokenBlacklist",
  tokenBlacklistSchema
);
export default TokenBlacklist;