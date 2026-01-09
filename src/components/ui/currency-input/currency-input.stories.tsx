import "@/index.css";
import type { Meta, StoryObj } from "@storybook/react";
import { useForm } from "react-hook-form";
import { CurrencyInput } from "./currency-input";

const meta: Meta<typeof CurrencyInput> = {
  component: CurrencyInput,
};

export default meta;
type Story = StoryObj<typeof CurrencyInput>;

export const Default: Story = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { control } = useForm();

    return (
      <div className="space-y-3">
        <CurrencyInput
          currency="MXN"
          variant="form"
          name="currency"
          control={control}
        >
          Write something
        </CurrencyInput>

        <CurrencyInput currency="USD" name="currency" control={control}>
          Write something
        </CurrencyInput>
      </div>
    );
  },
};
