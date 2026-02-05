import { ActionRow } from "@/components/ui/action-row";
import { categoriesIcons } from "@/data/categories-icons";
import { useAppStore } from "@/stores/use-app-store";
import type { Budget } from "@/types/budgets";
import { formatCurrency } from "@/utils/format-currency";
import { ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

type Budgets = Budget & {
  diff: number;
};

type BudgetsItemsProps = {
  budgets: Budgets[];
};

export function BudgetsItems({ budgets }: BudgetsItemsProps) {
  const { t } = useTranslation("budgets");
  const currency = useAppStore((state) => state.currency);

  return (
    <>
      {budgets.map((budget) => {
        const Icon = categoriesIcons[budget.categoryIcon];

        return (
          <ActionRow
            key={budget.id}
            title={t(budget.categoryName, { ns: "categories" })}
            subtitle={formatCurrency(currency, budget.amount)}
            icon={<Icon />}
            accent={
              budget.kind === "income" ? "text-green-600" : "text-red-600"
            }
            as={Link}
            forceHover
            to={`/budgets/${budget.id}`}
          >
            <div className="flex items-center justify-center">
              <span className="mr-1">{t("fields.diff")}:</span>
              <span
                className={`rounded-md px-1 ${budget.kind === "income" ? "bg-green-200 dark:bg-green-900" : "bg-red-200 dark:bg-red-900"}`}
              >
                {formatCurrency(currency, budget.diff)}
              </span>
              <ChevronRight />
            </div>
          </ActionRow>
        );
      })}
    </>
  );
}
