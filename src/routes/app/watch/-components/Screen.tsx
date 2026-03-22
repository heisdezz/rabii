import { ClientOnly, Link } from "@tanstack/react-router";
import { IconHome, IconChevronRight } from "@tabler/icons-react";
import { get_fiel_url } from "#/helpers/client";
import type { VideosResponse } from "pocketbase-types";
import VideoPlayer from "#/components/VideoPlayer";

export default function WatchScreen({ resp }: { resp: VideosResponse }) {
  const videoUrl = resp.video ? get_fiel_url(resp, resp.video) : null;

  return (
    <div className="rounded-sleek shadow bg-black overflow-clip w-full">
      {videoUrl ? (
        <ClientOnly
          fallback={
            <div className="aspect-video flex items-center justify-center text-white/20 text-sm">
              Loading player…
            </div>
          }
        >
          <VideoPlayer
            src={videoUrl}
            poster={
              resp.thumbnail ? get_fiel_url(resp, resp.thumbnail) : undefined
            }
          />
        </ClientOnly>
      ) : (
        <div className="aspect-video flex items-center justify-center text-white/30 text-sm">
          No video available
        </div>
      )}
    </div>
  );
}

export function VideoBreadcrumb({ title }: { title?: string }) {
  return (
    <div className="ring fade rounded-sleek bg-base-200 px-4 py-2.5 flex items-center gap-1.5 text-xs text-base-content/40">
      <Link to="/app" className="flex items-center gap-1 hover:text-base-content transition-colors">
        <IconHome size={12} />
        Home
      </Link>
      <IconChevronRight size={11} className="shrink-0" />
      <span className="hover:text-base-content transition-colors cursor-default">Watch</span>
      <IconChevronRight size={11} className="shrink-0" />
      <span className="text-base-content/70 truncate">{title || "Video"}</span>
    </div>
  );
}
