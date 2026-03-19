import { ClientOnly, createFileRoute, useNavigate } from "@tanstack/react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import MDEditor from "@uiw/react-md-editor";
import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import SimpleInput from "#/components/inputs/SimpleInput";
import { IconDeviceFloppy, IconUpload, IconVideo, IconX } from "@tabler/icons-react";
import { pb } from "#/client/pb";
import { toast } from "sonner";
import type { VideosResponse } from "pocketbase-types";
import ThumbnailPicker from "./-components/ThumbnailPicker";
import { get_fiel_url } from "#/helpers/client";

export const Route = createFileRoute("/app/upload/$videoid")({
  component: RouteComponent,
});

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  tags: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

function RouteComponent() {
  const { videoid } = Route.useParams();
  const navigate = useNavigate();

  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const thumbnailBlobRef = useRef<Blob | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: video, isLoading } = useQuery<VideosResponse>({
    queryKey: ["videos", videoid],
    queryFn: () => pb.collection("videos").getOne(videoid),
  });

  const existingVideoUrl = video?.video ? get_fiel_url(video, video.video as string) : null;
  const activeVideoSrc = videoPreview ?? existingVideoUrl;

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { title: "", description: "", tags: "" },
  });

  useEffect(() => {
    if (video) {
      form.reset({
        title: video.title ?? "",
        description: (video as any).description ?? "",
        tags: (video as any).tags ?? "",
      });
    }
  }, [video]);

  const setVideoFileWithPreview = (file: File) => {
    setVideoFile(file);
    setVideoPreview(URL.createObjectURL(file));
  };

  const clearVideo = () => {
    setVideoFile(null);
    if (videoPreview) URL.revokeObjectURL(videoPreview);
    setVideoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith("video/")) setVideoFileWithPreview(file);
  };

  const { mutate: save, isPending } = useMutation({
    mutationFn: async (data: FormData) => {
      const fd = new globalThis.FormData();
      fd.append("title", data.title);
      fd.append("description", data.description ?? "");
      fd.append("tags", data.tags ?? "");
      if (videoFile) fd.append("video", videoFile, videoFile.name);
      if (thumbnailBlobRef.current) {
        fd.append("thumbnail", thumbnailBlobRef.current, "thumbnail.jpg");
      }
      return pb.collection("videos").update(videoid, fd);
    },
    onSuccess: () => {
      toast.success("Video updated!");
      navigate({ to: "/app/profile/videos" });
    },
    onError: (e: any) => toast.error(e?.message ?? "Update failed"),
  });

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-3xl py-8 flex justify-center">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-3xl py-8 space-y-6">
      <h1 className="text-2xl font-bold">Edit video</h1>

      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit((data) => save(data))}
          className="space-y-6"
        >
          {/* Drop zone */}
          <div
            className={`ring fade rounded-sleek overflow-clip border-2 border-dashed transition-colors hover:border-primary/50 ${
              videoFile
                ? "border-primary/40 border-solid"
                : "border-base-content/20"
            }`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleFileDrop}
          >
            {activeVideoSrc ? (
              <div className="relative">
                <video
                  src={activeVideoSrc}
                  controls
                  className="w-full max-h-72 object-contain bg-black"
                />
                {videoFile && (
                  <button
                    type="button"
                    onClick={clearVideo}
                    className="btn btn-circle btn-sm btn-error absolute top-2 right-2"
                  >
                    <IconX size={14} />
                  </button>
                )}
                <div className="p-3 flex items-center gap-2 bg-base-200 text-sm text-base-content/60">
                  <IconVideo size={14} />
                  <span className="truncate">
                    {videoFile ? videoFile.name : "Current video"}
                  </span>
                  {videoFile && (
                    <span className="ml-auto shrink-0">
                      {(videoFile.size / 1024 / 1024).toFixed(1)} MB
                    </span>
                  )}
                  {!videoFile && (
                    <button
                      type="button"
                      className="ml-auto btn btn-ghost btn-xs"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Replace
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <button
                type="button"
                className="w-full p-12 flex flex-col items-center gap-3 text-base-content/40 hover:text-base-content/60 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <IconUpload size={40} strokeWidth={1.5} />
                <div className="text-center">
                  <p className="font-medium">Drop your video here</p>
                  <p className="text-sm mt-1">or click to browse</p>
                  <p className="text-xs mt-2 opacity-60">MP4, MOV, MKV, WebM</p>
                </div>
              </button>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setVideoFileWithPreview(file);
            }}
          />

          <ThumbnailPicker
            videoSrc={activeVideoSrc}
            onSelect={(blob) => {
              thumbnailBlobRef.current = blob;
            }}
          />

          {/* Metadata */}
          <div className="card bg-base-200 shadow ring fade">
            <div className="card-body space-y-4">
              <SimpleInput
                {...form.register("title")}
                label="Title"
                placeholder="Give your video a title"
              />

              <div className="space-y-2">
                <div className="fieldset-label font-semibold text-sm">
                  Description
                </div>
                <Controller
                  name="description"
                  control={form.control}
                  render={({ field }) => (
                    <div data-color-mode="dark">
                      <ClientOnly
                        fallback={
                          <div className="h-60 bg-base-100 ring fade p-4 rounded-sleek">
                            ...loading meditor
                          </div>
                        }
                      >
                        <MDEditor
                          value={field.value}
                          onChange={field.onChange}
                          height={220}
                          preview="edit"
                        />
                      </ClientOnly>
                    </div>
                  )}
                />
              </div>

              <SimpleInput
                {...form.register("tags")}
                label="Tags"
                placeholder="action, comedy, short  (comma separated)"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => navigate({ to: "/app/profile/videos" })}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isPending}
            >
              {isPending ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                <IconDeviceFloppy size={16} />
              )}
              Save
            </button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
