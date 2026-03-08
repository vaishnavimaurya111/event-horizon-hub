import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Users, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
            
            <Sparkles className="w-4 h-4" />
            Multi-Event Management Reimagined
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="text-4xl md:text-6xl lg:text-7xl font-display font-black leading-tight mb-6">
            
            Manage Events
            <br />
            <span className="text-gradient text-primary">Like Never Before</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-lg text-muted-foreground max-w-xl mx-auto mb-10">
            
            Create events, manage registrations, form teams, and keep everyone notified — all from one beautiful platform.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 }}
            className="flex flex-col sm:flex-row gap-4 justify-center">
            
            <Link
              to="/signup"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/25">
              
              Get Started Free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/events"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-secondary text-secondary-foreground font-semibold hover:bg-secondary/80 transition-colors">
              
              Browse Events
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="mt-20 grid grid-cols-3 gap-6">
            
            {[
            { icon: Users, value: "50K+", label: "Participants" },
            { icon: Zap, value: "2.5K", label: "Events Hosted" },
            { icon: Sparkles, value: "99%", label: "Satisfaction" }].
            map((s, i) =>
            <div key={i} className="text-center">
                <s.icon className="w-5 h-5 text-primary mx-auto mb-2" />
                <div className="text-2xl md:text-3xl font-display font-bold">{s.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>);

};

export default HeroSection;