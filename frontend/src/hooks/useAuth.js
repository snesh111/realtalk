cat > ~/Desktop/SolveIt/frontend/src/hooks/useAuth.js << 'EOF'
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import { logoutAPI } from "../api/auth.api";
import toast from "react-hot-toast";

const useAuth = () => {
  const { user, token, setAuth, clearAuth } = useAuthStore();
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await logoutAPI();
    } catch {}
    clearAuth();
    toast.success("Logged out!");
    navigate("/login");
  };

  const isAuthenticated = !!token;
  const isOwner = (resourceUserId) => user?._id === resourceUserId;

  return {
    user,
    token,
    isAuthenticated,
    isOwner,
    setAuth,
    logout,
  };
};

export default useAuth;
EOF