import { useMemo, useState } from "react";
import { CarouselContent } from "./components/carousel-content";
import { CarouselNextButton } from "./components/carousel-next-button";
import { CarouselPreviousButton } from "./components/carousel-previous-button";
import { CarouselContext } from "./context/carousel-context";

type CarouselProps = {
  children: React.ReactNode;
};

export function Carousel({ children }: CarouselProps) {
  const [step, setStep] = useState(0);
  const [total, setTotal] = useState(0);
  const [direction, setDirection] = useState(0);

  const data = useMemo(
    () => ({ step, total, direction, setStep, setTotal, setDirection }),
    [step, total, direction],
  );

  return <CarouselContext value={data}>{children}</CarouselContext>;
}

Carousel.Content = CarouselContent;
Carousel.Previous = CarouselPreviousButton;
Carousel.Next = CarouselNextButton;
