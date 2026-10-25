import { List } from "@/components/list";
import type { Budget } from "@/types/budgets/budget";
import { BudgetItem } from "./budget-item";

type BudgetListProps = {
  budgets: Budget[];
  currency: string;
  regionalFormat: string;
  onClick: (budget: Budget) => void;
};

export function BudgetList({
  budgets,
  currency,
  regionalFormat,
  onClick,
}: BudgetListProps) {
  return (
    <List>
      {budgets.map((budget) => (
        <BudgetItem
          key={budget.id}
          budget={budget}
          currency={currency}
          regionalFormat={regionalFormat}
          onClick={onClick}
        />
      ))}
    </List>
  );
}
