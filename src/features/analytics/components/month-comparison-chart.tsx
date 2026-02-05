import { useMonthlyBalanceComparison } from "@/api/analytics";
import { TwoColumnsChart } from "./two-columns-chart";

export function MonthComparisonChart() {
  const data = useMonthlyBalanceComparison();

  return <TwoColumnsChart data={data} />;
}
