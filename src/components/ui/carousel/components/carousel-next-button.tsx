import { useCarousel } from "../hooks/use-carousel";

type CarouselButtonsProps = {
  className?: string;
};

export function CarouselNextButton({ className = "" }: CarouselButtonsProps) {
  const { step, total, setStep, setDirection } = useCarousel();

  function handleNext() {
    setStep((prev) => (prev === total ? prev : prev + 1));
    setDirection(1);
  }

  return (
    <button
      className={`w-fit cursor-pointer rounded-full bg-(--secondary) p-2 px-2 text-sm shadow-none hover:bg-(--secondary-hover) disabled:hidden ${className}`}
      aria-label="next-slide"
      disabled={step === total}
      onClick={handleNext}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="16px"
        viewBox="0 0 16 16"
        width="16px"
      >
        <path
          d="m 6.707031 13.707031 l 5 -5 c 0.390625 -0.390625 0.390625 -1.023437 0 -1.414062 l -5 -5 c -0.390625 -0.390625 -1.023437 -0.390625 -1.414062 0 s -0.390625 1.023437 0 1.414062 l 4.292969 4.292969 l -4.292969 4.292969 c -0.390625 0.390625 -0.390625 1.023437 0 1.414062 s 1.023437 0.390625 1.414062 0 z m 0 0"
          fill="currentColor"
          fillRule="evenodd"
        />
      </svg>
    </button>
  );
}
