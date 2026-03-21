import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { IconHash, IconSearch, IconX } from "@tabler/icons-react";
import { pb } from "#/client/pb";
import type { TagsResponse } from "pocketbase-types";

interface TagSearchBarProps {
  selected: string[]; // tag IDs from URL
  onChange: (ids: string[]) => void; // emits tag IDs, called only on apply
}

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export default function TagSearchBar({ selected, onChange }: TagSearchBarProps) {
  const [local, setLocal] = useState<TagsResponse[]>([]);
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Resolve selected IDs → full tag objects for display
  useQuery<TagsResponse[]>({
    queryKey: ["tags", "by-ids", selected.join(",")],
    queryFn: () => {
      if (!selected.length) return Promise.resolve([]);
      const filter = selected.map((id) => `id = "${id}"`).join(" || ");
      return pb.collection("tags").getList(1, selected.length, { filter }).then((r) => r.items);
    },
    enabled: selected.length > 0,
    onSuccess: (data) => setLocal(data),
  } as any);

  // Reset local when selected clears externally
  useEffect(() => {
    if (selected.length === 0) setLocal([]);
  }, [selected.length]);

  const debouncedInput = useDebounce(input.trim(), 250);

  const { data: suggestions = [] } = useQuery<TagsResponse[]>({
    queryKey: ["tags", "search", debouncedInput],
    queryFn: () =>
      pb
        .collection("tags")
        .getList(1, 12, {
          filter: debouncedInput ? `name ~ "${debouncedInput}"` : "",
          sort: "name",
        })
        .then((r) => r.items),
    enabled: open,
  });

  // close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function addTag(tag: TagsResponse) {
    if (local.some((t) => t.id === tag.id)) return;
    setLocal((prev) => [...prev, tag]);
    setInput("");
    inputRef.current?.focus();
  }

  function removeTag(id: string) {
    setLocal((prev) => prev.filter((t) => t.id !== id));
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && input.trim()) {
      e.preventDefault();
      const exact = suggestions.find(
        (s) => s.name?.toLowerCase() === input.trim().toLowerCase(),
      );
      if (exact) addTag(exact);
    }
    if (e.key === "Backspace" && !input && local.length) {
      removeTag(local[local.length - 1].id);
    }
    if (e.key === "Escape") setOpen(false);
  }

  function apply() {
    onChange(local.map((t) => t.id));
    setOpen(false);
  }

  const localIds = local.map((t) => t.id);
  const filtered = suggestions.filter((s) => !localIds.includes(s.id));
  const isDirty = localIds.join(",") !== selected.join(",");

  return (
    <div ref={containerRef} className="relative w-full flex gap-2">
      {/* Input box */}
      <div
        className="flex flex-1 flex-wrap items-center gap-1.5 min-h-10 px-3 py-2 rounded-sleek ring fade bg-base-200 cursor-text focus-within:ring-primary/40"
        onClick={() => {
          inputRef.current?.focus();
          setOpen(true);
        }}
      >
        <IconSearch size={14} className="text-base-content/40 shrink-0" />

        {local.map((tag) => (
          <span
            key={tag.id}
            className="flex items-center gap-1 badge badge-sm badge-secondary badge-soft pl-1.5 pr-1"
          >
            <IconHash size={10} />
            {tag.name}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeTag(tag.id);
              }}
              className="hover:text-error transition-colors"
            >
              <IconX size={10} />
            </button>
          </span>
        ))}

        <input
          ref={inputRef}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={local.length ? "" : "Filter by tags…"}
          className="flex-1 min-w-24 bg-transparent outline-none text-sm placeholder:text-base-content/30"
        />

        {local.length > 0 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setLocal([]);
            }}
            className="ml-auto text-base-content/30 hover:text-base-content/60 transition-colors"
            title="Clear all"
          >
            <IconX size={14} />
          </button>
        )}
      </div>

      {/* Apply button */}
      <button
        type="button"
        onClick={apply}
        disabled={!isDirty && local.length === 0}
        className="btn btn-primary btn-soft ring fade shrink-0"
      >
        Search
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute top-full z-50 mt-1 w-full rounded-sleek ring fade bg-base-200 shadow-xl overflow-clip">
          {filtered.length === 0 ? (
            <p className="px-4 py-3 text-sm text-base-content/40">
              {debouncedInput
                ? `No tags matching "${debouncedInput}"`
                : "Start typing to search tags"}
            </p>
          ) : (
            <ul>
              {filtered.map((tag) => (
                <li key={tag.id}>
                  <button
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      addTag(tag);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-base-300 transition-colors text-left"
                  >
                    <IconHash size={12} className="text-base-content/40 shrink-0" />
                    <span>{tag.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
