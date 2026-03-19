import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { pb } from "#/client/pb";
import Card from "#/components/Card";
import CardContainer from "#/components/layouts/CardContainer";
import PageLoader from "#/components/layouts/PageLoader";
import Pagination from "#/components/Pagination";
import BrowserFilters, {
  SORT_MAP,
  type SortOption,
} from "./-components/BrowserFilters";
import type { VideosResponse } from "pocketbase-types";
import { IconSearch } from "@tabler/icons-react";

const PER_PAGE = 20;

export const Route = createFileRoute("/app/browser/")({
  component: RouteComponent,
  validateSearch: (
    search: Record<string, string>,
  ): { query?: string; sort?: SortOption; page?: number } => {
    const sort = search.sort as SortOption;
    const validSort: SortOption[] = ["newest", "oldest", "title_asc", "title_desc"];
    const page = parseInt(search.page ?? "1", 10);
    return {
      query: search.query,
      sort: validSort.includes(sort) ? sort : "newest",
      page: page > 0 ? page : 1,
    };
  },
  head: ({ match }) => {
    const q = (match.search as { query?: string }).query;
    return {
      meta: [
        {
          title: q ? `Results for "${q}" — Browse` : "Browse Videos",
        },
        {
          name: "description",
          content: q
            ? `Search results for "${q}" on Rabii`
            : "Browse all videos on Rabii",
        },
      ],
    };
  },
});

function RouteComponent() {
  const { query, sort = "newest", page = 1 } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });

  const videosQuery = useQuery({
    queryKey: ["videos", "browser", query, sort, page],
    queryFn: () =>
      pb
        .collection("videos")
        .getList(page, PER_PAGE, {
          sort: SORT_MAP[sort],
          filter: query ? `title ~ "${query}"` : "",
        })
        .then((r) => ({
          items: r.items as VideosResponse[],
          totalPages: r.totalPages,
          totalItems: r.totalItems,
        })),
  });

  const goToPage = (p: number) => {
    navigate({ search: (prev) => ({ ...prev, page: p }) });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="container page-wrap mx-auto space-y-5">
      {/* Page header */}
      <div className="space-y-1">
        {query ? (
          <>
            <div className="flex items-center gap-2 text-base-content/50">
              <IconSearch size={15} />
              <span className="text-sm">Search results for</span>
            </div>
            <h1 className="text-2xl font-bold">&ldquo;{query}&rdquo;</h1>
          </>
        ) : (
          <h1 className="text-2xl font-bold">Browse</h1>
        )}
      </div>

      <PageLoader query={videosQuery}>
        {({ items, totalPages, totalItems }) => (
          <div className="space-y-5">
            <BrowserFilters sort={sort} total={totalItems} />

            {items.length === 0 ? (
              <div className="py-20 flex flex-col items-center gap-3 text-base-content/40">
                <IconSearch size={40} strokeWidth={1.5} />
                <p className="text-base font-medium">
                  {query ? `No results for "${query}"` : "No videos yet"}
                </p>
                {query && (
                  <p className="text-sm">Try a different search term</p>
                )}
              </div>
            ) : (
              <>
                <CardContainer>
                  {items.map((video) => (
                    <Card key={video.id} video={video} />
                  ))}
                </CardContainer>
                <Pagination page={page} total={totalPages} onChange={goToPage} />
              </>
            )}
          </div>
        )}
      </PageLoader>
    </div>
  );
}
