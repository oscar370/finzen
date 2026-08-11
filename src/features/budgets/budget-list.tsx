import type { Budget } from "#/types/budgets";
import { BudgetItem } from "./budget-item";

type BudgetListProps = {
  budgets: Budget[];
  currency: string;
  onClick: (budget: Budget) => void;
};

export function BudgetList({ budgets, currency, onClick }: BudgetListProps) {
  return (
    <ul className="list rounded-box bg-base-200">
      {budgets.map((budget) => (
        <BudgetItem
          key={budget.id}
          budget={budget}
          currency={currency}
          onClick={(cat) => onClick(cat)}
        />
      ))}
    </ul>
  );
}
