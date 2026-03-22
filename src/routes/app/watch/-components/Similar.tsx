import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { IconPlayerPlay, IconLayoutList } from "@tabler/icons-react";
import { pb } from "#/client/pb";
import { get_fiel_url } from "#/helpers/client";
import type { TagsRecord, VideosResponse } from "pocketbase-types";

function SimilarCard({
  video,
}: {
  video: VideosResponse<{ tags: TagsRecord[] }>;
}) {
  const thumbUrl = video.thumbnail
    ? get_fiel_url(video, video.thumbnail)
    : null;
  const tags = video.expand?.tags;
  return (
    <Link
      to="/app/watch/$videoid"
      params={{ videoid: video.id }}
      className="group flex gap-3 p-2 rounded-sleek hover:bg-base-300/60 transition-colors"
    >
      {/* Thumbnail */}
      <div className="relative shrink-0 w-28 aspect-video rounded-md overflow-clip bg-base-300">
        {thumbUrl ? (
          <img
            src={thumbUrl}
            alt={video.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-base-content/20">
            <IconPlayerPlay size={18} strokeWidth={1.5} />
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
          <div className="bg-primary text-primary-content rounded-full p-1">
            <IconPlayerPlay size={12} />
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 flex flex-col justify-center gap-1.5">
        <p className="text-sm font-medium line-clamp-2 leading-snug group-hover:text-primary transition-colors">
          {video.title || "Untitled"}
        </p>
        {tags?.length ? (
          <div className="flex flex-wrap gap-1">
            {tags.slice(0, 2).map((tag) => (
              <span
                key={tag.id}
                className="text-[10px] px-1.5 py-0.5 rounded bg-base-content/8 text-base-content/50"
              >
                {tag.name}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </Link>
  );
}

export default function SimilarVideos({
  tags,
  excludeId,
}: {
  tags: TagsRecord[];
  excludeId: string;
}) {
  const tagIds = tags.map((t) => t.id);

  const { data, isLoading } = useQuery<
    VideosResponse<{ tags: TagsRecord[] }>[]
  >({
    queryKey: ["similar", tagIds],
    queryFn: async (): Promise<VideosResponse<{ tags: TagsRecord[] }>[]> => {
      if (!tags.length) return [];
      const filter = `(${tagIds.map((id) => `tags ?~ "${id}"`).join(" || ")})`;

      const result = await pb.collection("videos").getList(1, 10, {
        filter,
        sort: "-created",
        expand: "tags",
      });
      return result.items.filter(
        (v) => v.id !== excludeId
      ) as VideosResponse<{ tags: TagsRecord[] }>[];
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
