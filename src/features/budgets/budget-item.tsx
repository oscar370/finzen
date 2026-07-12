import { CATEGORY_ICONS } from "#/lib/constants";
import { formatCurrency, translate } from "#/lib/utils";
import { m } from "#/paraglide/messages";
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
        className="list bg-base-200 w-full cursor-pointer"
        aria-label={m.open_details()}
        onClick={() => onClick(budget)}
      >
        <Icon />
        <span>{translate(budget.categoryName)}</span>
        <span
          className={`${budget.kind === "income" ? "bg-green-800" : "bg-red-800"} rounded-md px-2 text-start text-white`}
        >
          {formatCurrency(budget.amount, currency)}
        </span>
      </button>
    </li>
  );
}
