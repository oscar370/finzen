import { useBudget } from "@/api/budgets";
import { NavigationPage } from "@/components/ui/navigation-page";
import { EditBudgetForm } from "@/features/budgets";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

export function EditBudget() {
  const { t } = useTranslation("budgets");
  const { id } = useParams();
  const budget = useBudget(id!);

  if (budget)
    return (
      <NavigationPage title={t("titles.edit")} isSubPage>
        <EditBudgetForm budget={budget} />
      </NavigationPage>
    );
}
