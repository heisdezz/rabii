import { createFileRoute, Link } from "@tanstack/react-router";
import HeroSearchBar from "#/components/HeroSearchBar";
import MainNavbar from "#/components/NavBar";
import {
  IconUpload,
  IconDeviceTv,
  IconUsers,
  IconPlayerPlay,
} from "@tabler/icons-react";

export const Route = createFileRoute("/")({
  component: HomePage,
});

const features = [
  {
    icon: IconUpload,
    title: "Upload & Share",
    description:
      "Upload your videos in any format and share them with the world instantly.",
  },
  {
    icon: IconDeviceTv,
    title: "Watch Anywhere",
    description: "Stream videos seamlessly on any device, anytime you want.",
  },
  {
    icon: IconUsers,
    title: "Build a Following",
    description:
      "Grow your audience, get discovered, and connect with viewers who love your content.",
  },
];

function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <MainNavbar />

      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center px-4 relative isolate py-24 gap-8 min-h-[768px]">
        <img
          src="/wall2.avif"
          className="brightness-20 absolute inset-0 w-full -z-10 h-full object-cover blur-sm grayscale-50"
          alt=""
        />
        <div className="space-y-4 max-w-2xl">
          <div className="badge badge-primary badge-outline badge-sm tracking-widest uppercase font-semibold">
            Video Platform
          </div>
          <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight tracking-tight">
            Your videos, <span className="text-primary">your stage.</span>
          </h1>
          <p className="text-base-content/60 text-lg max-w-xl mx-auto">
            Discover, upload, and share videos that matter. A simple platform
            built for creators and viewers alike.
          </p>
        </div>

        <div className="w-full max-w-2xl px-4">
          <HeroSearchBar />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link to="/app" className="btn btn-primary btn-lg rounded-full px-8">
            <IconPlayerPlay size={18} />
            Browse videos
          </Link>
          <Link
            to="/auth/sign-up"
            className="btn btn-ghost btn-lg rounded-full px-8"
          >
            Get started free
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4 bg-base-200/50">
        <div className="container mx-auto max-w-5xl space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-bold">Everything you need</h2>
            <p className="text-base-content/50 max-w-md mx-auto">
              Rabii is a straightforward video platform — no algorithm games, no
              clutter. Just your content and your audience.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="card bg-base-200 ring fade shadow hover:ring-primary/30 transition-all"
              >
                <div className="card-body gap-4">
                  <div className="w-10 h-10 rounded-sleek bg-primary/10 flex items-center justify-center text-primary">
                    <Icon size={20} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-base">{title}</h3>
                    <p className="text-sm text-base-content/50 mt-1">
                      {description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-xl mx-auto space-y-6">
          <h2 className="text-3xl font-bold">Ready to share your story?</h2>
          <p className="text-base-content/50">
            Join Rabii and start uploading your videos today. It's free.
          </p>
          <Link
            to="/auth/sign-up"
            className="btn btn-primary btn-lg rounded-full px-10"
          >
            Create an account
          </Link>
        </div>
      </section>

      <footer className="py-6 text-center text-xs text-base-content/30 border-t border-base-content/10">
        © {new Date().getFullYear()} Rabii. All rights reserved.
      </footer>
    </div>
  );
}
