import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { pb } from "#/client/pb";
import PageLoader from "#/components/layouts/PageLoader";
import SavedVideos from "./-components/SavedVideos";
import { type SavedResponse } from "pocketbase-types";

export const Route = createFileRoute("/app/profile/saved")({
  component: RouteComponent,
});

function RouteComponent() {
  const user = pb.authStore.record;
  const query = useQuery({
    queryKey: ["saved-videos"],
    queryFn: () =>
      pb.collection("saved").getFullList({
        filter: `user = "${user?.id}"`,
        expand: "video",
        sort: "-created",
      }),
  });

  return (
    <PageLoader query={query}>
      {(resp) => {
        const items = resp;
        return (
          <>
            {/*{JSON.stringify(resp)}*/}
            <SavedVideos items={items as any} />;
          </>
        );
      }}
    </PageLoader>
  );
}
