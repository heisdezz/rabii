import { useNavigate } from "@tanstack/react-router";
import { Route } from "../index";

export type SortOption = "newest" | "oldest" | "title_asc" | "title_desc";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "title_asc", label: "Title A–Z" },
  { value: "title_desc", label: "Title Z–A" },
];

export const SORT_MAP: Record<SortOption, string> = {
  newest: "-created",
  oldest: "created",
  title_asc: "title",
  title_desc: "-title",
};

interface BrowserFiltersProps {
  sort: SortOption;
  total?: number;
}

export default function BrowserFilters({ sort, total }: BrowserFiltersProps) {
  const navigate = useNavigate({ from: Route.fullPath });

  const setSort = (value: SortOption) => {
    navigate({ search: (prev) => ({ ...prev, sort: value, page: 1 }) });
  };

  return (
    <div className="flex items-center justify-between gap-3 flex-wrap">
      {/* Result count */}
      {total !== undefined && (
        <p className="text-sm text-base-content/50">
          {total} {total === 1 ? "video" : "videos"} found
        </p>
      )}

      {/* Sort pills */}
      <div className="flex items-center gap-1.5 ml-auto">
        <span className="text-xs text-base-content/40 uppercase tracking-wider font-medium mr-1">
          Sort
        </span>
        {SORT_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setSort(opt.value)}
            className={`btn btn-xs rounded-full transition-all ${
              sort === opt.value
                ? "btn-primary"
                : "btn-ghost text-base-content/60 hover:text-base-content"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
