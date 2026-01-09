import "@/index.css";
import type { Meta, StoryObj } from "@storybook/react";
import { useForm } from "react-hook-form";
import { Input } from "./input";

const meta: Meta<typeof Input> = {
  component: Input,
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { register } = useForm();

    return (
      <>
        <Input name="select-1" register={register}>
          Write something
        </Input>
        <Input variant="form" name="select-2" register={register}>
          Write something
        </Input>
      </>
    );
  },
};
