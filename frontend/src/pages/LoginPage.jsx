import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginAPI } from "../api/auth.api";
import useAuthStore from "../store/authStore";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await loginAPI(form);
      setAuth(res.data.data.user, res.data.data.token);
      toast.success("Welcome back!");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16">
      <div className="bg-[#1a1a2e] border border-[#2a2a3e] rounded-2xl p-8">
        <h1 className="text-2xl font-bold text-gray-100 mb-2">Welcome back</h1>
        <p className="text-gray-500 text-sm mb-8">Login to RealTalk</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              className="w-full bg-[#0f0f17] border border-[#2a2a3e] rounded-lg px-4 py-2.5 text-sm text-gray-100 focus:outline-none focus:border-[#6C63FF] transition"
              placeholder="you@email.com"
              required
            />
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              className="w-full bg-[#0f0f17] border border-[#2a2a3e] rounded-lg px-4 py-2.5 text-sm text-gray-100 focus:outline-none focus:border-[#6C63FF] transition"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-[#6C63FF] hover:bg-[#5b54e8] disabled:opacity-50 text-white py-2.5 rounded-lg text-sm font-medium transition mt-2"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-6">
          Don't have an account?{" "}
          <Link to="/register" className="text-[#6C63FF] hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
