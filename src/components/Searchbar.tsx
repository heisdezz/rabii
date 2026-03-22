import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { IconSearch } from "@tabler/icons-react";
import { useEffect } from "react";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";

const SearchSchema = z.object({
  query: z.string().min(0, "Search query must be at least 2 characters"),
});

type SearchFormData = z.infer<typeof SearchSchema>;

export default function SearchBar() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SearchFormData>({
    resolver: zodResolver(SearchSchema),
  });

  useEffect(() => {
    errors.query && toast.error(errors.query.message);
  }, [errors.query]);

  const onSubmit = (data: SearchFormData) => {
    navigate({
      to: "/app/browser/",
      search: (prev) => ({
        ...prev,
        query: data.query || undefined,
        page: 1,
      }),
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2 w-full min-w-0">
      <label className="input input-bordered flex items-center gap-2 flex-1 min-w-0">
        <input
          {...register("query")}
          type="text"
          className="grow min-w-0"
          placeholder="Search..."
        />
      </label>

      <button
        type="submit"
        className="btn btn-primary btn-square btn-soft ring fade "
      >
        <IconSearch />
      </button>
    </form>
  );
}
