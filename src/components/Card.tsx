import { Link } from "@tanstack/react-router";
import { IconPlayerPlay } from "@tabler/icons-react";
import { get_fiel_url } from "#/helpers/client";
import type { VideosResponse } from "pocketbase-types";

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function Card({ video }: { video: VideosResponse }) {
  const thumbUrl = video.thumbnail
    ? get_fiel_url(video, video.thumbnail)
    : null;

  return (
    <Link
      to="/app/watch/$videoid"
      params={{ videoid: video.id }}
      className="group flex-none w-full max-w-100 rounded-sleek overflow-clip ring fade hover:ring-primary/40 transition-all bg-base-200 relative isolate"
    >
      <div className="aspect-video relative bg-base-300 overflow-clip">
        {thumbUrl ? (
          <img
            src={thumbUrl}
            alt={video.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-base-content/20">
            <IconPlayerPlay size={36} strokeWidth={1.5} />
          </div>
        )}
        {/* Hover overlay with backdrop blur */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px] bg-black/20">
          <div className="btn btn-circle btn-sm btn-primary shadow-lg">
            <IconPlayerPlay size={14} />
          </div>
        </div>
      </div>

      {/* Info panel with blurred thumbnail background */}
      <div className="relative overflow-hidden">
        {thumbUrl && (
          <img
            src={thumbUrl}
            alt=""
            aria-hidden
            className="absolute inset-0 w-full h-full object-cover scale-110 blur-xl brightness-[0.3] -z-10"
          />
        )}
        {/*//info section*/}
        <div className="p-3 space-y-1">
          <p className="font-medium text-sm line-clamp-2 leading-snug">
            {video.title || "Untitled"}
          </p>
          <div className="flex items-center gap-2 text-xs text-base-content/50">
            <span>
              {new Date(video.created).toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
            {video.duration != null && (
              <span className="badge badge-sm badge-soft badge-ghost font-mono">
                {formatDuration(video.duration)}
              </span>
            )}
            {video.resolution && (
              <span className="badge badge-sm badge-soft badge-ghost">
                {video.resolution}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
