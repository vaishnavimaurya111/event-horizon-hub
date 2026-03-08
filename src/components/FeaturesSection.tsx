import { motion } from "framer-motion";
import { CalendarPlus, Users, Bell, BarChart3, Shield, Globe } from "lucide-react";

const features = [
  { icon: CalendarPlus, title: "Event Creation", desc: "Create and manage multiple events with custom schedules, venues, and virtual links." },
  { icon: Users, title: "Team Formation", desc: "Participants can create teams, invite members, and collaborate seamlessly." },
  { icon: Bell, title: "Smart Notifications", desc: "Send email, WhatsApp, and in-app announcements to keep everyone updated." },
  { icon: BarChart3, title: "Live Dashboards", desc: "Track registrations, check-ins, and engagement with real-time analytics." },
  { icon: Shield, title: "Secure Access", desc: "Role-based access for admins, organizers, and participants with JWT auth." },
  { icon: Globe, title: "Virtual & Hybrid", desc: "Support in-person, virtual, and hybrid events with integrated meeting links." },
];

const FeaturesSection = () => {
  return (
    <section className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-display font-bold mb-4"
          >
            Everything You Need
          </motion.h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Powerful tools to manage every aspect of your events, from planning to execution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="p-6 rounded-2xl bg-card border border-border hover-lift group"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <f.icon className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors" />
              </div>
              <h3 className="font-display font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
