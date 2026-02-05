import type { Meta, StoryObj } from "@storybook/react-vite";
import { CurrencyEntry } from "./currency-entry";

const meta = {
  component: CurrencyEntry,
} satisfies Meta<typeof CurrencyEntry>;

export default meta;
type Story = StoryObj<typeof CurrencyEntry>;

export const CurrencyEntryStory: Story = {
  render: () => {
    const locale = navigator.language;

    return (
      <CurrencyEntry
        title="Amount"
        intlConfig={{ locale, currency: "USD" }}
        defaultValue={2000}
        decimalsLimit={2}
      />
    );
  },
};
