import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import Comment from "../models/comment.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import { sendSuccess, sendError } from "../utils/response.js";
import { activeQuery } from "../utils/activeQuery.js";

export const getPosts = asyncHandler(async (req, res) => {
  const { category, sort = "latest", page = 1, limit = 10, search } = req.query;

  // Build filter
  const filter = activeQuery(category ? { category } : {});

  // Search filter
  if (search && search.trim()) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { content: { $regex: search, $options: "i" } },
      { tags: { $in: [new RegExp(search, "i")] } },
    ];
  }

  const sortQuery = sort === "top" ? { voteCount: -1 } : { createdAt: -1 };
  const skip = (page - 1) * limit;

  const [posts, totalPosts] = await Promise.all([
    Post.find(filter).sort(sortQuery).skip(skip).limit(Number(limit)),
    Post.countDocuments(filter),
  ]);

  const totalPages = totalPosts === 0 ? 0 : Math.ceil(totalPosts / limit);

  return sendSuccess(res, {
    posts, totalPosts, totalPages, currentPage: Number(page)
  }, totalPosts === 0 ? "No posts found" : "Posts fetched successfully");
});

export const getPost = asyncHandler(async (req, res) => {
  const post = await Post.findOne(activeQuery({ _id: req.params.postId }));
  if (!post) return sendError(res, "Post not found", 404);
  return sendSuccess(res, post, "Post fetched successfully");
});

export const createPost = asyncHandler(async (req, res) => {
  const { title, content, category, tags, isAnonymous } = req.body;
  if (!title || !content || !category) {
    return sendError(res, "Title, content and category are required", 400);
  }
  const user = await User.findById(req.user._id);
  if (!user) return sendError(res, "User not found", 404);
  const post = await Post.create({
    title, content, category,
    tags: tags ? (Array.isArray(tags) ? tags : tags.split(",").map(t => t.trim())) : [],
    isAnonymous: isAnonymous === "true" || isAnonymous === true,
    userId: user._id,
    authorName: (isAnonymous === "true" || isAnonymous === true) ? "Anonymous" : user.username,
    imageUrl: req.file ? req.file.path : null,
  });
  return sendSuccess(res, post, "Post created successfully", 201);
});

export const updatePost = asyncHandler(async (req, res) => {
  const post = await Post.findOne(activeQuery({ _id: req.params.postId }));
  if (!post) return sendError(res, "Post not found", 404);
  if (post.userId.toString() !== req.user._id.toString()) {
    return sendError(res, "Not authorized to update this post", 403);
  }
  const { title, content, tags } = req.body;
  if (title) post.title = title;
  if (content) post.content = content;
  if (tags) post.tags = tags;
  if (req.file) post.imageUrl = req.file.path;
  await post.save();
  return sendSuccess(res, post, "Post updated successfully");
});

export const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findOne(activeQuery({ _id: req.params.postId }));
  if (!post) return sendError(res, "Post not found", 404);
  if (post.userId.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    return sendError(res, "Not authorized to delete this post", 403);
  }
  post.isDeleted = true;
  post.deletedAt = new Date();
  await post.save();
  return sendSuccess(res, null, "Post deleted successfully");
});

export const markSolution = asyncHandler(async (req, res) => {
  const { commentId } = req.body;
  if (!commentId) return sendError(res, "commentId is required", 400);
  const post = await Post.findOne(activeQuery({ _id: req.params.postId }));
  if (!post) return sendError(res, "Post not found", 404);
  if (post.userId.toString() !== req.user._id.toString()) {
    return sendError(res, "Only post owner can mark solution", 403);
  }
  const comment = await Comment.findOne(
    activeQuery({ _id: commentId, postId: req.params.postId })
  );
  if (!comment) return sendError(res, "Comment not found on this post", 404);
  post.solutionCommentId = commentId;
  await post.save();
  return sendSuccess(res, { solutionCommentId: commentId }, "Solution marked successfully");
});

export const getCategoryCounts = asyncHandler(async (req, res) => {
  const categories = ["Career", "Tech", "College", "Life", "Finance"];

  const counts = await Promise.all(
    categories.map(async (cat) => ({
      category: cat,
      count: await Post.countDocuments({ category: cat, isDeleted: false }),
    }))
  );

  const total = await Post.countDocuments({ isDeleted: false });

  return sendSuccess(res, { total, counts }, "Category counts fetched");
});
