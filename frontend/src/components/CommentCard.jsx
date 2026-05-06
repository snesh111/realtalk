import VoteButton from "./VoteButton";
import useAuthStore from "../store/authStore";
import { deleteCommentAPI } from "../api/comment.api";
import toast from "react-hot-toast";

export default function CommentCard({ comment, isPostOwner, onMarkSolution, onDelete }) {
  const { user } = useAuthStore();
  const isOwner = user?._id === comment.userId;

  const handleDelete = async () => {
    if (!confirm("Delete this answer?")) return;
    try {
      await deleteCommentAPI(comment._id);
      toast.success("Answer deleted!");
      if (onDelete) onDelete(comment._id);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete");
    }
  };

  return (
    <div className={`bg-[#1a1a2e] border rounded-xl p-4 flex gap-4 transition ${
      comment.isSolution
        ? "border-green-500/40 bg-green-500/5"
        : "border-[#2a2a3e]"
    }`}>
      <VoteButton
        targetId={comment._id}
        targetType="comment"
        initialCount={comment.voteCount}
      />
      <div className="flex-1">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-300">{comment.authorName}</span>
            {comment.isEdited && (
              <span className="text-xs text-gray-600">(edited)</span>
            )}
            {comment.isSolution && (
              <span className="text-xs bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full">
                ✓ Best Answer
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-600">
              {new Date(comment.createdAt).toLocaleDateString()}
            </span>
            {isOwner && (
              <button
                onClick={handleDelete}
                className="text-xs text-gray-500 hover:text-red-400 transition"
              >
                🗑️
              </button>
            )}
          </div>
        </div>
        <p className="text-sm text-gray-300 leading-relaxed">{comment.content}</p>
        {isPostOwner && !comment.isSolution && (
          <button
            onClick={() => onMarkSolution(comment._id)}
            className="mt-2 text-xs text-gray-500 hover:text-green-400 transition"
          >
            ✓ Mark as Solution
          </button>
        )}
      </div>
    </div>
  );
}
