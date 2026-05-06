import { useState } from "react";
import { castVoteAPI } from "../api/vote.api";
import useAuthStore from "../store/authStore";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function VoteButton({ targetId, targetType, initialCount }) {
  const [count, setCount] = useState(initialCount || 0);
  const [voted, setVoted] = useState(null);
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const handleVote = async (type) => {
    if (!user) {
      toast.error("Login to vote!");
      navigate("/login");
      return;
    }
    try {
      const res = await castVoteAPI({ targetId, targetType, type });
      setCount(res.data.data.newVoteCount);
      setVoted(res.data.data.action === "removed" ? null : type);
      toast.success(
        res.data.data.action === "removed" ? "Vote removed" :
        res.data.data.action === "switched" ? "Vote switched" : "Voted!"
      );
    } catch (err) {
      toast.error(err.response?.data?.message || "Vote failed");
    }
  };

  return (
    <div className="flex flex-col items-center gap-1">
      <button
        onClick={() => handleVote("upvote")}
        className={`text-lg transition ${
          voted === "upvote"
            ? "text-[#6C63FF]"
            : "text-gray-500 hover:text-[#6C63FF]"
        }`}
      >
        ▲
      </button>
      <span className={`text-sm font-semibold ${
        voted ? "text-[#6C63FF]" : "text-gray-300"
      }`}>
        {count}
      </span>
      <button
        onClick={() => handleVote("downvote")}
        className={`text-lg transition ${
          voted === "downvote"
            ? "text-red-400"
            : "text-gray-500 hover:text-red-400"
        }`}
      >
        ▼
      </button>
    </div>
  );
}
