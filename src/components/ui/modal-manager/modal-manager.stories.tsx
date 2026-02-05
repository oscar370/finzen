import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../button";
import { modal, ModalManager } from "./modal-manager";

const meta = {
  component: ModalManager,
} satisfies Meta<typeof ModalManager>;

export default meta;
type Story = StoryObj<typeof ModalManager>;

export const ModalManagerStory: Story = {
  render: () => {
    function showModal() {
      modal.open(
        "Modal",
        <>
          <h1>Hi</h1>
          <Button onClick={showInternalModal}>Show internal modal</Button>
        </>,
      );
    }

    function showSecondModal() {
      modal.open(
        "Second modal",
        <>
          <h1>Hi, this is the second modal</h1>
          <Button onClick={showInternalModal}>Show internal modal</Button>
        </>,
      );
    }

    function showInternalModal() {
      modal.open(
        "Internal modal",
        <>
          <h2>Hi again</h2>
        </>,
      );
    }

    return (
      <>
        <main className="flex h-dvh w-full gap-2">
          <Button onClick={showModal}>Open modal</Button>
          <Button onClick={showSecondModal}>Open second modal</Button>
        </main>

        <ModalManager />
      </>
    );
  },
};
