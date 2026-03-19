import { createFileRoute, redirect } from "@tanstack/react-router";
import WatchScreen from "./-components/Screen";
import ItemDetails from "./-components/ItemDetails";

export const Route = createFileRoute("/app/watch/")({
  component: RouteComponent,
  loader: () => {
    redirect({ to: "/app" });
  },
});

function RouteComponent() {
  return (
    <div className="container mx-auto page-wrap ">
      {/*<WatchScreen />
      <ItemDetails />*/}
    </div>
  );
}
