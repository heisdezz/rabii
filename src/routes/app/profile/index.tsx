import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useRouter, ClientOnly } from "@tanstack/react-router";
import { Controller, useForm } from "react-hook-form";
import {
  IconCalendar,
  IconEdit,
  IconGlobe,
  IconLogout,
  IconUser,
  IconX,
  IconDeviceFloppy,
} from "@tabler/icons-react";
import MDEditor from "@uiw/react-md-editor";
import ReactMarkdown from "react-markdown";
import { pb } from "#/client/pb";
import type { ProfileResponse } from "pocketbase-types";
import PageLoader from "#/components/layouts/PageLoader";
import SimpleInput from "#/components/inputs/SimpleInput";
import { toast } from "sonner";

export const Route = createFileRoute("/app/profile/")({
  component: RouteComponent,
});

type EditForm = {
  fullname: string;
  username: string;
  age: string;
  sex: string;
  country: string;
  about_me: string;
};

function RouteComponent() {
  const query = useQuery<{ data: ProfileResponse }>({
    queryKey: ["profile"],
    queryFn: () => pb.send("/profile/me", { method: "GET" }),
  });

  const router = useRouter();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(false);

  const form = useForm<EditForm>();

  const { mutate: save, isPending } = useMutation({
    // mutationFn: (data: EditForm) =>
    //   pb.send("/profile/me", {
    //     method: "PATCH",
    //     body: { ...data, age: data.age ? Number(data.age) : null },
    //   }),
    //
    mutationFn: (data: EditForm) =>
      pb.collection("profile").update(pb.authStore.model!.id, {
        ...data,
        age: data.age ? Number(data.age) : null,
      }),
    onSuccess: () => {
      toast.success("Profile updated!");
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      setEditing(false);
    },
    onError: (e: any) => toast.error(e?.message ?? "Update failed"),
  });

  function logout() {
    pb.authStore.clear();
    router.navigate({ to: "/" });
  }

  function startEdit(profile: ProfileResponse) {
    form.reset({
      fullname: profile.fullname ?? "",
      username: profile.username ?? "",
      age: profile.age ? String(profile.age) : "",
      sex: profile.sex ?? "",
      country: profile.country ?? "",
      about_me: profile.about_me ?? "",
    });
    setEditing(true);
  }

  return (
    <PageLoader query={query}>
      {(resp) => {
        const profile = resp.data;
        return (
          <div className=" mx-auto space-y-5">
            {/* Header */}
            <div className="ring fade rounded-sleek bg-base-200 p-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="avatar placeholder shrink-0">
                  <div className="size-16 rounded-full ring ring-primary/30 bg-base-300 flex items-center justify-center">
                    <IconUser size={28} className="opacity-40" />
                  </div>
                </div>
                <div>
                  <h2 className="text-lg font-bold leading-tight">
                    {profile.fullname || profile.username || "No name"}
                  </h2>
                  {profile.username && (
                    <p className="text-sm text-base-content/50">
                      @{profile.username}
                    </p>
                  )}
                  <p className="text-xs text-base-content/40 mt-0.5">
                    Member since{" "}
                    {new Date(profile.created).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {!editing && (
                  <button
                    className="btn btn-ghost btn-sm gap-1.5"
                    onClick={() => startEdit(profile)}
                  >
                    <IconEdit size={15} />
                    Edit
                  </button>
                )}
                <button
                  className="btn btn-error btn-soft btn-sm gap-1.5"
                  onClick={logout}
                >
                  <IconLogout size={15} />
                  Logout
                </button>
              </div>
            </div>

            {editing ? (
              /* Edit form */
              <form
                onSubmit={form.handleSubmit((d) => save(d))}
                className="space-y-5"
              >
                <div className="card bg-base-200 ring fade shadow">
                  <div className="card-body space-y-4">
                    <h3 className="font-semibold text-sm">Edit profile</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <SimpleInput
                        {...form.register("fullname")}
                        label="Full name"
                        placeholder="Your name"
                      />
                      <SimpleInput
                        {...form.register("username")}
                        label="Username"
                        placeholder="username"
                      />
                      <SimpleInput
                        {...form.register("age")}
                        label="Age"
                        placeholder="Age"
                        type="number"
                      />
                      <SimpleInput
                        {...form.register("sex")}
                        label="Sex"
                        placeholder="e.g. Male"
                      />
                      <SimpleInput
                        {...form.register("country")}
                        label="Country"
                        placeholder="Country"
                        className="col-span-2"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="fieldset-label font-semibold text-sm">
                        About me
                      </div>
                      <Controller
                        name="about_me"
                        control={form.control}
                        render={({ field }) => (
                          <div data-color-mode="dark">
                            <ClientOnly
                              fallback={
                                <div className="h-40 bg-base-100 ring fade p-4 rounded-sleek" />
                              }
                            >
                              <MDEditor
                                value={field.value}
                                onChange={field.onChange}
                                height={180}
                                preview="edit"
                              />
                            </ClientOnly>
                          </div>
                        )}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm gap-1.5"
                    onClick={() => setEditing(false)}
                  >
                    <IconX size={14} />
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary btn-sm gap-1.5"
                    disabled={isPending}
                  >
                    {isPending ? (
                      <span className="loading loading-spinner loading-xs" />
                    ) : (
                      <IconDeviceFloppy size={14} />
                    )}
                    Save
                  </button>
                </div>
              </form>
            ) : (
              <>
                {/* About me */}
                {profile.about_me && (
                  <div className="card bg-base-200 ring fade shadow">
                    <div className="card-body">
                      <h3 className="font-semibold text-sm mb-1">About me</h3>
                      <div className="prose prose-sm prose-invert max-w-none opacity-80">
                        <ReactMarkdown>{profile.about_me}</ReactMarkdown>
                      </div>
                    </div>
                  </div>
                )}

                {/* Details */}
                <div className="card bg-base-200 ring fade shadow">
                  <div className="card-body gap-1">
                    <h3 className="font-semibold text-sm mb-1">Details</h3>
                    <div className="divide-y divide-base-300">
                      <DetailRow
                        icon={<IconUser size={14} />}
                        label="Age"
                        value={profile.age || "—"}
                      />
                      <DetailRow
                        icon={<IconUser size={14} />}
                        label="Sex"
                        value={profile.sex || "—"}
                      />
                      <DetailRow
                        icon={<IconGlobe size={14} />}
                        label="Country"
                        value={profile.country || "—"}
                      />
                      <DetailRow
                        icon={<IconCalendar size={14} />}
                        label="Member since"
                        value={new Date(profile.created).toLocaleDateString(
                          undefined,
                          { year: "numeric", month: "long", day: "numeric" },
                        )}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
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
