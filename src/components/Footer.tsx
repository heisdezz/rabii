import { IconBrandGithub, IconVideo } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t fade">
      <div className="container mx-auto page-wrap py-10 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-8">
        {/* Brand */}
        <div className="flex flex-col items-center sm:items-start gap-2">
          <div className="flex items-center gap-2 font-bold text-lg">
            <IconVideo size={20} className="text-primary" />
            <span>Rabii</span>
          </div>
          <p className="text-xs text-base-content/40 max-w-48 text-center sm:text-left">
            A simple place to upload and watch videos.
          </p>
        </div>

        {/* Links */}
        <div className="flex gap-12 text-sm">
          <div className="flex flex-col gap-2">
            <p className="font-semibold text-xs uppercase tracking-widest text-base-content/40 mb-1">
              Navigate
            </p>
            <Link to="/app" className="text-base-content/70 hover:text-primary transition-colors">Home</Link>
            <Link to="/app/watch" className="text-base-content/70 hover:text-primary transition-colors">Watch</Link>
            <Link to="/app/upload" className="text-base-content/70 hover:text-primary transition-colors">Upload</Link>
            <Link to="/app/profile" className="text-base-content/70 hover:text-primary transition-colors">Profile</Link>
          </div>

          <div className="flex flex-col gap-2">
            <p className="font-semibold text-xs uppercase tracking-widest text-base-content/40 mb-1">
              Account
            </p>
            <Link to="/auth/login" className="text-base-content/70 hover:text-primary transition-colors">Login</Link>
            <Link to="/auth/sign-up" className="text-base-content/70 hover:text-primary transition-colors">Sign up</Link>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t fade">
        <div className="container mx-auto page-wrap py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-base-content/40">
          <p>&copy; {year} Rabii. All rights reserved.</p>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 hover:text-base-content transition-colors"
          >
            <IconBrandGithub size={14} />
            <span>GitHub</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
