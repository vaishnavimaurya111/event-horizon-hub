import { motion } from "framer-motion";
import { Calendar, Users, CheckCircle, TrendingUp, Plus, Shield, Trash2, Eye, EyeOff } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import CreateEventDialog from "@/components/CreateEventDialog";
import { format } from "date-fns";
import { toast } from "sonner";

const AdminDashboard = () => {
  const { user, loading: authLoading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [showCreate, setShowCreate] = useState(false);
  const [allEvents, setAllEvents] = useState<any[]>([]);
  const [allRegistrations, setAllRegistrations] = useState<any[]>([]);
  const [stats, setStats] = useState({ events: 0, users: 0, registrations: 0, checkedIn: 0 });

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) navigate("/dashboard");
  }, [user, authLoading, isAdmin, navigate]);

  const fetchData = async () => {
    if (!user) return;

    const { data: events } = await supabase
      .from("events")
      .select("*")
      .order("created_at", { ascending: false });
    setAllEvents(events || []);

    const { count: totalRegs } = await supabase
      .from("registrations")
      .select("*", { count: "exact", head: true });

    const { count: checkedIn } = await supabase
      .from("registrations")
      .select("*", { count: "exact", head: true })
      .eq("checked_in", true);

    const { data: regs } = await supabase
      .from("registrations")
      .select("*, events(title)")
      .order("created_at", { ascending: false })
      .limit(10);
    setAllRegistrations(regs || []);

    const { count: profileCount } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true });

    setStats({
      events: (events || []).length,
      users: profileCount || 0,
      registrations: totalRegs || 0,
      checkedIn: checkedIn || 0,
    });
  };

  useEffect(() => {
    if (user && isAdmin) fetchData();
  }, [user, isAdmin]);

  const togglePublish = async (eventId: string, currentState: boolean) => {
    const { error } = await supabase
      .from("events")
      .update({ is_published: !currentState })
      .eq("id", eventId);
    if (error) toast.error(error.message);
    else {
      toast.success(currentState ? "Event unpublished" : "Event published");
      fetchData();
    }
  };

  const deleteEvent = async (eventId: string) => {
    if (!confirm("Delete this event permanently?")) return;
    const { error } = await supabase.from("events").delete().eq("id", eventId);
    if (error) toast.error(error.message);
    else {
      toast.success("Event deleted");
      fetchData();
    }
  };

  if (authLoading) return <div className="min-h-screen bg-background flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" /></div>;
  if (!user || !isAdmin) return null;

  const statCards = [
    { icon: Calendar, label: "Total Events", value: stats.events, sub: "all time" },
    { icon: Users, label: "Total Users", value: stats.users, sub: "registered" },
    { icon: CheckCircle, label: "Registrations", value: stats.registrations, sub: "all events" },
    { icon: TrendingUp, label: "Check-ins", value: stats.checkedIn, sub: stats.registrations > 0 ? `${Math.round((stats.checkedIn / stats.registrations) * 100)}%` : "0%" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-12 container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-display font-bold flex items-center gap-3">
              <Shield className="w-7 h-7 text-primary" /> Admin Panel
            </motion.h1>
            <p className="text-muted-foreground">Manage all events, users, and registrations</p>
          </div>
          <button onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
            <Plus className="w-4 h-4" /> Create Event
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              className="p-5 rounded-2xl bg-card border border-border hover-lift">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <s.icon className="w-5 h-5 text-primary" />
                </div>
                <span className="text-xs text-muted-foreground">{s.sub}</span>
              </div>
              <div className="text-2xl font-display font-bold">{s.value}</div>
              <div className="text-sm text-muted-foreground">{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* All Events Table */}
        <div className="bg-card rounded-2xl border border-border p-6 mb-6">
          <h3 className="font-display font-semibold mb-4 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" /> All Events ({allEvents.length})
          </h3>
          {allEvents.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">No events yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-muted-foreground">
                    <th className="pb-3 font-medium">Event</th>
                    <th className="pb-3 font-medium">Category</th>
                    <th className="pb-3 font-medium">Date</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {allEvents.map((ev) => (
                    <tr key={ev.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-primary/10 flex-shrink-0">
                            {ev.image_url ? (
                              <img src={ev.image_url} alt={ev.title} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center"><Calendar className="w-4 h-4 text-primary" /></div>
                            )}
                          </div>
                          <span className="font-medium truncate max-w-[200px]">{ev.title}</span>
                        </div>
                      </td>
                      <td className="py-3 pr-4 text-muted-foreground">{ev.category}</td>
                      <td className="py-3 pr-4 text-muted-foreground">{format(new Date(ev.date), "MMM d, yyyy")}</td>
                      <td className="py-3 pr-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${ev.is_published ? "bg-green-500/10 text-green-600" : "bg-amber-500/10 text-amber-600"}`}>
                          {ev.is_published ? "Published" : "Draft"}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <div className="flex items-center gap-1 justify-end">
                          <button onClick={() => togglePublish(ev.id, ev.is_published)}
                            className="p-2 rounded-lg hover:bg-secondary transition-colors" title={ev.is_published ? "Unpublish" : "Publish"}>
                            {ev.is_published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                          <button onClick={() => deleteEvent(ev.id)}
                            className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors" title="Delete">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent Registrations */}
        <div className="bg-card rounded-2xl border border-border p-6">
          <h3 className="font-display font-semibold mb-4 flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" /> Recent Registrations
          </h3>
          {allRegistrations.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No registrations yet</p>
          ) : (
            <div className="space-y-3">
              {allRegistrations.map((r) => (
                <div key={r.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary/50 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                    R
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{r.events?.title || "Event"}</div>
                    <div className="text-xs text-muted-foreground">{format(new Date(r.created_at), "MMM d, yyyy · h:mm a")}</div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${r.checked_in ? "bg-green-500/10 text-green-600" : "bg-secondary text-muted-foreground"}`}>
                    {r.checked_in ? "Checked In" : "Registered"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
      <CreateEventDialog open={showCreate} onClose={() => setShowCreate(false)} onCreated={fetchData} />
    </div>
  );
};

export default AdminDashboard;
