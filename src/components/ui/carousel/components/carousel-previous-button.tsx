import { useCarousel } from "../hooks/use-carousel";

type CarouselButtonsProps = {
  className?: string;
};

export function CarouselPreviousButton({
  className = "",
}: CarouselButtonsProps) {
  const { step, setStep, setDirection } = useCarousel();

  function handlePrevious() {
    setStep((prev) => (prev === 0 ? 0 : prev - 1));
    setDirection(-1);
  }

  return (
    <button
      className={`fit cursor-pointer rounded-full bg-(--secondary) p-2 px-2 text-sm shadow-none hover:bg-(--secondary-hover) disabled:hidden ${className}`}
      aria-label="previous-slide"
      disabled={step === 0}
      onClick={handlePrevious}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="16px"
        viewBox="0 0 16 16"
        width="16px"
      >
        <path
          d="m 9.292969 13.707031 l -5 -5 c -0.390625 -0.390625 -0.390625 -1.023437 0 -1.414062 l 5 -5 c 0.390625 -0.390625 1.023437 -0.390625 1.414062 0 s 0.390625 1.023437 0 1.414062 l -4.292969 4.292969 l 4.292969 4.292969 c 0.390625 0.390625 0.390625 1.023437 0 1.414062 s -1.023437 0.390625 -1.414062 0 z m 0 0"
          fill="currentColor"
          fillRule="evenodd"
        />
      </svg>
    </button>
  );
}
