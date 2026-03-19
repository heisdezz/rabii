import { pb } from "#/client/pb";
import MainNavbar from "#/components/NavBar";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/app")({
  component: RouteComponent,
});

function RouteComponent() {
  useEffect(() => {
    const listner = pb.authStore.onChange((token, record) => {
      console.log(token, record);
      if (token) {
        document.cookie = pb.authStore.exportToCookie({ httpOnly: false, secure: false });
      }
    });
    return () => {
      listner();
    };
  }, []);
  return (
    <>
      <div className="drawer">
        <input id="main-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          <MainNavbar />
          <Outlet />
        </div>
        <div className="drawer-side">
          <label
            htmlFor="main-drawer"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu bg-base-200 min-h-full w-80 p-4">
            {/* Sidebar content here */}
            <li>
              <a>Sidebar Item 1</a>
            </li>
            <li>
              <a>Sidebar Item 2</a>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
