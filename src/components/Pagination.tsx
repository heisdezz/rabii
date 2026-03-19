import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";

interface PaginationProps {
  page: number;
  total: number;
  onChange: (page: number) => void;
  variant?: "pages" | "dots";
}

export default function Pagination({
  page,
  total,
  onChange,
  variant = "pages",
}: PaginationProps) {
  if (total <= 1) return null;

  if (variant === "dots") {
    return (
      <div className="flex gap-2 items-center justify-center">
        {Array.from({ length: total }).map((_, i) => (
          <button
            key={i}
            onClick={() => onChange(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`rounded-full transition-all duration-300 ${
              i === page
                ? "w-6 h-2 bg-primary"
                : "w-2 h-2 bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    );
  }

  const pages = buildPageRange(page, total);

  return (
    <div className="flex items-center justify-center gap-1">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        aria-label="Previous page"
        className="btn btn-sm btn-ghost btn-square disabled:opacity-30"
      >
        <IconChevronLeft size={16} />
      </button>

      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`ellipsis-${i}`} className="px-1 text-base-content/40 text-sm select-none">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p as number)}
            aria-current={p === page ? "page" : undefined}
            className={`btn btn-sm btn-square ${
              p === page ? "btn-primary" : "btn-ghost text-base-content/70"
            }`}
          >
            {p}
          </button>
        ),
      )}

      <button
        onClick={() => onChange(page + 1)}
        disabled={page === total}
        aria-label="Next page"
        className="btn btn-sm btn-ghost btn-square disabled:opacity-30"
      >
        <IconChevronRight size={16} />
      </button>
    </div>
  );
}

function buildPageRange(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | "...")[] = [1];

  if (current > 3) pages.push("...");

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);

  if (current < total - 2) pages.push("...");

  pages.push(total);
  return pages;
}
