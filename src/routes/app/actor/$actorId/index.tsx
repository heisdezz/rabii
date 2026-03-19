import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { pb } from "#/client/pb";
import Card from "#/components/Card";
import CardContainer from "#/components/layouts/CardContainer";
import PageLoader from "#/components/layouts/PageLoader";
import { IconUser, IconVideo } from "@tabler/icons-react";
import { get_fiel_url } from "#/helpers/client";
import type { UsersResponse, VideosResponse } from "pocketbase-types";
import CompLoader from "#/components/layouts/ComponentLoader";

export const Route = createFileRoute("/app/actor/$actorId/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { actorId } = Route.useParams();

  const userQuery = useQuery<UsersResponse>({
    queryKey: ["actor", actorId],
    queryFn: () => pb.collection("users").getOne(actorId),
  });

  const videosQuery = useQuery<VideosResponse[]>({
    queryKey: ["actor", actorId, "videos"],
    queryFn: () =>
      pb
        .collection("videos")
        .getList(1, 50, { filter: `user = "${actorId}"`, sort: "-created" })
        .then((r) => r.items),
    enabled: !!actorId,
  });

  const avatarUrl = userQuery.data?.avatar
    ? get_fiel_url(userQuery.data, userQuery.data.avatar)
    : null;

  return (
    <div className="container mx-auto page-wrap space-y-8">
      {/* Profile header */}
      <PageLoader
        query={userQuery}
        customLoading={
          <div className="flex items-center gap-5 animate-pulse">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-base-300 shrink-0" />
            <div className="space-y-2 flex-1">
              <div className="h-5 bg-base-300 rounded w-40" />
              <div className="h-3 bg-base-300 rounded w-24" />
            </div>
          </div>
        }
      >
        {(user) => (
          <div className="space-y-4">
            <div className="flex items-center gap-5">
              {/* Avatar */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-base-300 overflow-hidden ring-2 ring-base-content/10 shrink-0 flex items-center justify-center">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <IconUser size={36} className="text-base-content/30" />
                )}
              </div>

              {/* Info */}
              <div className="min-w-0 space-y-1">
                <h1 className="text-2xl font-bold truncate">
                  {user.name || "Unknown"}
                </h1>
                <div className="flex items-center gap-1.5 text-base-content/50 text-sm">
                  <IconVideo size={14} />
                  <span>
                    {videosQuery.data?.length ?? "—"} video
                    {videosQuery.data?.length !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>
            </div>
            {/* Videos */}
            <section className="space-y-4 ring fade rounded-sleek">
              <h2 className="text-lg font-semibold p-4 border-b fade ">
                Videos
              </h2>
              <div className="p-4">
                <CompLoader query={videosQuery}>
                  {(videos) =>
                    videos.length === 0 ? (
                      <div className="py-16 flex flex-col items-center gap-3 text-base-content/40">
                        <IconVideo size={36} strokeWidth={1.5} />
                        <p className="text-sm">No videos uploaded yet</p>
                      </div>
                    ) : (
                      <CardContainer>
                        {videos.map((video) => (
                          <Card key={video.id} video={video} />
                        ))}
                      </CardContainer>
                    )
                  }
                </CompLoader>
              </div>
            </section>
          </div>
        )}
      </PageLoader>

      <div className="divider my-0" />
    </div>
  );
}
