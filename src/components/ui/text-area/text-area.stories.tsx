import "@/index.css";
import type { Meta, StoryObj } from "@storybook/react";
import { useForm } from "react-hook-form";
import { TextArea } from "./text-area";

const meta: Meta<typeof TextArea> = {
  component: TextArea,
};

export default meta;
type Story = StoryObj<typeof TextArea>;

export const Default: Story = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { register } = useForm();

    return (
      <div className="space-y-3">
        <TextArea name="select-1" register={register}>
          Write something
        </TextArea>
        <TextArea variant="form" name="select-2" register={register}>
          Write something
        </TextArea>
      </div>
    );
  },
};
