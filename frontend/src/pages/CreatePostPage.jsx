import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axiosInstance";

const CATEGORIES = ["Career", "Tech", "College", "Life", "Finance"];

export default function CreatePostPage() {
  const [form, setForm] = useState({
    title: "", content: "", category: "Tech", tags: "", isAnonymous: false,
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error("Image must be under 5MB"); return; }
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("content", form.content);
      formData.append("category", form.category);
      formData.append("tags", form.tags);
      formData.append("isAnonymous", form.isAnonymous);
      if (image) formData.append("image", image);
      const res = await api.post("/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Question posted!");
      navigate(`/posts/${res.data.data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-100 mb-6">Ask a Question</h1>
      <div className="bg-[#1a1a2e] border border-[#2a2a3e] rounded-2xl p-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Category</label>
            <select
              value={form.category}
              onChange={e => setForm({ ...form, category: e.target.value })}
              className="w-full bg-[#0f0f17] border border-[#2a2a3e] rounded-lg px-4 py-2.5 text-sm text-gray-100 focus:outline-none focus:border-[#6C63FF] transition"
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
              className="w-full bg-[#0f0f17] border border-[#2a2a3e] rounded-lg px-4 py-2.5 text-sm text-gray-100 focus:outline-none focus:border-[#6C63FF] transition"
              placeholder="Be specific — others should understand in one line"
              required
            />
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Details</label>
            <textarea
              value={form.content}
              onChange={e => setForm({ ...form, content: e.target.value })}
              rows={5}
              className="w-full bg-[#0f0f17] border border-[#2a2a3e] rounded-lg px-4 py-2.5 text-sm text-gray-100 focus:outline-none focus:border-[#6C63FF] transition resize-none"
              placeholder="Add context: your situation, what you've tried..."
              required
            />
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Attach Image (optional)</label>
            <div
              onClick={() => document.getElementById("image-input").click()}
              className="w-full border-2 border-dashed border-[#2a2a3e] rounded-lg p-4 text-center cursor-pointer hover:border-[#6C63FF] transition"
            >
              {preview ? (
                <img src={preview} alt="preview" className="max-h-48 mx-auto rounded-lg object-cover" />
              ) : (
                <div className="text-gray-500 text-sm">
                  <p className="text-2xl mb-1">📷</p>
                  <p>Click to upload image</p>
                  <p className="text-xs text-gray-600 mt-1">JPG, PNG, GIF up to 5MB</p>
                </div>
              )}
            </div>
            <input id="image-input" type="file" accept="image/*" onChange={handleImage} className="hidden" />
            {preview && (
              <button type="button" onClick={() => { setImage(null); setPreview(null); }}
                className="text-xs text-red-400 hover:text-red-300 mt-1 transition">
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
              className="w-full bg-[#0f0f17] border border-[#2a2a3e] rounded-lg px-4 py-2.5 text-sm text-gray-100 focus:outline-none focus:border-[#6C63FF] transition"
              placeholder="devops, linux, career"
            />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="anon" checked={form.isAnonymous}
              onChange={e => setForm({ ...form, isAnonymous: e.target.checked })}
              className="accent-[#6C63FF]" />
            <label htmlFor="anon" className="text-sm text-gray-400">Post anonymously</label>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-[#6C63FF] hover:bg-[#5b54e8] disabled:opacity-50 text-white py-2.5 rounded-lg text-sm font-medium transition"
          >
            {loading ? "Posting..." : "Post Question"}
          </button>
        </form>
      </div>
    </div>
  );
}
