import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

/**
 * Dashboard route redirects based on role:
 * - Admin → /admin
 * - Participant → /participant
 */
const Dashboard = () => {
  const { user, loading, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate("/login", { replace: true });
    } else if (isAdmin) {
      navigate("/admin", { replace: true });
    } else {
      navigate("/participant", { replace: true });
    }
  }, [user, loading, isAdmin, navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
    </div>
  );
};

export default Dashboard;
