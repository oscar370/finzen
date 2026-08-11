import { CATEGORY_ICONS } from "#/lib/constants";
import { formatCurrency, translate } from "#/lib/utils";
import type { Budget } from "#/types/budgets";

type BudgetItemProps = {
  budget: Budget;
  currency: string;
  onClick: (budget: Budget) => void;
};

export function BudgetItem({ budget, currency, onClick }: BudgetItemProps) {
  const Icon = CATEGORY_ICONS[budget.categoryIcon];

  return (
    <li>
      <button
        className="list-row w-full cursor-pointer items-center"
        onClick={() => onClick(budget)}
      >
        <Icon />
        <span className="text-start">{translate(budget.categoryName)}</span>
        <span
          className={`${budget.kind === "income" ? "bg-green-800" : "bg-red-800"} rounded-md px-2 text-start text-white`}
        >
          {formatCurrency(budget.amount, currency)}
        </span>
      </button>
    </li>
  );
}
