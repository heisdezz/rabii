import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { pb } from "#/client/pb";

export const Route = createFileRoute("/test")({
  component: RouteComponent,
});

const temp_video_id = "cv8tlj6amfz1ap3";
function RouteComponent() {
  const user = pb.authStore.record;
  const query = useQuery({
    queryKey: ["test-api"],
    queryFn: () => {
      return pb.send("liked/vw5b2yi4mhkiroy", {
        method: "GET",
      });
      const gen_id = `${user?.id + temp_video_id}`;
      return pb.send(`/saved/${gen_id}`, {
        method: "GET",
      });
    },
    enabled: !!user,
  });
  return (
    <div className="page-wrap container mx-auto">
      <div className="">Testing Page</div>
      {JSON.stringify(query.data)}
    </div>
  );
}
