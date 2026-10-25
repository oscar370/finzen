import {
  ListItem,
  ListItemContent,
  ListItemPrefix,
  ListItemSuffix,
  ListItemTitle,
} from "@/components/list";
import { CATEGORY_ICONS } from "@/lib/constants/category-icons";
import { formatCurrency } from "@/lib/i18n/format-currency";
import { translate } from "@/lib/i18n/translate";
import type { Budget } from "@/types/budgets/budget";
import { ChevronRight, CircleHelp } from "lucide-react";

type BudgetItemProps = {
  budget: Budget;
  currency: string;
  regionalFormat: string;
  onClick: (budget: Budget) => void;
};

export function BudgetItem({
  budget,
  currency,
  regionalFormat,
  onClick,
}: BudgetItemProps) {
  const Icon = CATEGORY_ICONS[budget.categoryIcon] ?? CircleHelp;
  const isIncome = budget.kind === "income";

  return (
    <ListItem render={<button type="button" />} onClick={() => onClick(budget)}>
      <ListItemPrefix>
        <Icon />
      </ListItemPrefix>

      <ListItemContent>
        <ListItemTitle>{translate(budget.categoryName)}</ListItemTitle>
      </ListItemContent>

      <ListItemSuffix>
        <span
          className={`${isIncome ? "bg-green-800" : "bg-red-800"} rounded-md px-2 text-white`}
        >
          {formatCurrency(budget.amount, currency, regionalFormat)}
        </span>
        <ChevronRight />
      </ListItemSuffix>
    </ListItem>
  );
}
