import useEmblaCarousel from "embla-carousel-react";
import { useQuery } from "@tanstack/react-query";
import {
  IconChevronLeft,
  IconChevronRight,
  IconPlayerPlay,
  IconUser,
  IconSparkles,
} from "@tabler/icons-react";
import { pb } from "#/client/pb";
import { useCallback, useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { get_fiel_url } from "#/helpers/client";
import Pagination from "#/components/Pagination";
import type { UsersResponse, VideosResponse } from "pocketbase-types";

type VideoWithUser = VideosResponse<{ user: UsersResponse }>;

export default function Newest() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
  });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  const query = useQuery<VideoWithUser[]>({
    queryKey: ["videos", "newest"],
    queryFn: () =>
      pb
        .collection("videos")
        .getList(1, 5, { sort: "-created", expand: "user" })
        .then((r) => r.items as VideoWithUser[]),
  });

  if (query.isLoading) {
    return (
      <div className="w-full h-[80vh] sm:h-auto sm:aspect-[16/9] md:aspect-[21/9] rounded-sleek bg-base-200 animate-pulse" />
    );
  }

  if (query.isError || !query.data?.length) return <ComingSoonCarousel />;

  return (
    <section className="relative">
      {/* Slides */}
      <div className="overflow-hidden rounded-sleek" ref={emblaRef}>
        <div className="flex">
          {query.data.map((video) => (
            <HeroSlide key={video.id} video={video} />
          ))}
        </div>
      </div>

      {/* Arrows */}
      <button
        onClick={scrollPrev}
        aria-label="Previous"
        className="absolute left-3 top-1/2 -translate-y-1/2 btn btn-circle bg-black/40 backdrop-blur-md border-0 text-white hover:bg-black/70"
      >
        <IconChevronLeft size={20} />
      </button>
      <button
        onClick={scrollNext}
        aria-label="Next"
        className="absolute right-3 top-1/2 -translate-y-1/2 btn btn-circle bg-black/40 backdrop-blur-md border-0 text-white hover:bg-black/70"
      >
        <IconChevronRight size={20} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2">
        <Pagination
          variant="dots"
          page={selectedIndex}
          total={query.data.length}
          onChange={(i) => emblaApi?.scrollTo(i)}
        />
      </div>
    </section>
  );
}

const DUMMY_SLIDES = [
  { label: "Featured Content", blur: "from-primary/20 to-secondary/10" },
  { label: "Exclusive Videos", blur: "from-secondary/20 to-accent/10" },
  { label: "Latest Uploads", blur: "from-accent/20 to-primary/10" },
];

function ComingSoonCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "center" });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    return () => { emblaApi.off("select", onSelect); };
  }, [emblaApi]);

  return (
    <section className="relative">
      <div className="overflow-hidden rounded-sleek" ref={emblaRef}>
        <div className="flex">
          {DUMMY_SLIDES.map((slide, i) => (
            <div
              key={i}
              className={`relative flex-none w-full h-[80vh] sm:h-auto sm:aspect-[16/9] md:aspect-[21/9] overflow-clip bg-base-300 bg-gradient-to-br ${slide.blur}`}
            >
              {/* Decorative blobs */}
              <div className="absolute top-1/4 left-1/4 w-48 h-48 rounded-full bg-primary/10 blur-3xl" />
              <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-secondary/10 blur-3xl" />
              {/* Faint grid pattern */}
              <div className="absolute inset-0 opacity-5"
                style={{ backgroundImage: "repeating-linear-gradient(0deg,currentColor,currentColor 1px,transparent 1px,transparent 40px),repeating-linear-gradient(90deg,currentColor,currentColor 1px,transparent 1px,transparent 40px)" }}
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              {/* Center content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                <div className="flex items-center gap-2 text-white/30">
                  <IconSparkles size={18} />
                  <span className="text-xs uppercase tracking-widest font-semibold">{slide.label}</span>
                  <IconSparkles size={18} />
                </div>
                <p className="text-white/15 font-bold text-4xl sm:text-5xl tracking-tight">Coming Soon</p>
                <p className="text-white/25 text-sm">No videos have been uploaded yet</p>
              </div>
              {/* Bottom label */}
              <div className="absolute bottom-0 left-0 right-0 px-7 pb-10">
                <p className="text-white/20 text-xs uppercase tracking-widest font-semibold mb-1">New</p>
                <div className="h-5 w-48 rounded bg-white/5" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={scrollPrev}
        aria-label="Previous"
        className="absolute left-3 top-1/2 -translate-y-1/2 btn btn-circle bg-black/20 backdrop-blur-md border-0 text-white/40 cursor-default"
        tabIndex={-1}
      >
        <IconChevronLeft size={20} />
      </button>
      <button
        onClick={scrollNext}
        aria-label="Next"
        className="absolute right-3 top-1/2 -translate-y-1/2 btn btn-circle bg-black/20 backdrop-blur-md border-0 text-white/40 cursor-default"
        tabIndex={-1}
      >
        <IconChevronRight size={20} />
      </button>

      <div className="absolute bottom-5 left-1/2 -translate-x-1/2">
        <Pagination
          variant="dots"
          page={selectedIndex}
          total={DUMMY_SLIDES.length}
          onChange={(i) => emblaApi?.scrollTo(i)}
        />
      </div>
    </section>
  );
}

function HeroSlide({ video }: { video: VideoWithUser }) {
  const thumbUrl = video.thumbnail
    ? get_fiel_url(video, video.thumbnail)
    : null;
  const user = video.expand?.user;
  const avatarUrl = user?.avatar ? get_fiel_url(user, user.avatar) : null;

  return (
    <Link
      to="/app/watch/$videoid"
      params={{ videoid: video.id }}
      className="group relative flex-none w-full h-[80vh] sm:h-auto sm:aspect-[16/9] md:aspect-[21/9] overflow-clip bg-base-300"
    >
      {thumbUrl ? (
        <img
          src={thumbUrl}
          alt={video.title}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-base-content/10">
          <IconPlayerPlay size={72} strokeWidth={1} />
        </div>
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

      {/* Play button center hover */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <div className="btn btn-primary btn-lg btn-circle shadow-xl">
          <IconPlayerPlay size={24} />
        </div>
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 px-7 pb-10 pt-4">
        <p className="text-xs text-white/60 uppercase tracking-widest font-semibold mb-1">
          New
        </p>
        <h3 className="text-white font-bold text-2xl leading-snug line-clamp-2 drop-shadow mb-3">
          {video.title || "Untitled"}
        </h3>
        {/* User details */}
        {user && (
          <div className="flex items-center gap-2 mb-2">
            <div className="avatar">
              <div className="w-7 h-7 rounded-full bg-base-content/20 overflow-hidden ring-1 ring-white/20">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/50">
                    <IconUser size={14} />
                  </div>
                )}
              </div>
            </div>
            <span className="text-white/80 text-sm font-medium">
              {user.name || "Unknown"}
            </span>
            <span className="text-white/30 text-sm">·</span>
            <span className="text-white/50 text-sm">
              {new Date(video.created).toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
        )}
        {!user && (
          <p className="text-white/50 text-sm">
            {new Date(video.created).toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </p>
        )}
      </div>
    </Link>
  );
}
