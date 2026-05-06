import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPostAPI, updatePostAPI } from "../api/post.api";
import toast from "react-hot-toast";
import api from "../api/axiosInstance";

const CATEGORIES = ["Career", "Tech", "College", "Life", "Finance"];

export default function EditPostPage() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "", content: "", category: "Tech", tags: "",
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await getPostAPI(postId);
        const post = res.data.data;
        setForm({
          title: post.title,
          content: post.content,
          category: post.category,
          tags: post.tags?.join(", ") || "",
        });
        if (post.imageUrl) setPreview(post.imageUrl);
      } catch {
        toast.error("Failed to load post");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [postId]);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("content", form.content);
      formData.append("category", form.category);
      formData.append("tags", form.tags);
      if (image) formData.append("image", image);

      await api.patch(`/posts/${postId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Post updated!");
      navigate(`/posts/${postId}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="bg-[#1a1a2e] rounded-xl h-40 animate-pulse" />
  );

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-100 mb-6">Edit Question</h1>

      <div className="bg-[#1a1a2e] border border-[#2a2a3e] rounded-2xl p-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          <div>
            <label className="text-xs text-gray-400 mb-1 block">Category</label>
            <select
              value={form.category}
              onChange={e => setForm({ ...form, category: e.target.value })}
              className="w-full bg-[#0f0f17] border border-[#2a2a3e] rounded-lg px-4 py-2.5 text-sm text-gray-100 focus:outline-none focus:border-orange-500 transition"
            >
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="text-xs text-gray-400 mb-1 block">Question Title</label>
            <input
              type="text"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              className="w-full bg-[#0f0f17] border border-[#2a2a3e] rounded-lg px-4 py-2.5 text-sm text-gray-100 focus:outline-none focus:border-orange-500 transition"
              required
            />
          </div>

          <div>
            <label className="text-xs text-gray-400 mb-1 block">Details</label>
            <textarea
              value={form.content}
              onChange={e => setForm({ ...form, content: e.target.value })}
              rows={5}
              className="w-full bg-[#0f0f17] border border-[#2a2a3e] rounded-lg px-4 py-2.5 text-sm text-gray-100 focus:outline-none focus:border-orange-500 transition resize-none"
              required
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="text-xs text-gray-400 mb-1 block">
              Image (optional)
            </label>
            <div
              onClick={() => document.getElementById("edit-image-input").click()}
              className="w-full border-2 border-dashed border-[#2a2a3e] rounded-lg p-4 text-center cursor-pointer hover:border-orange-500 transition"
            >
              {preview ? (
                <img
                  src={preview}
                  alt="preview"
                  className="max-h-48 mx-auto rounded-lg object-cover"
                />
              ) : (
                <div className="text-gray-500 text-sm">
                  <p className="text-2xl mb-1">📷</p>
                  <p>Click to upload new image</p>
                </div>
              )}
            </div>
            <input
              id="edit-image-input"
              type="file"
              accept="image/*"
              onChange={handleImage}
              className="hidden"
            />
            {preview && (
              <button
                type="button"
                onClick={() => { setImage(null); setPreview(null); }}
                className="text-xs text-red-400 hover:text-red-300 mt-1 transition"
              >
                Remove image
              </button>
            )}
          </div>

          <div>
            <label className="text-xs text-gray-400 mb-1 block">Tags (comma separated)</label>
            <input
              type="text"
              value={form.tags}
              onChange={e => setForm({ ...form, tags: e.target.value })}
              className="w-full bg-[#0f0f17] border border-[#2a2a3e] rounded-lg px-4 py-2.5 text-sm text-gray-100 focus:outline-none focus:border-orange-500 transition"
              placeholder="devops, linux, career"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-[#6C63FF] hover:bg-[#5b54e8] disabled:opacity-50 text-white py-2.5 rounded-lg text-sm font-medium transition"
            >
              {submitting ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={() => navigate(`/posts/${postId}`)}
              className="px-6 bg-[#0f0f17] border border-[#2a2a3e] text-gray-400 hover:text-white py-2.5 rounded-lg text-sm transition"
            >
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
