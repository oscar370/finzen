import { useTotalAccounts } from "@/api/accounts";
import { useMonthlySummary } from "@/api/monthly-summary";
import { Group } from "@/components/ui/group";
import { t } from "i18next";
import { OverviewStats } from "./overview-stats";

export function MonthlyOverview() {
  const year = new Date().getFullYear();
  const month = new Date().getMonth() + 1;
  const { income, expense } = useMonthlySummary(year, month);
  const balance = useTotalAccounts();
  const saving = income - expense;

  return (
    <Group
      title={t("currentMonth.title", { ns: "analytics" })}
      description={t("overview.description", { ns: "analytics" })}
    >
      <OverviewStats
        balance={balance}
        incomes={income}
        expenses={expense}
        saving={saving}
      />
    </Group>
  );
}
