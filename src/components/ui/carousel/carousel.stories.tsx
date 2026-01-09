import "@/index.css";
import type { Meta, StoryObj } from "@storybook/react";
import { Carousel } from "./carousel";

const meta: Meta = {
  component: Carousel,
};

export default meta;
type Story = StoryObj<typeof Carousel>;

export const Default: Story = {
  args: {
    children: (
      <>
        <div className="flex h-dvh w-full items-center justify-center">
          <Carousel.Content>
            <div>Slide 1</div>
            <div>Slide 2</div>
            <div>Slide 3</div>
          </Carousel.Content>
        </div>

        <Carousel.Previous className="absolute top-1/2 left-2" />
        <Carousel.Next className="absolute top-1/2 right-2" />
      </>
    ),
  },
};
