const CATEGORIES = ["All", "Career", "Tech", "College", "Life", "Finance"];

export default function CategoryFilter({ active, onChange }) {
  return (
    <div className="flex gap-2 flex-wrap">
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition border ${
            active === cat
              ? "bg-orange-500 text-white border-orange-500"
              : "bg-[#1a1a2e] text-gray-400 border-[#2a2a3e] hover:border-orange-500 hover:text-orange-400"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
