import { NavigationPage } from "@/components/ui/navigation-page";
import {
  ComparisonIncomesExpensesChart,
  ExpenseDistributionChart,
  MonthComparisonChart,
} from "@/features/analytics";
import { useTranslation } from "react-i18next";

export default function Analytics() {
  const { t } = useTranslation("common");

  return (
    <NavigationPage title={t("sections.analytics")}>
      <section className="mt-4">
        <h2 className="mb-1 font-bold">
          {t("titles.monthlyBalanceComparison", { ns: "analytics" })}
        </h2>

        <MonthComparisonChart />
      </section>

      <section className="mt-4">
        <h2 className="mb-1 font-bold">
          {t("titles.comparisonIncomesExpenses", { ns: "analytics" })}
        </h2>

        <ComparisonIncomesExpensesChart />
      </section>

      <section className="mt-4">
        <h2 className="mb-1 font-bold">
          {t("titles.monthlyExpenseDistribution", { ns: "analytics" })}
        </h2>

        <ExpenseDistributionChart />
      </section>
    </NavigationPage>
  );
}
