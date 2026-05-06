import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getUserProfileAPI } from "../api/user.api";
import PostCard from "../components/PostCard";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getUserProfileAPI(username);
        setProfile(res.data.data);
      } catch {
        toast.error("Profile not found");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [username]);

  if (loading) return (
    <div className="space-y-4">
      <div className="bg-[#1a1a2e] rounded-xl h-24 animate-pulse" />
    </div>
  );

  if (!profile) return <p className="text-gray-500 text-center mt-20">User not found</p>;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-[#1a1a2e] border border-[#2a2a3e] rounded-2xl p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-2xl font-bold text-orange-400">
            {profile.username[0].toUpperCase()}
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-100">{profile.username}</h1>
            <p className="text-sm text-gray-500">
              Member since {new Date(profile.createdAt).toLocaleDateString()}
            </p>
          </div>
          {profile.role === "admin" && (
            <span className="ml-auto text-xs bg-orange-500/10 text-orange-400 border border-orange-500/20 px-2 py-0.5 rounded-full">
              Admin
            </span>
          )}
        </div>
        <div className="flex gap-6 mt-4 pt-4 border-t border-[#2a2a3e]">
          <div className="text-center">
            <p className="text-xl font-bold text-gray-100">{profile.totalPosts}</p>
            <p className="text-xs text-gray-500">Questions</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-gray-100">{profile.totalComments}</p>
            <p className="text-xs text-gray-500">Answers</p>
          </div>
        </div>
      </div>

      <h2 className="text-lg font-semibold text-gray-100 mb-4">Questions Asked</h2>
      {profile.posts.length === 0 ? (
        <p className="text-gray-500 text-center py-10">No questions yet</p>
      ) : (
        <div className="flex flex-col gap-3">
          {profile.posts.map(post => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
