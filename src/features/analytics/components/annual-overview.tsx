import { useYearlySummary } from "@/api/monthly-summary";
import { Group } from "@/components/ui/group";
import { t } from "i18next";
import { OverviewStats } from "./overview-stats";

export function AnnualOverview() {
  const year = new Date().getFullYear();
  const { income, expense, balance } = useYearlySummary(year);

  return (
    <Group
      title={t("currentYear.title", { ns: "analytics" })}
      description={t("overview.description", { ns: "analytics" })}
    >
      <OverviewStats
        balance={balance}
        incomes={income}
        expenses={expense}
        saving={balance}
      />
    </Group>
  );
}
