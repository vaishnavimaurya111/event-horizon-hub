import { Calendar, Github, Twitter, Linkedin, Mail, Heart } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const sections = [
    {
      title: "Product",
      links: [
        { label: "Features", to: "/" },
        { label: "Events", to: "/events" },
        { label: "Dashboard", to: "/dashboard" },
        { label: "Pricing", to: "/" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About", to: "/" },
        { label: "Careers", to: "/" },
        { label: "Blog", to: "/" },
        { label: "Contact", to: "/" },
      ],
    },
    {
      title: "Support",
      links: [
        { label: "Help Center", to: "/" },
        { label: "API Docs", to: "/" },
        { label: "Status", to: "/" },
        { label: "Privacy Policy", to: "/" },
      ],
    },
  ];

  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
                <Calendar className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-display font-bold text-gradient">Manageve</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mb-6">
              The modern platform for managing events, teams, and experiences. From small meetups to large conferences.
            </p>
            <div className="flex gap-3">
              {[Github, Twitter, Linkedin, Mail].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {sections.map((s) => (
            <div key={s.title}>
              <h4 className="font-display font-semibold text-sm mb-4">{s.title}</h4>
              <ul className="space-y-2.5">
                {s.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      to={l.to}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © 2026 Manageve. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-primary fill-primary" /> for event organizers
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
