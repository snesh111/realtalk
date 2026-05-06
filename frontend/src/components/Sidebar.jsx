import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import useAuthStore from "../store/authStore";
import { getCategoryCountsAPI } from "../api/post.api";

const CATEGORIES = [
  { name: "All", icon: "🏠", path: "/" },
  { name: "Career", icon: "💼", path: "/?category=Career" },
  { name: "Tech", icon: "💻", path: "/?category=Tech" },
  { name: "College", icon: "🎓", path: "/?category=College" },
  { name: "Life", icon: "🌱", path: "/?category=Life" },
  { name: "Finance", icon: "💰", path: "/?category=Finance" },
];

function OwlLogo({ size = 40 }) {
  const s = size;
  return (
    <svg width={s} height={s} viewBox="0 0 100 120">
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
      <ellipse cx="40" cy="116" rx="10" ry="5" fill="#F59E0B" transform="rotate(-10,40,116)"/>
      <ellipse cx="62" cy="116" rx="10" ry="5" fill="#F59E0B" transform="rotate(10,62,116)"/>
    </svg>
  );
}

export default function Sidebar() {
  const { user } = useAuthStore();
  const location = useLocation();
  const [counts, setCounts] = useState({});
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const res = await getCategoryCountsAPI();
        const countMap = {};
        res.data.data.counts.forEach(c => { countMap[c.category] = c.count; });
        setCounts(countMap);
        setTotal(res.data.data.total);
      } catch {}
    };
    fetchCounts();
  }, []);

  return (
    <div className="flex flex-col h-full py-4 px-3 gap-6">

      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 px-3 py-2">
        <OwlLogo size={38} />
        <span className="text-xl font-bold text-[#6C63FF]">RealTalk</span>
      </Link>

      {/* Categories */}
      <div>
        <p className="text-xs text-gray-600 uppercase tracking-wider mb-2 px-3 font-medium">
          Categories
        </p>
        <div className="flex flex-col gap-0.5">
          {CATEGORIES.map((cat) => {
            const isActive = location.pathname + location.search === cat.path;
            const count = cat.name === "All" ? total : (counts[cat.name] || 0);
            return (
              <Link
                key={cat.name}
                to={cat.path}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition ${
                  isActive
                    ? "bg-[#6C63FF]/10 text-[#6C63FF] font-medium"
                    : "text-gray-400 hover:bg-[#1a1a2e] hover:text-gray-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                </div>
                {count > 0 && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                    isActive
                      ? "bg-[#6C63FF]/20 text-[#6C63FF]"
                      : "bg-[#2a2a3e] text-gray-500"
                  }`}>
                    {count}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="border-t border-[#2a2a3e]" />

      <Link
        to="/create"
        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm bg-[#6C63FF] hover:bg-[#5b54e8] text-white transition font-medium"
      >
        <span>✏️</span>
        <span>Ask Question</span>
      </Link>

      <div className="border-t border-[#2a2a3e]" />

      {user ? (
        <div>
          <p className="text-xs text-gray-600 uppercase tracking-wider mb-2 px-3 font-medium">
            My Account
          </p>
          <div className="flex flex-col gap-0.5">
            <Link
              to={`/profile/${user.username}`}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:bg-[#1a1a2e] hover:text-gray-200 transition"
            >
              <span>👤</span>
              <span>{user.username}</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <Link to="/login" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:bg-[#1a1a2e] hover:text-gray-200 transition">
            <span>🔑</span><span>Login</span>
          </Link>
          <Link to="/register" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:bg-[#1a1a2e] hover:text-gray-200 transition">
            <span>📝</span><span>Sign Up</span>
          </Link>
        </div>
      )}

      <div className="border-t border-[#2a2a3e] mt-auto" />

      <div className="px-3 pb-2">
        <p className="text-xs text-gray-600 leading-relaxed">
          Real questions. Honest answers. 🌍
        </p>
      </div>

    </div>
  );
}
