import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { IconEdit, IconPlayerPlay, IconTrash, IconClock } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { pb } from "#/client/pb";
import { get_fiel_url } from "#/helpers/client";
import type { VideosResponse } from "pocketbase-types";
import ConfirmDialog from "#/components/ConfirmDialog";

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function UserVideoCard({ video }: { video: VideosResponse }) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const queryClient = useQueryClient();

  const thumbUrl = video.thumbnail ? get_fiel_url(video, video.thumbnail) : null;

  const { mutate: deleteVideo, isPending } = useMutation({
    mutationFn: () => pb.collection("videos").delete(video.id),
    onSuccess: () => {
      toast.success("Video deleted");
      queryClient.invalidateQueries({ queryKey: ["videos", "user"] });
      setConfirmOpen(false);
    },
    onError: (e: any) => toast.error(e?.message ?? "Delete failed"),
  });

  return (
    <>
      <div className="group rounded-sleek overflow-clip ring fade bg-base-200 hover:ring-primary/30 transition-all flex flex-col">
        {/* Thumbnail */}
        <Link to="/app/watch/$videoid" params={{ videoid: video.id }} className="block relative">
          <div className="aspect-video bg-base-300 overflow-clip">
            {thumbUrl ? (
              <img
                src={thumbUrl}
                alt={video.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-base-content/20">
                <IconPlayerPlay size={40} strokeWidth={1.5} />
              </div>
            )}
          </div>

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-primary text-primary-content rounded-full p-3 shadow-xl">
              <IconPlayerPlay size={20} />
            </div>
          </div>

          {/* Duration badge */}
          {video.duration ? (
            <span className="absolute bottom-2 right-2 flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-black/75 text-white backdrop-blur-sm">
              <IconClock size={10} />
              {formatDuration(video.duration)}
            </span>
          ) : null}
        </Link>

        {/* Info */}
        <div className="flex flex-col flex-1 p-3 gap-3">
          <div className="flex-1 space-y-1">
            <p className="font-semibold text-sm line-clamp-2 leading-snug">
              {video.title || "Untitled"}
            </p>
            <p className="text-xs text-base-content/40">
              {new Date(video.created).toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-2">
            <Link
              to="/app/upload/$videoid"
              params={{ videoid: video.id }}
              className="btn btn-sm btn-soft ring fade gap-1.5"
            >
              <IconEdit size={14} />
              Edit
            </Link>
            <button
              type="button"
              className="btn btn-sm btn-soft btn-error ring fade gap-1.5"
              onClick={() => setConfirmOpen(true)}
            >
              <IconTrash size={14} />
              Delete
            </button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete video?"
        description={`"${video.title || "Untitled"}" will be permanently deleted.`}
        confirmLabel="Delete"
        variant="error"
        isPending={isPending}
        onConfirm={() => deleteVideo()}
        onClose={() => setConfirmOpen(false)}
      />
    </>
  );
}
