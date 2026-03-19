import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { pb } from "#/client/pb";
import Card from "#/components/Card";
import Pagination from "#/components/Pagination";
import type { VideosResponse } from "pocketbase-types";
import CardContainer from "#/components/layouts/CardContainer";

const PER_PAGE = 12;

export default function VideoList() {
  const [page, setPage] = useState(1);

  const query = useQuery({
    queryKey: ["videos", "list", page],
    queryFn: () =>
      pb
        .collection("videos")
        .getList(page, PER_PAGE, { sort: "-created" })
        .then((r) => ({ items: r.items as VideosResponse[], totalPages: r.totalPages })),
  });

  if (query.isLoading) {
    return (
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
    );
  }

  if (query.isError || !query.data?.items.length) return null;

  const { items, totalPages } = query.data;

  return (
    <div className="space-y-6">
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
    </div>
  );
}
