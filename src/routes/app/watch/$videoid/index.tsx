import { createFileRoute } from "@tanstack/react-router";
import WatchScreen from "../-components/Screen";
import ItemDetails from "../-components/ItemDetails";
import SimilarVideos from "../-components/Similar";
import { pb } from "#/client/pb";
import { useQuery } from "@tanstack/react-query";

import type { UsersResponse, VideosResponse } from "pocketbase-types";
import PageLoader from "#/components/layouts/PageLoader";
import { ClientOnly } from "@tanstack/react-router";

export type VideoWithUser = VideosResponse<{ user: UsersResponse }>;

export const Route = createFileRoute("/app/watch/$videoid/")({
  component: RouteComponent,
  loader: async ({ params }) => {
    const { videoid } = params;
    const resp = await pb
      .collection("videos")
      .getOne(videoid, { expand: "user,tags" });
    return resp as VideoWithUser;
  },
});

function RouteComponent() {
  const resp = Route.useLoaderData();
  const { videoid } = Route.useParams();

  const tags: string[] = ((resp as any).expand?.tags ?? []).map((t: { name: string }) => t.name).filter(Boolean);

  const new_resp = resp;
  return (
    <div className="container mx-auto page-wrap gap-4 flex items-start">
      {/*{JSON.stringify(new_resp)}*/}
      <section className="flex-1 min-w-0 space-y-4">
        <WatchScreen resp={new_resp} />
        <ItemDetails resp={new_resp} />
      </section>
      <aside className="w-80 shrink-0 hidden lg:block">
        <SimilarVideos tags={tags} excludeId={new_resp.id} />
      </aside>
    </div>
  );
}
