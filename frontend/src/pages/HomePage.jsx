import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { getPostsAPI } from "../api/post.api";
import PostCard from "../components/PostCard";
import Spinner from "../components/Spinner";
import toast from "react-hot-toast";

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("latest");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category") || "All";
  const search = searchParams.get("search") || "";

  useEffect(() => { fetchPosts(); }, [category, sort, page, search]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const params = { sort, page, limit: 10 };
      if (category !== "All") params.category = category;
      if (search) params.search = search;
      const res = await getPostsAPI(params);
      setPosts(res.data.data.posts);
      setTotalPages(res.data.data.totalPages);
      setTotalPosts(res.data.data.totalPosts);
    } catch {
      toast.error("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (postId) => {
    setPosts(prev => prev.filter(p => p._id !== postId));
    setTotalPosts(prev => prev - 1);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          {search ? (
            <h1 className="text-xl font-bold text-gray-100">
              Results for <span className="text-[#6C63FF]">"{search}"</span>
              <span className="text-sm text-gray-500 font-normal ml-2">({totalPosts} found)</span>
            </h1>
          ) : category === "All" ? (
            <h1 className="text-xl font-bold text-gray-100">
              Real questions. <span className="text-[#6C63FF]">Honest answers.</span>
            </h1>
          ) : (
            <h1 className="text-xl font-bold text-gray-100">
              <span className="text-[#6C63FF]">{category}</span>
              <span className="text-sm text-gray-500 font-normal ml-2">({totalPosts} posts)</span>
            </h1>
          )}
        </div>
      </div>

      {!search && (
        <div className="flex gap-2 mb-5">
          {["latest", "top"].map((s) => (
            <button
              key={s}
              onClick={() => { setSort(s); setPage(1); }}
              className={`px-4 py-1.5 rounded-lg text-sm capitalize transition ${
                sort === s
                  ? "bg-[#6C63FF] text-white"
                  : "bg-[#1a1a2e] text-gray-400 hover:text-white border border-[#2a2a3e]"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <Spinner text="Loading posts..." />
      ) : posts.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p className="text-4xl mb-3">{search ? "🔍" : "🤔"}</p>
          <p className="text-lg">
            {search ? `No results for "${search}"` : "No posts yet in this category"}
          </p>
          {!search && (
            <Link to="/create" className="text-[#6C63FF] hover:underline text-sm mt-2 inline-block">
              Be the first to ask!
            </Link>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} onDelete={handleDelete} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            className="px-4 py-2 bg-[#1a1a2e] border border-[#2a2a3e] rounded-lg text-sm disabled:opacity-40 hover:border-[#6C63FF] transition">
            ← Prev
          </button>
          <span className="px-4 py-2 text-sm text-gray-400">{page} / {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
            className="px-4 py-2 bg-[#1a1a2e] border border-[#2a2a3e] rounded-lg text-sm disabled:opacity-40 hover:border-[#6C63FF] transition">
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
