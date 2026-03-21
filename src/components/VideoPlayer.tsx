import { Player } from "react-tuby";
import "react-tuby/css/main.css";

interface VideoPlayerProps {
  src: string;
  poster?: string;
}

export default function VideoPlayer({ src, poster }: VideoPlayerProps) {
  return (
    <Player
      src={[{ quality: "Default", url: src }]}
      poster={poster}
    />
  );
}
