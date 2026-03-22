import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { pb } from "#/client/pb";
import Card from "#/components/Card";
import Pagination from "#/components/Pagination";
import type { VideosResponse } from "pocketbase-types";
import CardContainer from "#/components/layouts/CardContainer";
import { IconVideo } from "@tabler/icons-react";

const PER_PAGE = 12;

export default function VideoList() {
  const [page, setPage] = useState(1);

  const query = useQuery({
    queryKey: ["videos", "list", page],
    queryFn: () =>
      pb
        .collection("videos")
        .getList(page, PER_PAGE, { sort: "-created" })
        .then((r) => ({ items: r.items as VideosResponse[], totalPages: r.totalPages, totalItems: r.totalItems })),
  });

  if (query.isLoading) {
    return (
      <section className="space-y-5">
        <div className="flex items-center gap-3">
          <div className="h-5 w-28 bg-base-200 rounded animate-pulse" />
          <div className="flex-1 h-px bg-base-200" />
        </div>
        <CardContainer>
          {Array.from({ length: PER_PAGE }).map((_, i) => (
            <div key={i} className="rounded-sleek bg-base-200 animate-pulse">
              <div className="aspect-video" />
              <div className="p-3 space-y-2">
                <div className="h-3 bg-base-300 rounded w-3/4" />
                <div className="h-2 bg-base-300 rounded w-1/3" />
              </div>
            </div>
          ))}
        </CardContainer>
      </section>
    );
  }

  if (query.isError || !query.data?.items.length) return null;

  const { items, totalPages, totalItems } = query.data;

  return (
    <section className="space-y-5">
      {/* Section header */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 shrink-0">
          <IconVideo size={16} className="text-base-content/40" />
          <h2 className="text-sm font-semibold text-base-content/60 uppercase tracking-wider">
            Latest Videos
          </h2>
          <span className="badge badge-sm badge-ghost text-base-content/40 font-mono">
            {totalItems}
          </span>
        </div>
        <div className="flex-1 h-px bg-base-content/8" />
      </div>

      <CardContainer>
        {items.map((video) => (
          <Card key={video.id} video={video} />
        ))}
      </CardContainer>

      <Pagination
        page={page}
        total={totalPages}
        onChange={(p) => {
          setPage(p);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />
    </section>
  );
}
