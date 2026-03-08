import { motion } from "framer-motion";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";

const Signup = () => {
  const { signUp } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<"participant" | "admin">("participant");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error } = await signUp(form.email, form.password, form.name);
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50/30 to-blue-50/40 dark:from-background dark:via-background dark:to-background">
      <Navbar />
      <div className="flex items-center justify-center px-4 pt-28 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md bg-card rounded-2xl shadow-xl border border-border p-8"
        >
          {/* Logo */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-display font-black">
              <span className="text-gradient">Manag</span>
              <span className="text-foreground">eve</span>
            </h1>
          </div>

          <h2 className="text-xl font-display font-bold text-center mb-1">Create your account</h2>
          <p className="text-muted-foreground text-sm text-center mb-6">
            Join thousands of event enthusiasts
          </p>

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 p-3 rounded-lg bg-primary/10 text-primary text-sm font-medium text-center"
            >
              ✨ Account created! Check your email to confirm your account.
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 p-3 rounded-lg bg-destructive/10 text-destructive text-sm font-medium text-center"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium mb-1.5">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-secondary/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                  placeholder="John Doe"
                  maxLength={100}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-secondary/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                  placeholder="you@example.com"
                  maxLength={255}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full pl-10 pr-12 py-3 rounded-xl bg-secondary/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                  placeholder="••••••••"
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Role Selector */}
            <div>
              <label className="block text-sm font-medium mb-2">I want to join as:</label>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => setRole("participant")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left text-sm transition-all ${
                    role === "participant"
                      ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                      : "border-border bg-secondary/30 hover:bg-secondary/60"
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      role === "participant" ? "border-primary" : "border-muted-foreground/40"
                    }`}
                  >
                    {role === "participant" && (
                      <span className="w-2 h-2 rounded-full bg-primary" />
                    )}
                  </span>
                  <div>
                    <span className={`font-semibold ${role === "participant" ? "text-primary" : "text-foreground"}`}>
                      Participant
                    </span>
                    <span className="text-muted-foreground ml-2">Register for events and join teams</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setRole("admin")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left text-sm transition-all ${
                    role === "admin"
                      ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                      : "border-border bg-secondary/30 hover:bg-secondary/60"
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      role === "admin" ? "border-primary" : "border-muted-foreground/40"
                    }`}
                  >
                    {role === "admin" && (
                      <span className="w-2 h-2 rounded-full bg-primary" />
                    )}
                  </span>
                  <div>
                    <span className={`font-semibold ${role === "admin" ? "text-primary" : "text-foreground"}`}>
                      Admin / Organizer
                    </span>
                    <span className="text-muted-foreground ml-2">Create and manage events</span>
                  </div>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || success}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold text-sm hover:opacity-90 transition-all hover:shadow-lg hover:shadow-primary/25 disabled:opacity-50"
            >
              {loading ? "Creating account…" : "Create Account"}
            </button>
          </form>

          <p className="text-sm text-muted-foreground text-center mt-5">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;
