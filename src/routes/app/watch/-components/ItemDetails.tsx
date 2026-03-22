import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { get_fiel_url } from "#/helpers/client";
import { IconUser, IconClock, IconDeviceTv } from "@tabler/icons-react";
import { ClientOnly, Link } from "@tanstack/react-router";
import type { VideoWithUser } from "../$videoid";
import BookmarkButton from "./BookmarkButton";
import LikeDislike from "#/components/LikeDislike";

function formatDuration(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0)
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function ItemDetails({ resp }: { resp: VideoWithUser }) {
  const thumbUrl = resp.thumbnail ? get_fiel_url(resp, resp.thumbnail) : null;
  const blurUrl = thumbUrl ?? "/dummy.jpg";
  const [expanded, setExpanded] = useState(false);

  //@ts-ignore
  const user = resp.expand?.user;
  const avatarUrl = user?.avatar ? get_fiel_url(user, user.avatar) : null;
  //@ts-ignore
  const tags: { id: string; name: string }[] = resp.expand?.tags ?? [];

  return (
    <div className="ring fade rounded-sleek overflow-clip flex flex-col sm:flex-row items-start">
      {/* Poster panel */}
      <div className="w-full sm:w-auto sm:max-w-3xs sm:shrink-0 sm:self-start relative isolate flex items-center justify-center overflow-clip aspect-video sm:aspect-9/16">
        <img
          src={blurUrl}
          alt=""
          className="absolute inset-0 h-full w-full object-cover -z-10 blur-md brightness-40"
        />
        <img
          src={blurUrl}
          alt={resp.title}
          className="h-4/5 sm:w-4/5 sm:h-auto aspect-9/16 z-10 shadow-2xl rounded-sleek object-cover"
        />
      </div>

      {/* Details */}
      <div className="p-4 sm:p-6 space-y-4 flex-1 min-w-0">
        {/* Title + actions */}
        <div className="flex items-start justify-between gap-3">
          <h2 className="font-bold text-xl sm:text-2xl leading-snug">
            {resp.title || "Untitled"}
          </h2>
          <div className="flex items-center gap-1.5 shrink-0">
            <ClientOnly>
              <LikeDislike video={resp} />
            </ClientOnly>
            <ClientOnly>
              <BookmarkButton id={resp.id} />
            </ClientOnly>
          </div>
        </div>

        {/* Meta chips */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-base-content/50">
          <span>
            {new Date(resp.created).toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
          {resp.duration ? (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-base-300 text-base-content/60">
              <IconClock size={11} />
              {formatDuration(resp.duration)}
            </span>
          ) : null}
          {resp.resolution ? (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
              <IconDeviceTv size={11} />
              {resp.resolution}
            </span>
          ) : null}
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span
                key={tag.id}
                className="inline-flex items-center text-xs px-2.5 py-1 rounded-full bg-secondary/10 text-secondary border border-secondary/20 font-medium"
              >
                #{tag.name}
              </span>
            ))}
          </div>
        )}

        {/* Owner */}
        {user && (
          <Link
            to="/app/actor/$actorId"
            params={{ actorId: user.id }}
            className="flex items-center gap-2.5 w-fit group"
          >
            <div className="w-8 h-8 rounded-full bg-base-300 overflow-hidden ring-1 ring-base-content/10 shrink-0 flex items-center justify-center group-hover:ring-primary/40 transition-all">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <IconUser size={15} className="text-base-content/40" />
              )}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold leading-tight truncate group-hover:text-primary transition-colors">
                {user.name || "Unknown"}
              </p>
              <p className="text-xs text-base-content/40 leading-tight">Creator</p>
            </div>
          </Link>
        )}

        {/* Description */}
        {resp.description ? (
          <div className="space-y-1 border-t fade pt-4">
            <div
              className={`prose prose-sm prose-invert max-w-none opacity-75 overflow-hidden transition-[max-height] duration-500 ease-in-out ${
                expanded ? "max-h-[2000px]" : "max-h-48"
              }`}
            >
              <ReactMarkdown>{resp.description}</ReactMarkdown>
            </div>
            <div
              className={`-mt-6 h-8 bg-gradient-to-t from-base-100/80 to-transparent pointer-events-none transition-opacity duration-300 ${
                expanded ? "opacity-0" : "opacity-100"
              }`}
            />
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="btn btn-secondary btn-block btn-sm btn-soft ring fade"
            >
              {expanded ? "Show less" : "View more"}
            </button>
          </div>
        ) : (
          <p className="opacity-30 text-sm italic border-t fade pt-4">No description.</p>
        )}
      </div>
    </div>
  );
}
