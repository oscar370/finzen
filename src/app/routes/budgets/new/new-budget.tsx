import { NavigationPage } from "@/components/ui/navigation-page";
import { AddBudgetForm } from "@/features/budgets";
import { useTranslation } from "react-i18next";

export function NewBudget() {
  const { t } = useTranslation("budgets");

  return (
    <NavigationPage title={t("titles.new")} isSubPage>
      <AddBudgetForm />
    </NavigationPage>
  );
}
