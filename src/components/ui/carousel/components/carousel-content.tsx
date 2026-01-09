import { AnimatePresence, motion, type PanInfo } from "motion/react";
import { Children, useEffect } from "react";
import { useCarousel } from "../hooks/use-carousel";

type CarouselContentProps = {
  children: React.ReactNode;
};

export function CarouselContent({ children }: CarouselContentProps) {
  const { step, total, setTotal, direction, setDirection, setStep } =
    useCarousel();
  const items = Children.toArray(children);

  useEffect(() => {
    setTotal(items.length - 1);
  }, [items.length, setTotal]);

  function handleDragEnd(
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) {
    const swipeThreshold = 100;
    const swipePower = Math.abs(info.offset.x) * info.velocity.x;

    if (swipePower < -swipeThreshold && step < total) {
      setDirection(1);
      setStep(step + 1);
    } else if (swipePower > swipeThreshold && step > 0) {
      setDirection(-1);
      setStep(step - 1);
    }
  }

  return (
    <div style={{ position: "relative", overflow: "hidden" }}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={step}
          custom={direction}
          initial="enter"
          animate="center"
          exit="exit"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={handleDragEnd}
          transition={{
            x: { type: "tween" },
            opacity: { duration: 0.1 },
          }}
          variants={{
            enter: (direction: number) => ({
              x: direction > 0 ? -100 : 100,
              opacity: 0,
            }),
            center: { x: 0, opacity: 1 },
            exit: (direction: number) => ({
              x: direction < 0 ? -100 : 100,
              opacity: 0,
            }),
          }}
        >
          {items[step]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
