import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { get_fiel_url } from "#/helpers/client";
import { IconUser } from "@tabler/icons-react";
import { ClientOnly, Link } from "@tanstack/react-router";
import type { VideoWithUser } from "../$videoid";
import BookmarkButton from "./BookmarkButton";
import LikeDislike from "#/components/LikeDislike";

export default function ItemDetails({ resp }: { resp: VideoWithUser }) {
  const thumbUrl = resp.thumbnail ? get_fiel_url(resp, resp.thumbnail) : null;
  const blurUrl = thumbUrl ?? "/dummy.jpg";
  const [expanded, setExpanded] = useState(false);

  //@ts-ignore
  const user = resp.expand?.user;
  const avatarUrl = user?.avatar ? get_fiel_url(user, user.avatar) : null;

  return (
    <div className="ring fade h-fit rounded-sleek overflow-clip flex flex-col sm:flex-row items-start">
      {/* Poster panel — landscape banner on mobile, portrait sidebar on sm+ */}
      <div className="w-full sm:w-auto sm:max-w-3xs sm:shrink-0 sm:self-start relative isolate flex items-center justify-center overflow-clip aspect-video sm:aspect-9/16">
        <img
          src={blurUrl}
          alt=""
          className="absolute inset-0 h-full w-full object-cover -z-10 blur-md brightness-50"
        />
        <img
          src={blurUrl}
          alt={resp.title}
          className="h-4/5 sm:w-4/5 sm:h-auto aspect-9/16 z-10 shadow-2xl rounded-sleek object-cover"
        />
      </div>

      {/* Details */}
      <div className="p-4 sm:p-6 space-y-3 flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <h2 className="font-bold text-xl sm:text-2xl">
            {resp.title || "Untitled"}
          </h2>

          <div className="flex items-center gap-2 shrink-0">
            <ClientOnly>
              <LikeDislike video={resp} />
            </ClientOnly>
            <ClientOnly>
              <BookmarkButton id={resp.id} />
            </ClientOnly>
          </div>
        </div>
        {(resp as any).expand?.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1">
            {(resp as any).expand.tags.map((tag: { id: string; name: string }) => (
              <button
                key={tag.id}
                className="btn btn-xs ring btn-secondary btn-soft fade"
              >
                #{tag.name}
              </button>
            ))}
          </div>
        )}
        {/*{JSON.stringify(resp.expand)}*/}
        {/* Owner info */}
        {user && (
          <Link
            to="/app/actor/$actorId"
            params={{ actorId: user.id }}
            className="flex items-center gap-2.5 w-fit hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 rounded-full bg-base-300 overflow-hidden ring-1 ring-base-content/10 shrink-0 flex items-center justify-center">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <IconUser size={15} className="text-base-content/40" />
              )}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium leading-tight truncate">
                {user.name || "Unknown"}
              </p>
              <p className="text-xs text-base-content/40 leading-tight">
                {new Date(resp.created).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </Link>
        )}

        {resp.description ? (
          <div className="space-y-1">
            <div
              className={`prose prose-sm prose-invert max-w-none opacity-80 overflow-hidden transition-[max-height] duration-500 ease-in-out ${
                expanded ? "max-h-[2000px]" : "max-h-68"
              }`}
            >
              <ReactMarkdown>{resp.description}</ReactMarkdown>
            </div>
            <div
              className={`-mt-6 h-8 bg-gradient-to-t from-base-100/80 to-transparent pointer-events-none transition-opacity duration-300 ${
                expanded ? "opacity-0" : "opacity-100"
              }`}
            />
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="btn btn-secondary btn-block btn-sm btn-soft ring fade"
            >
              {expanded ? "Show less" : "View more"}
            </button>
          </div>
        ) : (
          <p className="opacity-40 text-sm italic">No description.</p>
        )}

        {!user && (
          <p className="text-xs text-base-content/40 pt-2">
            Uploaded{" "}
            {new Date(resp.created).toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        )}
      </div>
    </div>
  );
}
