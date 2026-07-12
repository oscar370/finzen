import { CATEGORY_ICONS } from "#/lib/constants";
import { formatCurrency, translate } from "#/lib/utils";
import { m } from "#/paraglide/messages";
import type { Budget } from "#/types/budgets";
import { ChevronRight } from "lucide-react";

type BudgetItemProps = {
  budget: Budget;
  currency: string;
  onClick: (budget: Budget) => void;
};

export function BudgetItem({ budget, currency, onClick }: BudgetItemProps) {
  const Icon = CATEGORY_ICONS[budget.categoryIcon];

  return (
    <li className="list">
      <Icon />
      <span>{translate(budget.categoryName)}</span>
      <span
        className={`${budget.kind === "income" ? "bg-green-800" : "bg-red-800"} rounded-md px-2 text-white`}
      >
        {formatCurrency(budget.amount, currency)}
      </span>
      <button
        className="btn btn-ghost btn-square"
        aria-label={m.open_details()}
        onClick={() => onClick(budget)}
      >
        <ChevronRight />
      </button>
    </li>
  );
}
