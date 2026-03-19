import { useEffect, useRef, useState } from "react";
import { IconCheck } from "@tabler/icons-react";

export type Frame = { url: string; blob: Blob };

/** Seeks to `count` random timestamps within the first 10s and yields frames one-by-one. */
async function* streamFrames(
  src: string,
  count = 10,
  signal?: AbortSignal,
): AsyncGenerator<Frame> {
  const video = document.createElement("video");
  video.src = src;
  video.muted = true;
  video.preload = "metadata";

  await new Promise<void>((resolve, reject) => {
    video.onloadedmetadata = () => resolve();
    video.onerror = () => reject(new Error("Video load error"));
  });

  const maxTime = Math.min(video.duration, 10);
  const timestamps = Array.from({ length: count }, () => Math.random() * maxTime).sort(
    (a, b) => a - b,
  );

  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext("2d")!;

  for (const t of timestamps) {
    if (signal?.aborted) break;

    video.currentTime = t;
    await new Promise<void>((resolve) => {
      video.onseeked = () => resolve();
    });

    if (signal?.aborted) break;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((res) =>
      canvas.toBlob(res, "image/jpeg", 0.85),
    );
    if (blob) yield { blob, url: URL.createObjectURL(blob) };
  }

  video.src = "";
}

// ---------------------------------------------------------------------------

interface ThumbnailPickerProps {
  videoSrc: string | null;
  onSelect: (blob: Blob | null) => void;
}

export default function ThumbnailPicker({ videoSrc, onSelect }: ThumbnailPickerProps) {
  const [frames, setFrames] = useState<Frame[]>([]);
  const [selected, setSelected] = useState(0);
  const [done, setDone] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    // cleanup previous run
    abortRef.current?.abort();
    frames.forEach((f) => URL.revokeObjectURL(f.url));
    setFrames([]);
    setSelected(0);
    setDone(false);
    onSelect(null);

    if (!videoSrc) return;

    const ac = new AbortController();
    abortRef.current = ac;

    (async () => {
      try {
        let first = true;
        for await (const frame of streamFrames(videoSrc, 10, ac.signal)) {
          if (ac.signal.aborted) break;
          setFrames((prev) => {
            const next = [...prev, frame];
            if (first) {
              onSelect(frame.blob);
              first = false;
            }
            return next;
          });
        }
      } finally {
        if (!ac.signal.aborted) setDone(true);
      }
    })();

    return () => {
      ac.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoSrc]);

  const handleSelect = (i: number) => {
    setSelected(i);
    onSelect(frames[i].blob);
  };

  if (!videoSrc) return null;

  return (
    <div className="card bg-base-200 shadow ring fade">
      <div className="card-body gap-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm">Select thumbnail</h3>
          {!done && (
            <span className="flex items-center gap-2 text-xs text-base-content/50">
              <span className="loading loading-spinner loading-xs" />
              Extracting frames…
            </span>
          )}
        </div>

        <div className="grid grid-cols-5 gap-2">
          {frames.map((frame, i) => (
            <button
              key={frame.url}
              type="button"
              onClick={() => handleSelect(i)}
              className={`relative rounded-box overflow-clip aspect-video ring-2 transition-all ${
                selected === i
                  ? "ring-primary"
                  : "ring-transparent hover:ring-base-content/30"
              }`}
            >
              <img
                src={frame.url}
                className="w-full h-full object-cover"
                alt={`Frame ${i + 1}`}
              />
              {selected === i && (
                <div className="absolute inset-0 flex items-center justify-center bg-primary/20">
                  <IconCheck size={16} className="text-primary drop-shadow" />
                </div>
              )}
            </button>
          ))}

          {/* Skeleton slots while streaming */}
          {!done &&
            Array.from({ length: 10 - frames.length }).map((_, i) => (
              <div
                key={`sk-${i}`}
                className="aspect-video rounded-box bg-base-300 animate-pulse"
              />
            ))}
        </div>
      </div>
    </div>
  );
}
