import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import {
  IconCalendar,
  IconGlobe,
  IconInfoCircle,
  IconLogout,
  IconUser,
} from "@tabler/icons-react";
import { pb } from "#/client/pb";
import type { ProfileResponse } from "pocketbase-types";
import PageLoader from "#/components/layouts/PageLoader";

export const Route = createFileRoute("/app/profile/")({
  component: RouteComponent,
  // ssr: false,
});

function RouteComponent() {
  // const userId = pb.authStore.record!.id;
  const query = useQuery<{ data: ProfileResponse }>({
    queryKey: ["profile"],
    queryFn: () => pb.send("/profile/me", { method: "GET" }),
  });

  const router = useRouter();
  const { refetch } = query;

  function logout() {
    pb.authStore.clear();
    router.navigate({ to: "/" });
  }
  return (
    <PageLoader query={query}>
      {(resp) => {
        const profile = resp.data;
        return (
          <>
            <div className="space-y-6 ">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="avatar placeholder">
                    <div className="size-20 rounded-full ring ring-primary/30 bg-base-300 flex items-center justify-center">
                      <IconUser size={32} className="opacity-40" />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">
                      {profile.fullname || profile.username}
                    </h2>
                    {profile.username && (
                      <p className="text-sm text-base-content/50">
                        @{profile.username}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => refetch()}
                  >
                    Refresh
                  </button>
                  <button
                    className="btn btn-error btn-soft btn-sm gap-1.5"
                    onClick={logout}
                  >
                    <IconLogout size={15} />
                    Logout
                  </button>
                </div>
              </div>

              {/* Profile details */}
              <div className="card bg-base-200 shadow ring fade">
                <div className="card-body gap-3">
                  <h3 className="card-title text-base">Profile details</h3>
                  <div className="divide-y divide-base-300">
                    {/*<div className="p-4 ring rounded-box bg-base-100 fade my-4 ">
                    {profile.about_me}
                  </div>*/}
                    <DetailRow
                      icon={<IconUser size={15} />}
                      label="Age"
                      value={profile.age}
                    />
                    <DetailRow
                      icon={<IconUser size={15} />}
                      label="Sex"
                      value={profile.sex}
                    />
                    <DetailRow
                      icon={<IconGlobe size={15} />}
                      label="Country"
                      value={profile.country}
                    />
                    <DetailRow
                      icon={<IconCalendar size={15} />}
                      label="Member since"
                      value={new Date(profile.created).toLocaleDateString(
                        undefined,
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        },
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      }}
    </PageLoader>
  );
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between py-3 text-sm">
      <span className="flex items-center gap-2 text-base-content/60">
        {icon}
        {label}
      </span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
