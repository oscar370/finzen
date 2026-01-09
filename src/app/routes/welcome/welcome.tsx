import { Carousel } from "@/components/ui/carousel";
import { FirstAccount } from "@/features/accounts";
import { CurrencyForm } from "@/features/currency";
import { Toaster } from "react-hot-toast";

export function Welcome() {
  return (
    <>
      <Carousel>
        <Carousel.Previous className="absolute top-3/4 left-1/4 z-5 sm:top-1/2 sm:left-6" />

        <Carousel.Content>
          <main className="mx-auto flex h-dvh max-w-150 items-center justify-center px-1">
            <CurrencyForm />
          </main>

          <main className="mx-auto flex h-dvh max-w-150 items-center justify-center px-1">
            <FirstAccount />
          </main>
        </Carousel.Content>

        <Carousel.Next className="absolute top-3/4 right-1/4 z-5 sm:top-1/2 sm:right-6" />
      </Carousel>

      <Toaster
        toastOptions={{
          className:
            "bg-[color-mix(in_srgb,var(--background),var(--text)_15%)]!  text-(--text)!",
        }}
      />
    </>
  );
}
