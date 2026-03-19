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
      <section className="space-y-4 ring fade rounded-sleek">
        <h2 className="text-lg font-semibold p-4 border-b fade ">Videos</h2>
        <div className="p-4">
          <VideoList />
        </div>
      </section>
    </div>
  );
}
