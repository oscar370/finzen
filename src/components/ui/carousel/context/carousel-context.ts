import { createContext } from "react";

type TCarouselContext = {
  step: number;
  total: number;
  direction: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  setTotal: React.Dispatch<React.SetStateAction<number>>;
  setDirection: React.Dispatch<React.SetStateAction<number>>;
};

export const CarouselContext = createContext<TCarouselContext | null>(null);
