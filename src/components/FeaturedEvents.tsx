import { motion } from "framer-motion";
import { Calendar, MapPin, Users, ArrowRight, Image } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

const gradients = [
  "from-primary to-accent",
  "from-accent to-gold",
  "from-gold to-primary",
  "from-primary to-coral-light",
];

const FeaturedEvents = () => {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("events")
        .select("*, registrations(count)")
        .eq("is_published", true)
        .order("date", { ascending: true })
        .limit(4);
      setEvents(data || []);
    };
    fetch();
  }, []);

  if (events.length === 0) return null;

  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-12">
          <div>
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-display font-bold"
            >
              Featured Events
            </motion.h2>
            <p className="text-muted-foreground mt-2">Discover trending events near you</p>
          </div>
          <Link to="/events" className="hidden md:flex items-center gap-1 text-primary text-sm font-medium hover:gap-2 transition-all">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {events.map((e, i) => {
            const attendees = e.registrations?.[0]?.count || 0;
            return (
              <motion.div
                key={e.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group bg-card rounded-2xl border border-border overflow-hidden hover-lift cursor-pointer"
              >
                <div className="h-32 relative overflow-hidden">
                  {e.image_url ? (
                    <img src={e.image_url} alt={e.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${gradients[i % gradients.length]} flex items-center justify-center`}>
                      <Image className="w-8 h-8 text-primary-foreground/40" />
                    </div>
                  )}
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-background/80 backdrop-blur text-xs font-medium">
                    {e.category}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-display font-bold text-lg mb-3 group-hover:text-primary transition-colors">
                    {e.title}
                  </h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5" />
                      {format(new Date(e.date), "MMM d, yyyy")}
                    </div>
                    {e.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5" />
                        {e.location}
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5" />
                      {attendees} registered
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturedEvents;
