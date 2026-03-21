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

export default function HeroSearchBar() {
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
    navigate({ to: "/app/browser/", search: { query: data.query } });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex items-center w-full max-w-2xl bg-base-100/80 backdrop-blur-md rounded-full shadow-xl ring ring-base-content/10 overflow-hidden px-2 py-2 gap-2"
    >
      <IconSearch size={20} className="ml-3 text-base-content/40 shrink-0" />
      <input
        {...register("query")}
        type="text"
        className="flex-1 bg-transparent outline-none text-lg placeholder:text-base-content/30 px-2 py-1"
        placeholder="Search for videos..."
        autoComplete="off"
      />
      <button
        type="submit"
        className="btn btn-primary rounded-full px-6 shrink-0"
      >
        Search
      </button>
    </form>
  );
}
