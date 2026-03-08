import { motion } from "framer-motion";
import { Calendar, MapPin, Users, Search, Filter } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState } from "react";

const allEvents = [
  { id: 1, title: "TechFest 2026", date: "Mar 15-17, 2026", location: "San Francisco, CA", attendees: 1200, category: "Technology", color: "from-primary to-accent" },
  { id: 2, title: "Design Summit", date: "Apr 5, 2026", location: "New York, NY", attendees: 450, category: "Design", color: "from-accent to-gold" },
  { id: 3, title: "Startup Weekend", date: "Apr 20-22, 2026", location: "Austin, TX", attendees: 300, category: "Business", color: "from-gold to-primary" },
  { id: 4, title: "AI Hackathon", date: "May 1-2, 2026", location: "Online", attendees: 800, category: "AI / ML", color: "from-primary to-coral-light" },
  { id: 5, title: "Music Festival", date: "May 10, 2026", location: "Nashville, TN", attendees: 5000, category: "Entertainment", color: "from-coral-light to-accent" },
  { id: 6, title: "Dev Conference", date: "Jun 1-3, 2026", location: "Seattle, WA", attendees: 2000, category: "Technology", color: "from-accent to-primary" },
  { id: 7, title: "Marketing Meetup", date: "Jun 15, 2026", location: "Chicago, IL", attendees: 200, category: "Business", color: "from-gold to-accent" },
  { id: 8, title: "Data Science Bootcamp", date: "Jul 5-7, 2026", location: "Online", attendees: 600, category: "AI / ML", color: "from-primary to-gold" },
];

const categories = ["All", "Technology", "Design", "Business", "AI / ML", "Entertainment"];

const Events = () => {
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("All");

  const filtered = allEvents.filter(
    (e) =>
      (cat === "All" || e.category === cat) &&
      e.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-12 container mx-auto px-4">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-display font-bold mb-2"
        >
          Explore Events
        </motion.h1>
        <p className="text-muted-foreground mb-8">Find and register for upcoming events</p>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search events..."
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-secondary border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  cat === c
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((e, i) => (
            <motion.div
              key={e.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group bg-card rounded-2xl border border-border overflow-hidden hover-lift cursor-pointer"
            >
              <div className={`h-36 bg-gradient-to-br ${e.color} relative`}>
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-background/80 backdrop-blur text-xs font-medium">
                  {e.category}
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-display font-bold text-lg mb-3 group-hover:text-primary transition-colors">{e.title}</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2"><Calendar className="w-3.5 h-3.5" />{e.date}</div>
                  <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5" />{e.location}</div>
                  <div className="flex items-center gap-2"><Users className="w-3.5 h-3.5" />{e.attendees} attendees</div>
                </div>
                <button className="mt-4 w-full py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
                  Register Now
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
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
