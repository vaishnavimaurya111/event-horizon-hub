import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, Calendar, MapPin, Users, Image } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const CATEGORIES = ["Technology", "Design", "Business", "AI / ML", "Entertainment", "Education", "Health", "Other"];

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

const CreateEventDialog = ({ open, onClose, onCreated }: Props) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Technology",
    date: "",
    end_date: "",
    location: "",
    venue_link: "",
    max_participants: "",
    is_published: true,
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    let image_url: string | null = null;

    if (imageFile) {
      const ext = imageFile.name.split(".").pop();
      const path = `${user.id}/${crypto.randomUUID()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("event-images")
        .upload(path, imageFile);
      if (uploadError) {
        toast.error("Failed to upload image");
        setLoading(false);
        return;
      }
      const { data: urlData } = supabase.storage
        .from("event-images")
        .getPublicUrl(path);
      image_url = urlData.publicUrl;
    }

    const { error } = await supabase.from("events").insert({
      created_by: user.id,
      title: form.title.trim(),
      description: form.description.trim() || null,
      category: form.category,
      date: new Date(form.date).toISOString(),
      end_date: form.end_date ? new Date(form.end_date).toISOString() : null,
      location: form.location.trim() || null,
      venue_link: form.venue_link.trim() || null,
      image_url,
      max_participants: form.max_participants ? parseInt(form.max_participants) : null,
      is_published: form.is_published,
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Event created!");
      onCreated();
      onClose();
      setForm({ title: "", description: "", category: "Technology", date: "", end_date: "", location: "", venue_link: "", max_participants: "", is_published: true });
      setImageFile(null);
      setImagePreview(null);
    }
    setLoading(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-foreground/40 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-card border border-border rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl"
          >
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-xl font-display font-bold">Create Event</h2>
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-secondary transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium mb-1.5">Event Image</label>
                <label className="block cursor-pointer">
                  {imagePreview ? (
                    <div className="relative rounded-xl overflow-hidden h-40">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-foreground/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <span className="text-sm font-medium text-primary-foreground bg-foreground/50 px-3 py-1 rounded-lg">Change</span>
                      </div>
                    </div>
                  ) : (
                    <div className="h-40 rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-primary/50 transition-colors">
                      <Image className="w-8 h-8" />
                      <span className="text-sm">Click to upload image</span>
                    </div>
                  )}
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Title *</label>
                <input type="text" required maxLength={200} value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                  placeholder="Event name" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Description</label>
                <textarea maxLength={2000} value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition resize-none h-24"
                  placeholder="What's this event about?" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Category *</label>
                  <select required value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition">
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Max Participants</label>
                  <input type="number" min={1} value={form.max_participants}
                    onChange={(e) => setForm({ ...form, max_participants: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                    placeholder="Unlimited" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Start Date *</label>
                  <input type="datetime-local" required value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">End Date</label>
                  <input type="datetime-local" value={form.end_date}
                    onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Location</label>
                <input type="text" maxLength={200} value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                  placeholder="Venue or 'Online'" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Venue / Meeting Link</label>
                <input type="url" value={form.venue_link}
                  onChange={(e) => setForm({ ...form, venue_link: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                  placeholder="https://..." />
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={form.is_published}
                  onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
                  className="w-4 h-4 rounded border-border text-primary focus:ring-primary" />
                <span className="text-sm font-medium">Publish immediately</span>
              </label>

              <button type="submit" disabled={loading}
                className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/25 disabled:opacity-50">
                {loading ? "Creating…" : "Create Event"}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CreateEventDialog;
