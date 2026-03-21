import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { IconPlayerPlay, IconLayoutList } from "@tabler/icons-react";
import { pb } from "#/client/pb";
import { get_fiel_url } from "#/helpers/client";
import type { VideosResponse } from "pocketbase-types";

function SimilarCard({ video }: { video: VideosResponse }) {
  const thumbUrl = video.thumbnail
    ? get_fiel_url(video, video.thumbnail)
    : null;

  return (
    <Link
      to="/app/watch/$videoid"
      params={{ videoid: video.id }}
      className="group flex items-center gap-3 p-2 rounded-sleek hover:bg-base-300 transition-colors"
    >
      {/* Thumbnail */}
      <div className="relative shrink-0 w-32 aspect-video rounded-md overflow-clip bg-base-300">
        {thumbUrl ? (
          <img
            src={thumbUrl}
            alt={video.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-base-content/20">
            <IconPlayerPlay size={20} strokeWidth={1.5} />
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
          <div className="btn btn-circle btn-xs btn-primary">
            <IconPlayerPlay size={11} />
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 space-y-1">
        <p className="text-sm font-medium line-clamp-2 leading-snug">
          {video.title || "Untitled"}
        </p>
        <div className="flex flex-wrap gap-1">
          {(video as any).tags?.slice(0, 2).map((tag: string) => (
            <span key={tag} className="badge badge-xs badge-soft badge-ghost">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}

export default function SimilarVideos({
  tags,
  excludeId,
}: {
  tags: string[];
  excludeId: string;
}) {
  const { data, isLoading } = useQuery<VideosResponse[]>({
    queryKey: ["similar", tags],
    queryFn: () => {
      if (!tags.length) return Promise.resolve([]);

      const filter = tags.map((t) => `tags ~ "${t}"`).join(" || ");
      return pb
        .collection("videos")
        .getList(1, 10, {
          filter,
          sort: "-created",
        })
        .then((r) => r.items.filter((v) => v.id !== excludeId));
    },
    enabled: tags.length > 0,
  });

  return (
    <div className="ring fade rounded-sleek bg-base-200 overflow-clip">
      <div className="px-4 py-3 border-b fade flex items-center gap-2">
        <IconLayoutList size={15} className="text-base-content/50" />
        <span className="font-semibold text-sm">Similar</span>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <span className="loading loading-spinner loading-sm" />
        </div>
      ) : !data?.length ? (
        <div className="py-8 text-center text-base-content/40 text-sm">
          No similar videos found.
        </div>
      ) : (
        <div className="p-2 flex flex-col">
          {data.map((video) => (
            <SimilarCard key={video.id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
}
