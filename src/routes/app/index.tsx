import { createFileRoute } from "@tanstack/react-router";
import Newest from "./-components/Newest";
import VideoList from "./-components/VideoList";

export const Route = createFileRoute("/app/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="container mx-auto page-wrap space-y-8">
      <Newest />
      <VideoList />
    </div>
  );
}
