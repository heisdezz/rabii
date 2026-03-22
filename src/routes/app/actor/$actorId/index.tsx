import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { pb } from "#/client/pb";
import Card from "#/components/Card";
import CardContainer from "#/components/layouts/CardContainer";
import { IconUser, IconVideo, IconMapPin, IconInfoCircle } from "@tabler/icons-react";
import { get_fiel_url } from "#/helpers/client";
import type { ProfileResponse, UsersResponse, VideosResponse } from "pocketbase-types";
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

  const profileQuery = useQuery<ProfileResponse | null>({
    queryKey: ["actor", actorId, "profile"],
    queryFn: () =>
      pb
        .collection("profile")
        .getFirstListItem(`user = "${actorId}"`)
        .catch(() => null),
    enabled: !!actorId,
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

  const user = userQuery.data;
  const profile = profileQuery.data;
  const avatarUrl = user?.avatar ? get_fiel_url(user, user.avatar) : null;
  const videoCount = videosQuery.data?.length;
  const displayName = profile?.fullname || user?.name || "Unknown";

  if (userQuery.isLoading) {
    return (
      <div className="container mx-auto page-wrap">
        <div className="animate-pulse space-y-4">
          <div className="ring fade rounded-sleek bg-base-200 overflow-clip">
            <div className="h-32 bg-base-300" />
            <div className="px-6 pb-6 -mt-10 flex items-end gap-4">
              <div className="w-20 h-20 rounded-full bg-base-300 ring-4 ring-base-200 shrink-0" />
              <div className="space-y-2 mb-1">
                <div className="h-5 bg-base-300 rounded w-36" />
                <div className="h-3 bg-base-300 rounded w-20" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="container mx-auto page-wrap space-y-4">
      {/* Profile card */}
      <div className="ring fade rounded-sleek bg-base-200 overflow-clip">
        {/* Banner */}
        <div className="h-36 sm:h-44 relative bg-gradient-to-br from-primary/20 via-base-300 to-secondary/20 overflow-clip">
          {avatarUrl && (
            <img
              src={avatarUrl}
              alt=""
              className="absolute inset-0 w-full h-full object-cover blur-2xl scale-110 opacity-30"
            />
          )}
        </div>

        {/* Avatar + info row */}
        <div className="px-5 sm:px-6 pb-5 sm:pb-6 -mt-10 flex flex-col sm:flex-row sm:items-end gap-4">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-base-300 overflow-hidden ring-4 ring-base-200 shrink-0 flex items-center justify-center shadow-lg">
            {avatarUrl ? (
              <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
            ) : (
              <IconUser size={36} className="text-base-content/30" />
            )}
          </div>

          <div className="flex-1 min-w-0 sm:pb-1 space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold truncate">{displayName}</h1>
              {user.verified && (
                <span className="badge badge-xs badge-primary badge-soft">Verified</span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-base-content/50">
              {profile?.username && (
                <span className="text-base-content/40">@{profile.username}</span>
              )}
              {profile?.country && (
                <span className="flex items-center gap-1">
                  <IconMapPin size={11} />
                  {profile.country}
                </span>
              )}
              <span className="flex items-center gap-1">
                <IconVideo size={11} />
                {videoCount ?? "—"} video{videoCount !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </div>

        {/* About */}
        {profile?.about_me && (
          <div className="px-5 sm:px-6 pb-5 sm:pb-6 border-t fade pt-4">
            <div className="flex items-start gap-2 text-sm text-base-content/70">
              <IconInfoCircle size={14} className="mt-0.5 shrink-0 text-base-content/30" />
              <div
                className="prose prose-sm prose-invert max-w-none opacity-80"
                dangerouslySetInnerHTML={{ __html: profile.about_me }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Videos */}
      <div className="ring fade rounded-sleek bg-base-200 overflow-clip">
        <div className="px-4 py-3 border-b fade flex items-center gap-2">
          <IconVideo size={15} className="text-base-content/50" />
          <span className="font-semibold text-sm">Videos</span>
          {videoCount !== undefined && (
            <span className="ml-auto text-xs text-base-content/40">{videoCount}</span>
          )}
        </div>
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
      </div>
    </div>
  );
}
