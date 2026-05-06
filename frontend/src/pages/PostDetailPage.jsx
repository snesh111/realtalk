import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPostAPI, markSolutionAPI, deletePostAPI } from "../api/post.api";
import { getCommentsAPI, createCommentAPI } from "../api/comment.api";
import VoteButton from "../components/VoteButton";
import CommentCard from "../components/CommentCard";
import useAuthStore from "../store/authStore";
import toast from "react-hot-toast";

const COMMENTS_PER_PAGE = 5;

export default function PostDetailPage() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [commentPage, setCommentPage] = useState(1);
  const { user } = useAuthStore();

  useEffect(() => { fetchData(); }, [postId]);

  const fetchData = async () => {
    try {
      const [postRes, commentsRes] = await Promise.all([
        getPostAPI(postId),
        getCommentsAPI(postId),
      ]);
      setPost(postRes.data.data);
      setComments(commentsRes.data.data.comments);
    } catch {
      toast.error("Failed to load post");
    } finally {
      setLoading(false);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!user) { toast.error("Login to answer!"); return; }
    setSubmitting(true);
    try {
      const res = await createCommentAPI(postId, { content });
      setComments(prev => [...prev, res.data.data]);
      setContent("");
      toast.success("Answer posted!");
      // Go to last page to show new comment
      setCommentPage(Math.ceil((comments.length + 1) / COMMENTS_PER_PAGE));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to post");
    } finally {
      setSubmitting(false);
    }
  };

  const handleMarkSolution = async (commentId) => {
    try {
      await markSolutionAPI(postId, commentId);
      setPost(prev => ({ ...prev, solutionCommentId: commentId }));
      setComments(prev => prev.map(c => ({ ...c, isSolution: c._id === commentId })));
      toast.success("Solution marked! ✓");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    }
  };

  const handleDeleteComment = (commentId) => {
    setComments(prev => prev.filter(c => c._id !== commentId));
    setPost(prev => ({ ...prev, commentCount: prev.commentCount - 1 }));
  };

  const handleDeletePost = async () => {
    if (!confirm("Delete this post?")) return;
    try {
      await deletePostAPI(postId);
      toast.success("Post deleted!");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete");
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard! 🔗");
  };

  // Pagination logic
  const totalCommentPages = Math.ceil(comments.length / COMMENTS_PER_PAGE);
  const paginatedComments = comments.slice(
    (commentPage - 1) * COMMENTS_PER_PAGE,
    commentPage * COMMENTS_PER_PAGE
  );

  // Always show solution comment on first page
  const solutionComment = comments.find(c => c.isSolution);
  const displayComments = commentPage === 1 && solutionComment
    ? [solutionComment, ...paginatedComments.filter(c => !c.isSolution)]
    : paginatedComments;

  if (loading) return (
    <div className="space-y-4 max-w-3xl">
      <div className="bg-[#1a1a2e] rounded-xl h-40 animate-pulse" />
      <div className="bg-[#1a1a2e] rounded-xl h-24 animate-pulse" />
      <div className="bg-[#1a1a2e] rounded-xl h-24 animate-pulse" />
    </div>
  );

  if (!post) return (
    <div className="text-center py-20">
      <p className="text-4xl mb-3">🤔</p>
      <p className="text-gray-500">Post not found</p>
      <button onClick={() => navigate("/")} className="mt-4 text-[#6C63FF] hover:underline text-sm">
        Go back home
      </button>
    </div>
  );

  const isPostOwner = user?._id === post.userId;

  return (
    <div className="max-w-3xl">

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#6C63FF] transition mb-4"
      >
        ← Back
      </button>

      {/* Post */}
      <div className="bg-[#1a1a2e] border border-[#2a2a3e] rounded-2xl p-6 flex gap-4 mb-6">
        <VoteButton targetId={post._id} targetType="post" initialCount={post.voteCount} />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className="text-xs bg-[#6C63FF]/10 text-[#6C63FF] border border-[#6C63FF]/20 px-2 py-0.5 rounded-full">
              {post.category}
            </span>
            <span className="text-xs text-gray-500">by {post.authorName}</span>
            <span className="text-xs text-gray-600">
              {new Date(post.createdAt).toLocaleDateString()}
            </span>
            {post.solutionCommentId && (
              <span className="text-xs bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full">
                ✓ Solved
              </span>
            )}
          </div>

          <h1 className="text-xl font-bold text-gray-100 mb-3">{post.title}</h1>
          <p className="text-gray-400 text-sm leading-relaxed mb-4">{post.content}</p>

          {post.imageUrl && (
            <img
              src={post.imageUrl}
              alt="post"
              className="rounded-xl max-h-96 object-cover mb-4 border border-[#2a2a3e] w-full"
            />
          )}

          {post.tags?.length > 0 && (
            <div className="flex gap-2 flex-wrap mb-4">
              {post.tags.map(tag => (
                <span key={tag} className="text-xs text-gray-600">#{tag}</span>
              ))}
            </div>
          )}

          {/* Post Actions */}
          <div className="flex items-center gap-4 pt-3 border-t border-[#2a2a3e]">
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#6C63FF] transition"
            >
              🔗 Share
            </button>
            {isPostOwner && (
              <>
                <button
                  onClick={() => navigate(`/edit/${post._id}`)}
                  className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#6C63FF] transition"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={handleDeletePost}
                  className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-red-400 transition"
                >
                  🗑️ Delete
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Comments Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-100">
          {comments.length} Answers
        </h2>
        {totalCommentPages > 1 && (
          <span className="text-xs text-gray-500">
            Page {commentPage} of {totalCommentPages}
          </span>
        )}
      </div>

      {/* Comments List */}
      {comments.length === 0 ? (
        <div className="text-center py-10 text-gray-600 bg-[#1a1a2e] rounded-xl border border-[#2a2a3e] mb-6">
          <p className="text-3xl mb-2">💬</p>
          <p className="text-sm">No answers yet — be the first to help!</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3 mb-4">
          {displayComments.map(comment => (
            <CommentCard
              key={comment._id}
              comment={comment}
              isPostOwner={isPostOwner}
              onMarkSolution={handleMarkSolution}
              onDelete={handleDeleteComment}
            />
          ))}
        </div>
      )}

      {/* Comment Pagination */}
      {totalCommentPages > 1 && (
        <div className="flex justify-center gap-2 mb-6">
          <button
            onClick={() => setCommentPage(p => Math.max(1, p - 1))}
            disabled={commentPage === 1}
            className="px-3 py-1.5 bg-[#1a1a2e] border border-[#2a2a3e] rounded-lg text-xs disabled:opacity-40 hover:border-[#6C63FF] transition"
          >
            ← Prev
          </button>
          {[...Array(totalCommentPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCommentPage(i + 1)}
              className={`px-3 py-1.5 rounded-lg text-xs transition border ${
                commentPage === i + 1
                  ? "bg-[#6C63FF] text-white border-[#6C63FF]"
                  : "bg-[#1a1a2e] border-[#2a2a3e] hover:border-[#6C63FF] text-gray-400"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCommentPage(p => Math.min(totalCommentPages, p + 1))}
            disabled={commentPage === totalCommentPages}
            className="px-3 py-1.5 bg-[#1a1a2e] border border-[#2a2a3e] rounded-lg text-xs disabled:opacity-40 hover:border-[#6C63FF] transition"
          >
            Next →
          </button>
        </div>
      )}

      {/* Add Answer */}
      <div className="bg-[#1a1a2e] border border-[#2a2a3e] rounded-2xl p-6">
        <h3 className="text-sm font-semibold text-gray-300 mb-3">Your Answer</h3>
        {!user ? (
          <div className="text-center py-6">
            <p className="text-gray-500 text-sm mb-3">Login to post an answer</p>
            <button
              onClick={() => navigate("/login")}
              className="bg-[#6C63FF] hover:bg-[#5b54e8] text-white px-6 py-2 rounded-lg text-sm transition"
            >
              Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleComment}>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              rows={4}
              className="w-full bg-[#0f0f17] border border-[#2a2a3e] rounded-lg px-4 py-3 text-sm text-gray-100 focus:outline-none focus:border-[#6C63FF] transition resize-none mb-3"
              placeholder="Write a helpful, structured answer..."
              required
              maxLength={500}
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600">{content.length}/500</span>
              <button
                type="submit"
                disabled={submitting || content.length === 0}
                className="bg-[#6C63FF] hover:bg-[#5b54e8] disabled:opacity-50 text-white px-6 py-2 rounded-lg text-sm font-medium transition"
              >
                {submitting ? "Posting..." : "Post Answer"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
