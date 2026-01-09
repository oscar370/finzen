import { useContext } from "react";
import { CarouselContext } from "../context/carousel-context";

export function useCarousel() {
  const context = useContext(CarouselContext);

  if (!context) {
    throw new Error("CarouselContext was not provided");
  }

  return context;
}
