import { motion } from "framer-motion";
import { Calendar, Users, Bell, CheckCircle, Clock, TrendingUp, Plus, Send } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import CreateEventDialog from "@/components/CreateEventDialog";
import { format } from "date-fns";

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [notifMessage, setNotifMessage] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [myEvents, setMyEvents] = useState<any[]>([]);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [statsData, setStatsData] = useState({ events: 0, registrations: 0, checkedIn: 0 });

  useEffect(() => {
    if (!authLoading && !user) navigate("/login");
  }, [user, authLoading, navigate]);

  const fetchData = async () => {
    if (!user) return;
    const { data: events } = await supabase
      .from("events")
      .select("*")
      .eq("created_by", user.id)
      .order("created_at", { ascending: false });
    setMyEvents(events || []);

    const eventIds = (events || []).map(e => e.id);
    if (eventIds.length > 0) {
      const { data: regs } = await supabase
        .from("registrations")
        .select("*, events(title)")
        .in("event_id", eventIds)
        .order("created_at", { ascending: false })
        .limit(10);
      setRegistrations(regs || []);
      
      const { count: totalRegs } = await supabase
        .from("registrations")
        .select("*", { count: "exact", head: true })
        .in("event_id", eventIds);
      const { count: checkedIn } = await supabase
        .from("registrations")
        .select("*", { count: "exact", head: true })
        .in("event_id", eventIds)
        .eq("checked_in", true);
      setStatsData({ events: (events || []).length, registrations: totalRegs || 0, checkedIn: checkedIn || 0 });
    } else {
      setStatsData({ events: 0, registrations: 0, checkedIn: 0 });
    }
  };

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  const stats = [
    { icon: Calendar, label: "My Events", value: String(statsData.events), change: "active" },
    { icon: Users, label: "Total Registrations", value: String(statsData.registrations), change: "all events" },
    { icon: CheckCircle, label: "Checked In", value: String(statsData.checkedIn), change: statsData.registrations > 0 ? `${Math.round((statsData.checkedIn / statsData.registrations) * 100)}%` : "0%" },
    { icon: Bell, label: "Notifications Sent", value: "—", change: "coming soon" },
  ];

  if (authLoading) return <div className="min-h-screen bg-background flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" /></div>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-12 container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-display font-bold">
              Dashboard
            </motion.h1>
            <p className="text-muted-foreground">Welcome back!</p>
          </div>
          <button onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
            <Plus className="w-4 h-4" /> Create Event
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              className="p-5 rounded-2xl bg-card border border-border hover-lift">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <s.icon className="w-5 h-5 text-primary" />
                </div>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> {s.change}
                </span>
              </div>
              <div className="text-2xl font-display font-bold">{s.value}</div>
              <div className="text-sm text-muted-foreground">{s.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* My Events */}
          <div className="lg:col-span-2 bg-card rounded-2xl border border-border p-6">
            <h3 className="font-display font-semibold mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" /> My Events
            </h3>
            {myEvents.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">No events yet. Create your first event!</p>
            ) : (
              <div className="space-y-3">
                {myEvents.slice(0, 6).map((ev, i) => (
                  <motion.div key={ev.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.05 }}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary/50 transition-colors">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-primary/10 flex-shrink-0">
                      {ev.image_url ? (
                        <img src={ev.image_url} alt={ev.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center"><Calendar className="w-5 h-5 text-primary" /></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{ev.title}</div>
                      <div className="text-xs text-muted-foreground">{format(new Date(ev.date), "MMM d, yyyy")} · {ev.category}</div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${ev.is_published ? "bg-green-500/10 text-green-600" : "bg-amber/10 text-amber"}`}>
                      {ev.is_published ? "Published" : "Draft"}
                    </span>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Registrations & Notifications */}
          <div className="space-y-6">
            <div className="bg-card rounded-2xl border border-border p-6">
              <h3 className="font-display font-semibold mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" /> Recent Registrations
              </h3>
              {registrations.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No registrations yet</p>
              ) : (
                <div className="space-y-3">
                  {registrations.slice(0, 5).map((r) => (
                    <div key={r.id} className="flex items-center gap-2 text-sm">
                      <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                        R
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{r.events?.title || "Event"}</div>
                        <div className="text-xs text-muted-foreground">Registered</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-card rounded-2xl border border-border p-6">
              <h3 className="font-display font-semibold mb-4 flex items-center gap-2">
                <Send className="w-4 h-4 text-primary" /> Send Notification
              </h3>
              <textarea value={notifMessage} onChange={(e) => setNotifMessage(e.target.value)}
                placeholder="Type your announcement..."
                className="w-full p-3 rounded-xl bg-secondary border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition resize-none h-24 mb-3" />
              <div className="flex gap-2">
                <button className="flex-1 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors">
                  📧 Email
                </button>
                <button className="flex-1 py-2 rounded-lg bg-green-600 text-primary-foreground text-xs font-medium hover:bg-green-700 transition-colors">
                  💬 WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <CreateEventDialog open={showCreate} onClose={() => setShowCreate(false)} onCreated={fetchData} />
    </div>
  );
};

export default Dashboard;
