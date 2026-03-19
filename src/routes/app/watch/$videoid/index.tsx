import { createFileRoute } from "@tanstack/react-router";
import WatchScreen from "../-components/Screen";
import ItemDetails from "../-components/ItemDetails";
import { pb } from "#/client/pb";
import type { UsersResponse, VideosResponse } from "pocketbase-types";

export type VideoWithUser = VideosResponse<{ user: UsersResponse }>;

export const Route = createFileRoute("/app/watch/$videoid/")({
  component: RouteComponent,
  loader: async ({ params }) => {
    const { videoid } = params;
    const resp = await pb
      .collection("videos")
      .getOne(videoid, { expand: "user" });
    return resp as VideoWithUser;
  },
});

function RouteComponent() {
  const { videoid } = Route.useParams();
  const resp = Route.useLoaderData();
  return (
    <>
      <div className="container mx-auto page-wrap ">
        <WatchScreen resp={resp} />
        <ItemDetails resp={resp} />
      </div>
    </>
  );
}
