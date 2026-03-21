import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { pb } from "#/client/pb";
import {
  IconThumbUp,
  IconThumbUpFilled,
  IconThumbDown,
  IconThumbDownFilled,
} from "@tabler/icons-react";
import type { LikesResponse, VideosResponse } from "pocketbase-types";

type LikeStatus = { data: "liked" | "disliked" | null };

export default function LikeDislike({ video }: { video: VideosResponse }) {
  const user = pb.authStore.record;
  const queryClient = useQueryClient();

  const { data } = useQuery<LikeStatus>({
    queryKey: ["liked", video.id],
    queryFn: () => pb.send(`/liked/${video.id}`, { method: "GET" }),
    enabled: !!user,
  });

  const { data: videoLikes } = useQuery<LikesResponse>({
    queryKey: ["likes", video.id],
    queryFn: () => pb.collection("likes").getOne(video.id),
  });

  const status = data?.data ?? null;
  const mutate = useMutation({
    mutationFn: (value: 1 | -1) => {
      if (value === 1) {
        const endpoint = status === "liked" ? "remove_like" : "like";
        return pb.send(`/${endpoint}/${video.id}`, { method: "POST" });
      } else {
        const endpoint = status === "disliked" ? "remove_like" : "dislike";
        return pb.send(`/${endpoint}/${video.id}`, { method: "POST" });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["likes", video.id] });
      queryClient.invalidateQueries({ queryKey: ["liked", video.id] });
    },
  });

  const likes = videoLikes?.likes_count ?? 0;
  const dislikes = videoLikes?.dislikes_count ?? 0;

  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={() => user && mutate.mutate(1)}
        disabled={mutate.isPending}
        className={`btn btn-sm btn-soft ring fade gap-1.5 ${status === "liked" ? "btn-success" : "btn-ghost"}`}
      >
        {status === "liked" ? (
          <IconThumbUpFilled size={15} />
        ) : (
          <IconThumbUp size={15} />
        )}
        <span>{likes}</span>
      </button>
      <button
        type="button"
        onClick={() => user && mutate.mutate(-1)}
        disabled={mutate.isPending}
        className={`btn btn-sm btn-soft ring fade gap-1.5 ${status === "disliked" ? "btn-error" : "btn-ghost"}`}
      >
        {status === "disliked" ? (
          <IconThumbDownFilled size={15} />
        ) : (
          <IconThumbDown size={15} />
        )}
        <span>{dislikes}</span>
      </button>
    </div>
  );
}
