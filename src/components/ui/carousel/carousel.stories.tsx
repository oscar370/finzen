import type { Meta, StoryObj } from "@storybook/react-vite";
import { Mail, Star } from "lucide-react";
import { Carousel } from "./carousel";

const meta = {
  component: Carousel,
} satisfies Meta<typeof Carousel>;

export default meta;
type Story = StoryObj<typeof Carousel>;

export const CarouselStory: Story = {
  render: () => {
    const slides = [<FirstSlide />, <SecondSlide />, <ThirdSlide />];

    return (
      <>
        <main className="aspect-video w-full">
          <Carousel slides={slides} />
        </main>
      </>
    );
  },
};

function FirstSlide() {
  return (
    <div className="h-full w-full bg-[linear-gradient(rgba(0,0,0,0.5),rgba(0,0,0,0.5)),url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')] bg-cover bg-center">
      <section className="flex flex-col justify-center p-12 text-white">
        <h2 className="mb-4 text-5xl font-bold tracking-tight drop-shadow-lg md:text-6xl">
          First Slide
        </h2>
        <p className="max-w-xl text-xl font-light text-gray-200 drop-shadow-md">
          Description
        </p>
        <button className="mt-8 w-fit rounded-full bg-white px-8 py-3 font-semibold text-gray-900 transition hover:bg-gray-200">
          Show more
        </button>
      </section>
    </div>
  );
}

function SecondSlide() {
  return (
    <section className="flex h-full flex-col items-center justify-center bg-indigo-600 p-8 text-center text-white">
      <Star className="mb-6 h-12 w-12 fill-yellow-400 text-yellow-400" />
      <blockquote className="max-w-2xl text-3xl leading-relaxed font-medium md:text-4xl">
        "Hi, i am the second slide"
      </blockquote>
      <div className="mt-8">
        <div className="text-xl font-bold">oscar370</div>
        <div className="text-indigo-200">developer</div>
      </div>
    </section>
  );
}

function ThirdSlide() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-emerald-500 to-teal-700 p-8">
      <form className="w-full max-w-lg rounded-2xl bg-white p-8 text-gray-800 shadow-2xl">
        <div className="mb-4 flex items-center gap-3 text-emerald-600">
          <Mail size={32} />
          <h3 className="text-2xl font-bold">The third slide</h3>
        </div>
        <p className="mb-6 text-gray-600">With a form</p>
        <div className="space-y-4">
          <input
            type="email"
            placeholder="email@email.com"
            className="w-full rounded-lg border border-gray-300 p-3 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none"
          />
          <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 py-3 font-bold text-white transition hover:bg-emerald-700">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
