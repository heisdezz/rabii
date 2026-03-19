import { pb } from "#/client/pb";
import {
  createFileRoute,
  Link,
  Outlet,
  useLocation,
} from "@tanstack/react-router";
import { redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { parse } from "cookie";

const get_cookie = createServerFn().handler(() => {
  const request = getRequest();
  const cookieHeader = request.headers.get("cookie") ?? "";
  const cookies = parse(cookieHeader);

  if (!cookies["pb_auth"]) {
    throw redirect({ to: "/app" });
  }
  return;
  // pb.authStore.loadFromCookie(cookieHeader);
  // return pb.authStore.record;
});

export const Route = createFileRoute("/app/profile")({
  component: RouteComponent,
  loader: () => get_cookie(),
});

const tabs = [
  { name: "profile", path: "/app/profile" },
  { name: "videos", path: "/app/profile/videos" },
  { name: "saved", path: "/app/profile/saved" },
];

function RouteComponent() {
  const location = useLocation();
  return (
    <section className="container mx-auto ">
      {/*//profile details*/}
      <div className=""></div>
      <div role="tablist" className="tabs tabs-box">
        {tabs.map((tab) => (
          <Link
            key={tab.name}
            role="tab"
            to={tab.path}
            className={`tab ${location.pathname === tab.path ? "tab-active" : ""}`}
          >
            {tab.name}
          </Link>
        ))}
      </div>
      <Outlet />
    </section>
  );
}
