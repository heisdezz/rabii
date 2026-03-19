import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/app/upload")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <Outlet />
    </>
  );
}
