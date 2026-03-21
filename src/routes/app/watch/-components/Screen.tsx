import { ClientOnly, Link } from "@tanstack/react-router";
import { get_fiel_url } from "#/helpers/client";
import type { VideosResponse } from "pocketbase-types";
import VideoPlayer from "#/components/VideoPlayer";

export default function WatchScreen({ resp }: { resp: VideosResponse }) {
  const videoUrl = resp.video ? get_fiel_url(resp, resp.video) : null;

  return (
    <div className="ring fade rounded-sleek shadow bg-base-200 overflow-clip w-full flex flex-col">
      {/* Breadcrumb */}
      <div className="p-4 border-b fade">
        <div className="p-0 breadcrumbs text-sm">
          <ul>
            <li>
              <Link to="/app">Home</Link>
            </li>
            <li>
              <Link disabled to="/app/watch">
                Watch
              </Link>
            </li>
            <li className="truncate max-w-xs">{resp.title || "Video"}</li>
          </ul>
        </div>
      </div>

      <section className="player bg-black">
        {videoUrl ? (
          <ClientOnly
            fallback={
              <div className="aspect-video min-h-48 sm:min-h-64 flex items-center justify-center text-white/20 text-sm">
                Loading player…
              </div>
            }
          >
            <>
              <VideoPlayer
                src={videoUrl}
                poster={
                  resp.thumbnail
                    ? get_fiel_url(resp, resp.thumbnail)
                    : undefined
                }
              />
            </>
          </ClientOnly>
        ) : (
          <div className="aspect-video min-h-48 sm:min-h-64 flex items-center justify-center text-white/30 text-sm">
            No video available
          </div>
        )}
      </section>

      {/* Title bar */}
      <div className="p-4 border-t fade mt-auto">
        <h2 className="font-bold text-lg">{resp.title || "Untitled"}</h2>
        <p className="text-xs text-base-content/50 mt-1">
          {new Date(resp.created).toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>
    </div>
  );
}
