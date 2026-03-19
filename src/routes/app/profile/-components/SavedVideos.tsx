import { Link } from "@tanstack/react-router";
import { IconBookmarkOff, IconPlayerPlay } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { pb } from "#/client/pb";
import { get_fiel_url } from "#/helpers/client";
import type { SavedResponse, VideosResponse } from "pocketbase-types";

type SavedWithVideo = SavedResponse<{ video: VideosResponse }>;

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0)
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function SavedVideoCard({ saved }: { saved: SavedWithVideo }) {
  const video = saved.expand?.video;
  const queryClient = useQueryClient();

  const unsave = useMutation({
    mutationFn: () => pb.collection("saved").delete(saved.id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["saved-videos"] }),
  });

  const thumbUrl = video?.thumbnail
    ? get_fiel_url(video, video.thumbnail)
    : null;

  return (
    <div className="group relative rounded-sleek overflow-clip ring fade hover:ring-primary/50 transition-all bg-base-200 shadow-sm hover:shadow-md">
      {/* Thumbnail */}
      <Link
        to="/app/watch/$videoid"
        params={{ videoid: video?.id ?? "" }}
        className="block"
      >
        <div className="aspect-video relative bg-base-300 overflow-clip">
          {thumbUrl ? (
            <img
              src={thumbUrl}
              alt={video?.title}
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

      {/* Unsave button — top-right on hover */}
      <button
        onClick={() => unsave.mutate()}
        disabled={unsave.isPending}
        className="btn btn-circle btn-xs btn-neutral absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow"
        title="Remove from saved"
      >
        <IconBookmarkOff size={12} />
      </button>

      {/* Info */}
      <div className="relative overflow-hidden">
        {thumbUrl && (
          <img
            src={thumbUrl}
            alt=""
            aria-hidden
            className="absolute inset-0 w-full h-full object-cover scale-110 blur-xl brightness-[0.3] -z-10"
          />
        )}
        <div className="p-3 space-y-1">
          <p className="font-medium text-sm line-clamp-2 leading-snug">
            {video?.title || "Untitled"}
          </p>
          <div className="flex items-center gap-2 text-xs text-base-content/50">
            <span>
              {new Date(saved.created).toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
            {video?.duration != null && (
              <span className="badge badge-sm badge-soft badge-ghost font-mono">
                {formatDuration(video.duration)}
              </span>
            )}
            {video?.resolution && (
              <span className="badge badge-sm badge-soft badge-ghost">
                {video.resolution}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SavedVideos({ items }: { items: SavedWithVideo[] }) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-base-content/40 gap-2">
        <p className="text-lg font-medium">No saved videos</p>
        <p className="text-sm">Videos you save will appear here.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {items.map((saved) => (
        <SavedVideoCard key={saved.id} saved={saved} />
      ))}
    </div>
  );
}
