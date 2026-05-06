import { Link, useNavigate } from "react-router-dom";
import VoteButton from "./VoteButton";
import useAuthStore from "../store/authStore";
import { deletePostAPI } from "../api/post.api";
import toast from "react-hot-toast";

const CATEGORY_COLORS = {
  Career: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Tech: "bg-[#6C63FF]/10 text-[#6C63FF] border-[#6C63FF]/20",
  College: "bg-green-500/10 text-green-400 border-green-500/20",
  Life: "bg-pink-500/10 text-pink-400 border-pink-500/20",
  Finance: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
};

export default function PostCard({ post, onDelete }) {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const isOwner = user?._id === post.userId;

  const handleDelete = async (e) => {
    e.preventDefault();
    if (!confirm("Delete this post?")) return;
    try {
      await deletePostAPI(post._id);
      toast.success("Post deleted!");
      if (onDelete) onDelete(post._id);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete");
    }
  };

  return (
    <div className="bg-[#1a1a2e] border border-[#2a2a3e] rounded-xl p-4 flex gap-4 hover:border-[#6C63FF]/30 transition">
      <VoteButton
        targetId={post._id}
        targetType="post"
        initialCount={post.voteCount}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className={`text-xs px-2 py-0.5 rounded-full border ${CATEGORY_COLORS[post.category]}`}>
            {post.category}
          </span>
          <span className="text-xs text-gray-500">
            by {post.isAnonymous ? "Anonymous" : post.authorName}
          </span>
          <span className="text-xs text-gray-600">
            {new Date(post.createdAt).toLocaleDateString()}
          </span>
          {isOwner && (
            <div className="ml-auto flex items-center gap-2">
              <button
                onClick={() => navigate(`/edit/${post._id}`)}
                className="text-xs text-gray-500 hover:text-[#6C63FF] transition"
              >
                ✏️ Edit
              </button>
              <button
                onClick={handleDelete}
                className="text-xs text-gray-500 hover:text-red-400 transition"
              >
                🗑️ Delete
              </button>
            </div>
          )}
        </div>

        <Link to={`/posts/${post._id}`}>
          <h2 className="text-base font-semibold text-gray-100 hover:text-[#6C63FF] transition leading-snug mb-1">
            {post.title}
          </h2>
        </Link>

        <p className="text-sm text-gray-500 line-clamp-2 mb-3">{post.content}</p>

        {post.imageUrl && (
          <Link to={`/posts/${post._id}`}>
            <img
              src={post.imageUrl}
              alt="post"
              className="rounded-lg max-h-48 object-cover mb-3 border border-[#2a2a3e]"
            />
          </Link>
        )}

        <div className="flex items-center gap-4">
          <span className="text-xs text-gray-500">💬 {post.commentCount} answers</span>
          {post.solutionCommentId && (
            <span className="text-xs bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full">
              ✓ Solved
            </span>
          )}
          {post.tags?.map(tag => (
            <span key={tag} className="text-xs text-gray-600">#{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
