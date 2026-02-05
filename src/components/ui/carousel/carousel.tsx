import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

type CarouselProps = {
  slides: React.ReactNode[];
  autoPlay?: boolean;
  interval?: number;
  label?: string;
};

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) =>
  Math.abs(offset) * velocity;

export function Carousel({
  slides,
  autoPlay = false,
  interval = 5000,
  label,
}: CarouselProps) {
  const [[page, direction], setPage] = useState([0, 0]);
  const [isPaused, setIsPaused] = useState(false);
  const slideIndex = ((page % slides.length) + slides.length) % slides.length;
  const shouldReduceMotion = useReducedMotion();
  const { t } = useTranslation("arias");

  const paginate = useCallback(
    (newDirection: number) => {
      setPage([page + newDirection, newDirection]);
    },
    [page],
  );

  useEffect(() => {
    if (!autoPlay || isPaused) return;
    const timer = setTimeout(() => paginate(1), interval);
    return () => clearTimeout(timer);
  }, [page, isPaused, autoPlay, interval, paginate]);

  const variants = {
    enter: (direction: number) => ({
      x: shouldReduceMotion ? 0 : direction > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: shouldReduceMotion ? 0 : direction < 0 ? "100%" : "-100%",
      opacity: 0,
    }),
  };

  function handleKeyDown(e: React.KeyboardEvent) {
    const target = e.target as HTMLElement;
    const isInput = target.closest(
      'input, textarea, select, [contenteditable="true"]',
    );

    if (isInput) return;

    if (e.key === "ArrowLeft") paginate(-1);
    if (e.key === "ArrowRight") paginate(1);
  }

  return (
    <div
      className="group relative h-full w-full overflow-hidden rounded-2xl"
      aria-roledescription={t("carousel.label")}
      aria-label={label || t("carousel.label")}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      tabIndex={0}
    >
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {`Showing slide number ${slideIndex + 1} of ${slides.length}`}
      </div>

      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={page}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "tween" },
            opacity: { duration: 0.3 },
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          onDragEnd={(_, { offset, velocity }) => {
            const swipe = swipePower(offset.x, velocity.x);
            if (swipe < -swipeConfidenceThreshold) {
              paginate(1);
            } else if (swipe > swipeConfidenceThreshold) {
              paginate(-1);
            }
          }}
          role="group"
          aria-roledescription={t("carouse.slide-label")}
          aria-label={`${slideIndex + 1} of ${slides.length}`}
          className="h-full w-full cursor-grab touch-none active:cursor-grabbing"
        >
          {slides[slideIndex]}
        </motion.div>
      </AnimatePresence>

      <div className="group pointer-events-none absolute inset-0 z-5 flex items-center justify-between px-2">
        <div className="flex -translate-x-20 items-center justify-center overflow-hidden rounded-full bg-(--accent) opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100">
          <button
            className="pointer-events-auto cursor-pointer p-1 text-white transition-colors hover:bg-(--hover)"
            onClick={() => paginate(-1)}
            aria-label={t("carousel.previous-label")}
          >
            <ChevronLeft />
          </button>
        </div>

        <div className="flex translate-x-20 items-center justify-center overflow-hidden rounded-full bg-(--accent) opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100">
          <button
            className="pointer-events-auto cursor-pointer p-1 text-white transition-colors hover:bg-(--hover)"
            onClick={() => paginate(1)}
            aria-label={t("carousel.next-label")}
          >
            <ChevronRight />
          </button>
        </div>
      </div>

      <div
        className="absolute right-0 bottom-2 left-0 z-5 flex justify-center gap-0.5"
        role="tablist"
      >
        {slides.map((_, index) => (
          <button
            key={index}
            role="tab"
            aria-selected={index === slideIndex}
            aria-label={`${t("carousel.tab-label")} ${index + 1}`}
            onClick={() => {
              const dir = index > slideIndex ? 1 : -1;
              setPage([page + (index - slideIndex), dir]);
            }}
            className="group px-0.5 focus:outline-none"
          >
            <span
              className={`block h-2 rounded-full transition-all duration-300 ${
                index === slideIndex
                  ? "w-8 bg-white"
                  : "w-2 bg-white/40 group-hover:bg-white/70"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
