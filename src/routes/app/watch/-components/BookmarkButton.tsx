import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { pb } from "#/client/pb";
import { IconBookmark, IconBookmarkFilled } from "@tabler/icons-react";

export default function BookmarkButton({ id }: { id: string }) {
  const user = pb.authStore.record;
  const queryClient = useQueryClient();
  const genId = `${user?.id}${id}`;

  const { data, isLoading } = useQuery<{ data: boolean }>({
    queryKey: ["saved", genId],
    queryFn: () => pb.send(`/saved/${genId}`, { method: "GET" }),
    enabled: !!user,
  });

  const isSaved = data?.data ?? false;

  const toggle = useMutation({
    mutationFn: async () => {
      if (isSaved) {
        const record = await pb
          .collection("saved")
          .getFirstListItem(`user="${user?.id}" && video="${id}"`);
        return pb.collection("saved").delete(record.id);
      }
      const record = await pb
        .collection("saved")
        .create({ user: user?.id, video: id, gen_id: genId, id: genId });
      return record;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved", genId] });
      queryClient.invalidateQueries({ queryKey: ["saved-videos"] });
    },
  });

  if (!user) return null;

  return (
    <button
      type="button"
      onClick={() => toggle.mutate()}
      disabled={isLoading || toggle.isPending}
      className={`btn btn-sm btn-soft ring fade ${isSaved ? "btn-primary" : "btn-ghost"}`}
    >
      {toggle.isPending ? (
        <span className="loading loading-spinner loading-xs" />
      ) : isSaved ? (
        <IconBookmarkFilled size={15} />
      ) : (
        <IconBookmark size={15} />
      )}
      {isSaved ? "Saved" : "Save"}
    </button>
  );
}
