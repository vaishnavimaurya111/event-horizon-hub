import { motion } from "framer-motion";
import { Calendar, MapPin, Users, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const events = [
  {
    id: 1,
    title: "TechFest 2026",
    date: "Mar 15-17, 2026",
    location: "San Francisco, CA",
    attendees: 1200,
    category: "Technology",
    color: "from-primary to-accent",
  },
  {
    id: 2,
    title: "Design Summit",
    date: "Apr 5, 2026",
    location: "New York, NY",
    attendees: 450,
    category: "Design",
    color: "from-accent to-gold",
  },
  {
    id: 3,
    title: "Startup Weekend",
    date: "Apr 20-22, 2026",
    location: "Austin, TX",
    attendees: 300,
    category: "Business",
    color: "from-gold to-primary",
  },
  {
    id: 4,
    title: "AI Hackathon",
    date: "May 1-2, 2026",
    location: "Online",
    attendees: 800,
    category: "AI / ML",
    color: "from-primary to-coral-light",
  },
];

const FeaturedEvents = () => {
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
          {events.map((e, i) => (
            <Link to="/events" key={e.id}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group bg-card rounded-2xl border border-border overflow-hidden hover-lift cursor-pointer"
              >
                <div className={`h-32 bg-gradient-to-br ${e.color} relative`}>
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
                      {e.date}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5" />
                      {e.location}
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5" />
                      {e.attendees} attendees
                    </div>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedEvents;
