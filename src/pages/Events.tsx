import { motion } from "framer-motion";
import { Calendar, MapPin, Users, Search, Filter, Image } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { toast } from "sonner";

const categories = ["All", "Technology", "Design", "Business", "AI / ML", "Entertainment", "Education", "Health", "Other"];

const gradients = [
  "from-primary to-accent",
  "from-accent to-gold",
  "from-gold to-primary",
  "from-primary to-coral-light",
  "from-coral-light to-accent",
  "from-accent to-primary",
  "from-gold to-accent",
  "from-primary to-gold",
];

const Events = () => {
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("All");
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [myRegistrations, setMyRegistrations] = useState<string[]>([]);
  const [registering, setRegistering] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      const { data } = await supabase
        .from("events")
        .select("*, registrations(count)")
        .eq("is_published", true)
        .order("date", { ascending: true });
      setEvents(data || []);
      setLoading(false);
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    const fetchMyRegs = async () => {
      if (!user) return;
      const { data } = await supabase
        .from("registrations")
        .select("event_id")
        .eq("user_id", user.id);
      setMyRegistrations((data || []).map((r) => r.event_id));
    };
    fetchMyRegs();
  }, [user]);

  const handleRegister = async (eventId: string) => {
    if (!user) {
      navigate("/login");
      return;
    }
    setRegistering(eventId);
    const { error } = await supabase
      .from("registrations")
      .insert({ event_id: eventId, user_id: user.id });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Registered successfully!");
      setMyRegistrations((prev) => [...prev, eventId]);
    }
    setRegistering(null);
  };

  const filtered = events.filter(
    (e) =>
      (cat === "All" || e.category === cat) &&
      e.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-12 container mx-auto px-4">
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-display font-bold mb-2">
          Explore Events
        </motion.h1>
        <p className="text-muted-foreground mb-8">Find and register for upcoming events</p>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search events..."
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-secondary border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map((c) => (
              <button key={c} onClick={() => setCat(c)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  cat === c ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}>
                {c}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((e, i) => {
              const attendees = e.registrations?.[0]?.count || 0;
              const isRegistered = myRegistrations.includes(e.id);
              return (
                <motion.div key={e.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group bg-card rounded-2xl border border-border overflow-hidden hover-lift cursor-pointer">
                  <div className="h-40 relative overflow-hidden">
                    {e.image_url ? (
                      <img src={e.image_url} alt={e.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className={`w-full h-full bg-gradient-to-br ${gradients[i % gradients.length]} flex items-center justify-center`}>
                        <Image className="w-10 h-10 text-primary-foreground/40" />
                      </div>
                    )}
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-background/80 backdrop-blur text-xs font-medium">
                      {e.category}
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-display font-bold text-lg mb-3 group-hover:text-primary transition-colors">{e.title}</h3>
                    {e.description && (
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{e.description}</p>
                    )}
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2"><Calendar className="w-3.5 h-3.5" />{format(new Date(e.date), "MMM d, yyyy")}{e.end_date && ` – ${format(new Date(e.end_date), "MMM d")}`}</div>
                      {e.location && <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5" />{e.location}</div>}
                      <div className="flex items-center gap-2"><Users className="w-3.5 h-3.5" />{attendees}{e.max_participants ? ` / ${e.max_participants}` : ""} registered</div>
                    </div>
                    <button
                      onClick={() => !isRegistered && handleRegister(e.id)}
                      disabled={isRegistered || registering === e.id}
                      className={`mt-4 w-full py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        isRegistered
                          ? "bg-secondary text-muted-foreground cursor-default"
                          : "bg-primary text-primary-foreground hover:bg-primary/90"
                      } disabled:opacity-60`}
                    >
                      {registering === e.id ? "Registering..." : isRegistered ? "✓ Registered" : "Register Now"}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            <Filter className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p>No events found. Try adjusting your filters.</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Events;
