import { useBudget } from "@/api/budgets";
import { NavigationPage } from "@/components/ui/navigation-page";
import { BudgetDetails } from "@/features/budgets";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

export function Budget() {
  const { id } = useParams();
  const budget = useBudget(id!);
  const { t } = useTranslation();

  if (budget)
    return (
      <NavigationPage
        title={t(budget.categoryName, { ns: "categories" })}
        isSubPage
      >
        <BudgetDetails budget={budget} />
      </NavigationPage>
    );
}
