import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import { logoutAPI } from "../api/auth.api";
import { getPostsAPI } from "../api/post.api";
import toast from "react-hot-toast";

function OwlLogo({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 120">
      <ellipse cx="50" cy="80" rx="35" ry="38" fill="#1e1b4b"/>
      <ellipse cx="20" cy="85" rx="16" ry="24" fill="#312e81" transform="rotate(-15,20,85)"/>
      <ellipse cx="80" cy="85" rx="16" ry="24" fill="#312e81" transform="rotate(15,80,85)"/>
      <ellipse cx="50" cy="88" rx="20" ry="24" fill="#4338ca"/>
      <ellipse cx="50" cy="62" rx="28" ry="24" fill="#4338ca"/>
      <polygon points="28,42 36,26 44,44" fill="#312e81"/>
      <polygon points="56,44 64,26 72,42" fill="#312e81"/>
      <circle cx="38" cy="60" r="10" fill="white"/>
      <circle cx="62" cy="60" r="10" fill="white"/>
      <circle cx="40" cy="61" r="6" fill="#1e1b4b"/>
      <circle cx="64" cy="61" r="6" fill="#1e1b4b"/>
      <circle cx="41" cy="60" r="2" fill="white"/>
      <circle cx="65" cy="60" r="2" fill="white"/>
      <polygon points="50,68 44,75 56,75" fill="#F59E0B"/>
    </svg>
  );
}

export default function Navbar() {
  const { user, clearAuth } = useAuthStore();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searching, setSearching] = useState(false);
  const searchRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    if (!search.trim()) { setResults([]); setShowDropdown(false); return; }
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await getPostsAPI({ search, limit: 5 });
        setResults(res.data.data.posts);
        setShowDropdown(true);
      } catch { setResults([]); }
      finally { setSearching(false); }
    }, 400);
    return () => clearTimeout(debounceRef.current);
  }, [search]);

  const handleLogout = async () => {
    try { await logoutAPI(); } catch {}
    clearAuth();
    toast.success("Logged out!");
    navigate("/login");
  };

  return (
    <nav className="bg-[#0f0f17] border-b border-[#2a2a3e] sticky top-0 z-50">
      <div className="px-6 py-3 flex items-center justify-between gap-4">

        {/* Search */}
        <div className="flex-1 max-w-lg relative" ref={searchRef}>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">🔍</span>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter" && search.trim()) {
                  setShowDropdown(false);
                  navigate(`/?search=${encodeURIComponent(search)}`);
                }
              }}
              onFocus={() => results.length > 0 && setShowDropdown(true)}
              placeholder="Search questions..."
              className="w-full bg-[#1a1a2e] border border-[#2a2a3e] rounded-lg pl-9 pr-4 py-2 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-[#6C63FF] transition"
            />
            {searching && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs">searching...</span>
            )}
          </div>

          {showDropdown && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-[#1a1a2e] border border-[#2a2a3e] rounded-xl shadow-xl overflow-hidden z-50">
              {results.length === 0 ? (
                <div className="px-4 py-3 text-sm text-gray-500">No results found</div>
              ) : (
                <>
                  {results.map(post => (
                    <div
                      key={post._id}
                      onClick={() => { setSearch(""); setShowDropdown(false); navigate(`/posts/${post._id}`); }}
                      className="px-4 py-3 hover:bg-[#0f0f17] cursor-pointer border-b border-[#2a2a3e] last:border-0 transition"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-[#6C63FF]">{post.category}</span>
                        {post.solutionCommentId && <span className="text-xs text-green-400">✓ Solved</span>}
                      </div>
                      <p className="text-sm text-gray-200 line-clamp-1">{post.title}</p>
                      <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{post.content}</p>
                    </div>
                  ))}
                  <div
                    onClick={() => { setShowDropdown(false); navigate(`/?search=${encodeURIComponent(search)}`); }}
                    className="px-4 py-2 text-xs text-[#6C63FF] hover:bg-[#0f0f17] cursor-pointer text-center transition"
                  >
                    See all results for "{search}"
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link to="/create" className="bg-[#6C63FF] hover:bg-[#5b54e8] text-white text-sm px-4 py-2 rounded-lg transition font-medium">
                + Ask
              </Link>
              <Link to={`/profile/${user.username}`} className="text-sm text-gray-300 hover:text-white transition">
                {user.username}
              </Link>
              <button onClick={handleLogout} className="text-sm text-gray-500 hover:text-red-400 transition">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm text-gray-300 hover:text-white transition">Login</Link>
              <Link to="/register" className="bg-[#6C63FF] hover:bg-[#5b54e8] text-white text-sm px-4 py-2 rounded-lg transition">Sign Up</Link>
            </>
          )}
        </div>

      </div>
    </nav>
  );
}
