import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <p className="text-8xl mb-6">🤔</p>
      <h1 className="text-4xl font-bold text-gray-100 mb-2">404</h1>
      <p className="text-xl text-gray-400 mb-2">Page not found</p>
      <p className="text-sm text-gray-600 mb-8 max-w-md">
        The page you're looking for doesn't exist or has been removed.
      </p>
      <div className="flex gap-3">
        <Link
          to="/"
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition"
        >
          Go Home
        </Link>
        <Link
          to="/create"
          className="bg-[#1a1a2e] hover:bg-[#2a2a3e] text-gray-300 border border-[#2a2a3e] px-6 py-2.5 rounded-lg text-sm font-medium transition"
        >
          Ask Question
        </Link>
      </div>
    </div>
  );
}
