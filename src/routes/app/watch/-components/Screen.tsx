import { Link } from "@tanstack/react-router";
import { get_fiel_url } from "#/helpers/client";
import type { VideosResponse } from "pocketbase-types";

export default function WatchScreen({ resp }: { resp: VideosResponse }) {
  const videoUrl = resp.video ? get_fiel_url(resp, resp.video) : null;

  return (
    <div className="ring fade rounded-sleek shadow bg-base-200 overflow-clip w-full aspect-video flex flex-col ">
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

      <section className="player flex-1 flex  min-h-0 bg-base-300 ">
        {videoUrl ? (
          <video
            src={videoUrl}
            controls
            className="object-contain size-full"
            preload="metadata"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/30 text-sm">
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
