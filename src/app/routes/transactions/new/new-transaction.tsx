import { NavigationPage } from "@/components/ui/navigation-page";
import { AddTransactionForm } from "@/features/transactions";
import { useTranslation } from "react-i18next";

export function NewTransaction() {
  const { t } = useTranslation("transactions");

  return (
    <NavigationPage title={t("titles.newTransaction")} isSubPage>
      <AddTransactionForm />
    </NavigationPage>
  );
}
