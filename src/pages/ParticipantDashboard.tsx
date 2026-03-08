import { motion } from "framer-motion";
import { Calendar, Users, Clock, MapPin, XCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { toast } from "sonner";

const ParticipantDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [myRegistrations, setMyRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) navigate("/login");
  }, [user, authLoading, navigate]);

  const fetchRegistrations = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("registrations")
      .select("*, events(*)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    setMyRegistrations(data || []);
    setLoading(false);
  };

  useEffect(() => {
    if (user) fetchRegistrations();
  }, [user]);

  const cancelRegistration = async (regId: string) => {
    if (!confirm("Cancel this registration?")) return;
    const { error } = await supabase.from("registrations").delete().eq("id", regId);
    if (error) toast.error(error.message);
    else {
      toast.success("Registration cancelled");
      fetchRegistrations();
    }
  };

  if (authLoading) return <div className="min-h-screen bg-background flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" /></div>;
  if (!user) return null;

  const upcoming = myRegistrations.filter(r => r.events && new Date(r.events.date) >= new Date());
  const past = myRegistrations.filter(r => r.events && new Date(r.events.date) < new Date());

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-12 container mx-auto px-4">
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-display font-bold mb-1">
          My Dashboard
        </motion.h1>
        <p className="text-muted-foreground mb-8">Welcome back, {user.user_metadata?.full_name || "participant"}!</p>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            { icon: Calendar, label: "Registered Events", value: myRegistrations.length },
            { icon: Clock, label: "Upcoming", value: upcoming.length },
            { icon: Users, label: "Attended", value: myRegistrations.filter(r => r.checked_in).length },
          ].map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              className="p-5 rounded-2xl bg-card border border-border hover-lift">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                <s.icon className="w-5 h-5 text-primary" />
              </div>
              <div className="text-2xl font-display font-bold">{s.value}</div>
              <div className="text-sm text-muted-foreground">{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Upcoming Events */}
        <div className="bg-card rounded-2xl border border-border p-6 mb-6">
          <h3 className="font-display font-semibold mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" /> Upcoming Events ({upcoming.length})
          </h3>
          {loading ? (
            <div className="flex justify-center py-8"><div className="animate-spin w-6 h-6 border-3 border-primary border-t-transparent rounded-full" /></div>
          ) : upcoming.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p className="mb-3">No upcoming events.</p>
              <button onClick={() => navigate("/events")} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
                Browse Events
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {upcoming.map((r) => (
                <motion.div key={r.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-4 p-4 rounded-xl hover:bg-secondary/50 transition-colors">
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-primary/10 flex-shrink-0">
                    {r.events?.image_url ? (
                      <img src={r.events.image_url} alt={r.events.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center"><Calendar className="w-6 h-6 text-primary" /></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{r.events?.title}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-3 mt-1">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{format(new Date(r.events.date), "MMM d, yyyy")}</span>
                      {r.events?.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{r.events.location}</span>}
                    </div>
                  </div>
                  <button onClick={() => cancelRegistration(r.id)}
                    className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors" title="Cancel registration">
                    <XCircle className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Past Events */}
        {past.length > 0 && (
          <div className="bg-card rounded-2xl border border-border p-6">
            <h3 className="font-display font-semibold mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" /> Past Events ({past.length})
            </h3>
            <div className="space-y-3">
              {past.map((r) => (
                <div key={r.id} className="flex items-center gap-4 p-4 rounded-xl opacity-70">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-secondary flex-shrink-0">
                    {r.events?.image_url ? (
                      <img src={r.events.image_url} alt={r.events.title} className="w-full h-full object-cover grayscale" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center"><Calendar className="w-5 h-5 text-muted-foreground" /></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{r.events?.title}</div>
                    <div className="text-xs text-muted-foreground">{format(new Date(r.events.date), "MMM d, yyyy")}</div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${r.checked_in ? "bg-green-500/10 text-green-600" : "bg-secondary text-muted-foreground"}`}>
                    {r.checked_in ? "Attended" : "Missed"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ParticipantDashboard;
