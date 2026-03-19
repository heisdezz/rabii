import { ClientOnly, createFileRoute, useNavigate } from "@tanstack/react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import MDEditor from "@uiw/react-md-editor";
import { useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import SimpleInput from "#/components/inputs/SimpleInput";
import { IconUpload, IconVideo, IconX } from "@tabler/icons-react";
import { pb } from "#/client/pb";
import { toast } from "sonner";
import ThumbnailPicker from "./-components/ThumbnailPicker";

function getVideoResolution(file: File): Promise<string> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const vid = document.createElement("video");
    vid.preload = "metadata";
    vid.onloadedmetadata = () => {
      URL.revokeObjectURL(url);
      const h = vid.videoHeight;
      if (h >= 2160) resolve("4K");
      else if (h >= 1440) resolve("1440p");
      else if (h >= 1080) resolve("1080p");
      else if (h >= 720) resolve("720p");
      else if (h >= 480) resolve("480p");
      else if (h >= 360) resolve("360p");
      else resolve("240p");
    };
    vid.onerror = () => { URL.revokeObjectURL(url); resolve(""); };
    vid.src = url;
  });
}

export const Route = createFileRoute("/app/upload/")({
  component: RouteComponent,
});

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  tags: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

function RouteComponent() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const thumbnailBlobRef = useRef<Blob | null>(null);
  const resolutionRef = useRef<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { title: "", description: "", tags: "" },
  });

  const { mutate: upload, isPending } = useMutation({
    mutationFn: async (data: FormData) => {
      if (!videoFile) throw new Error("No video selected");
      const fd = new globalThis.FormData();
      fd.append("title", data.title);
      fd.append("description", data.description ?? "");
      for (const tag of (data.tags ?? "").split(",").map((t) => t.trim()).filter(Boolean))
        fd.append("tags", tag);
      fd.append("video", videoFile, videoFile.name);
      if (resolutionRef.current) fd.append("resolution", resolutionRef.current);
      fd.append("user", pb.authStore.record!.id);
      if (thumbnailBlobRef.current) {
        fd.append("thumbnail", thumbnailBlobRef.current, "thumbnail.jpg");
      }
      return pb.collection("videos").create(fd);
    },
    onSuccess: () => {
      toast.success("Video uploaded!");
      form.reset();
      clearVideo();
      navigate({ to: "/app/profile/videos" });
    },
    onError: (e: any) => toast.error(e?.message ?? "Upload failed"),
  });

  const setVideoFileWithPreview = (file: File) => {
    setVideoFile(file);
    setVideoPreview(URL.createObjectURL(file));
    getVideoResolution(file).then((r) => { resolutionRef.current = r; });
  };

  const clearVideo = () => {
    thumbnailBlobRef.current = null;
    resolutionRef.current = "";
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

  return (
    <div className="container mx-auto max-w-3xl py-8 space-y-6">
      <h1 className="text-2xl font-bold">Upload video</h1>

      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit((data) => upload(data))}
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
            {videoPreview ? (
              <div className="relative">
                <video
                  src={videoPreview}
                  controls
                  className="w-full max-h-72 object-contain bg-black"
                />
                <button
                  type="button"
                  onClick={clearVideo}
                  className="btn btn-circle btn-sm btn-error absolute top-2 right-2"
                >
                  <IconX size={14} />
                </button>
                <div className="p-3 flex items-center gap-2 bg-base-200 text-sm text-base-content/60">
                  <IconVideo size={14} />
                  <span className="truncate">{videoFile?.name}</span>
                  <span className="ml-auto shrink-0">
                    {(videoFile!.size / 1024 / 1024).toFixed(1)} MB
                  </span>
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
            videoSrc={videoPreview}
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
              onClick={() => {
                form.reset();
                clearVideo();
              }}
            >
              Reset
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isPending}
            >
              {isPending ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                <IconUpload size={16} />
              )}
              Upload
            </button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
