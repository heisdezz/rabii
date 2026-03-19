import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { pb } from "#/client/pb";
import type { VideosResponse } from "pocketbase-types";
import UserVideoCard from "./-components/UserVideoCard";
import PageLoader from "#/components/layouts/PageLoader";
import { IconPlus } from "@tabler/icons-react";

export const Route = createFileRoute("/app/profile/videos")({
  component: RouteComponent,
});

function RouteComponent() {
  const userId = pb.authStore.record?.id ?? null;

  const query = useQuery<VideosResponse[]>({
    queryKey: ["videos", "user", userId],
    queryFn: () =>
      pb.collection("videos").getFullList({
        filter: `user = "${userId}"`,
        sort: "-created",
      }),
  });

  return (
    <PageLoader query={query}>
      {(videos) => (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Link to="/app/upload" className="btn btn-primary btn-sm">
              <IconPlus size={16} />
              Add video
            </Link>
          </div>
          {videos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-base-content/40 gap-2">
              <p className="text-lg font-medium">No videos yet</p>
              <p className="text-sm">Upload your first video to see it here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {videos.map((video) => (
                <UserVideoCard key={video.id} video={video} />
              ))}
            </div>
          )}
        </div>
      )}
    </PageLoader>
  );
}
