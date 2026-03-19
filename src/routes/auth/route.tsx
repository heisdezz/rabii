import { pb } from "#/client/pb";
import MainNavbar from "#/components/NavBar";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/auth")({
  component: RouteComponent,
});

function RouteComponent() {
  useEffect(() => {
    const listner = pb.authStore.onChange((token, record) => {
      // console.log(token, record);
      if (token) {
        document.cookie = pb.authStore.exportToCookie({
          httpOnly: false,
          secure: false,
        });
      }
    });
    return () => {
      listner();
    };
  }, []);
  return (
    <>
      <MainNavbar />
      <Outlet />
    </>
  );
}
