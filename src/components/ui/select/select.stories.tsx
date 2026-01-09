import "@/index.css";
import type { Meta, StoryObj } from "@storybook/react";
import { useForm } from "react-hook-form";
import { Select } from "./select";

const meta: Meta<typeof Select> = {
  component: Select,
};

export default meta;
type Story = StoryObj<typeof Select>;

export const Default: Story = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { register } = useForm();

    return (
      <>
        <Select
          label="Select an option"
          name="select"
          register={register}
          variant="default"
        >
          <option value="">-- Select --</option>
          <option value="1">Option 1</option>
          <option value="2">Option 2</option>
        </Select>

        <Select
          label="Select an option"
          name="select"
          register={register}
          variant="form"
        >
          <option value="">-- Select --</option>
          <option value="1">Option 1</option>
          <option value="2">Option 2</option>
        </Select>
      </>
    );
  },
};
