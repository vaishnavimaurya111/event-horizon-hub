import { motion } from "framer-motion";
import { Calendar, Users, Bell, CheckCircle, Clock, TrendingUp, Plus, Send } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState } from "react";

const recentRegistrations = [
  { name: "Sarah Johnson", event: "TechFest 2026", time: "2 min ago", avatar: "SJ" },
  { name: "Mike Chen", event: "AI Hackathon", time: "15 min ago", avatar: "MC" },
  { name: "Aisha Patel", event: "Design Summit", time: "1 hr ago", avatar: "AP" },
  { name: "David Kim", event: "TechFest 2026", time: "2 hrs ago", avatar: "DK" },
  { name: "Lena Rivera", event: "Startup Weekend", time: "3 hrs ago", avatar: "LR" },
];

const notifications = [
  { text: "TechFest 2026 registration deadline in 3 days", type: "warning" },
  { text: "New team 'Code Warriors' created for AI Hackathon", type: "info" },
  { text: "WhatsApp reminder sent to 450 participants", type: "success" },
  { text: "Check-in opened for Design Summit", type: "info" },
];

const Dashboard = () => {
  const [notifMessage, setNotifMessage] = useState("");

  const stats = [
    { icon: Calendar, label: "Active Events", value: "8", change: "+2 this week" },
    { icon: Users, label: "Total Registrations", value: "3,247", change: "+128 today" },
    { icon: CheckCircle, label: "Checked In", value: "1,892", change: "58% rate" },
    { icon: Bell, label: "Notifications Sent", value: "12.4K", change: "+340 today" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-12 container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-display font-bold"
            >
              Dashboard
            </motion.h1>
            <p className="text-muted-foreground">Welcome back, Admin</p>
          </div>
          <button className="hidden md:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
            <Plus className="w-4 h-4" /> Create Event
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="p-5 rounded-2xl bg-card border border-border hover-lift"
            >
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
          {/* Recent registrations */}
          <div className="lg:col-span-2 bg-card rounded-2xl border border-border p-6">
            <h3 className="font-display font-semibold mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" /> Recent Registrations
            </h3>
            <div className="space-y-3">
              {recentRegistrations.map((r, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary/50 transition-colors"
                >
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                    {r.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{r.name}</div>
                    <div className="text-xs text-muted-foreground">{r.event}</div>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{r.time}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Notifications & Send */}
          <div className="space-y-6">
            <div className="bg-card rounded-2xl border border-border p-6">
              <h3 className="font-display font-semibold mb-4 flex items-center gap-2">
                <Bell className="w-4 h-4 text-primary" /> Notifications
              </h3>
              <div className="space-y-3">
                {notifications.map((n, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <div
                      className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                        n.type === "warning"
                          ? "bg-amber"
                          : n.type === "success"
                          ? "bg-green-500"
                          : "bg-primary"
                      }`}
                    />
                    <span className="text-muted-foreground">{n.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card rounded-2xl border border-border p-6">
              <h3 className="font-display font-semibold mb-4 flex items-center gap-2">
                <Send className="w-4 h-4 text-primary" /> Send Notification
              </h3>
              <textarea
                value={notifMessage}
                onChange={(e) => setNotifMessage(e.target.value)}
                placeholder="Type your announcement..."
                className="w-full p-3 rounded-xl bg-secondary border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition resize-none h-24 mb-3"
              />
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
    </div>
  );
};

export default Dashboard;
