import "@/index.css";
import type { Meta, StoryObj } from "@storybook/react";
import { Camera } from "lucide-react";
import { MemoryRouter } from "react-router-dom";
import { CurrencyNavigation } from "./currency-navigation";

const meta: Meta<typeof CurrencyNavigation> = {
  component: CurrencyNavigation,
};

export default meta;
type Story = StoryObj<typeof CurrencyNavigation>;

export const Default: Story = {
  render: () => {
    return (
      <MemoryRouter>
        <div className="space-y-3">
          <CurrencyNavigation
            variant="income"
            to="transaction-1"
            balance={1000}
          >
            <span className="flex gap-2">
              <Camera color="green" /> Transaction 1
            </span>
          </CurrencyNavigation>
          <CurrencyNavigation
            variant="expense"
            to="transaction-1"
            balance={1000}
          >
            <span className="flex gap-2">
              <Camera color="red" /> Transaction 2
            </span>
          </CurrencyNavigation>
          <CurrencyNavigation
            variant="account"
            to="transaction-1"
            balance={1000}
          >
            Account
          </CurrencyNavigation>
        </div>
      </MemoryRouter>
    );
  },
};
