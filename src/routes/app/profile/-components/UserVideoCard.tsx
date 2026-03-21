import { Link } from "@tanstack/react-router";
import { IconEdit, IconPlayerPlay } from "@tabler/icons-react";
import { get_fiel_url } from "#/helpers/client";
import type { VideosResponse } from "pocketbase-types";

export default function UserVideoCard({ video }: { video: VideosResponse }) {
  const thumbUrl = video.thumbnail
    ? get_fiel_url(video, video.thumbnail)
    : null;

  return (
    <div className="group relative rounded-sleek overflow-clip ring fade hover:ring-primary/50 transition-all bg-base-200 shadow-sm hover:shadow-md">
      {/* Thumbnail */}
      <Link
        to="/app/watch/$videoid"
        params={{ videoid: video.id }}
        className="block"
      >
        <div className="aspect-video relative bg-base-300 overflow-clip">
          {thumbUrl ? (
            <img
              src={thumbUrl}
              alt={video.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-base-content/20">
              <IconPlayerPlay size={36} strokeWidth={1.5} />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="btn btn-circle btn-sm btn-primary shadow-lg">
              <IconPlayerPlay size={14} />
            </div>
          </div>
        </div>
      </Link>

      {/* Info */}
      <div className="p-3 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-medium text-sm line-clamp-2 leading-snug">
            {video.title || "Untitled"}
          </p>
          <p className="text-xs text-base-content/40 mt-1">
            {new Date(video.created).toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </p>
        </div>
        <Link
          to="/app/upload/$videoid"
          params={{ videoid: video.id }}
          className="btn btn-sm btn-ghost btn-square shrink-0"
          title="Edit"
        >
          <IconEdit size={15} />
        </Link>
      </div>
    </div>
  );
}
