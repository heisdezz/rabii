import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { Toaster } from "sonner";
import appCss from "../styles.css?url";
import { useAutoRefresh, useSessionSync } from "../client/session";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Footer from "#/components/Footer";
import Sidebar from "#/components/Sidebar";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
    },
  },
});

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "Rabii",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
  component: RootComponent,
});

function RootComponent() {
  useSessionSync();
  useAutoRefresh();
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="rabii">
      <head>
        <HeadContent />
      </head>
      <body>
        <div className="drawer">
          <input id="main-drawer" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content flex flex-col">
            {children}
            <Footer />
          </div>
          <div className="drawer-side z-30">
            <label htmlFor="main-drawer" className="drawer-overlay" />
            <Sidebar />
          </div>
        </div>
        <Toaster />
        <TanStackDevtools
          config={{
            position: "bottom-right",
          }}
          plugins={[
            {
              name: "Tanstack Router",
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  );
}
