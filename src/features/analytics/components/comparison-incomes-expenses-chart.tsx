import { useComparisonIncomesExpenses } from "@/api/analytics";
import { TwoColumnsChart } from "./two-columns-chart";

export function ComparisonIncomesExpensesChart() {
  const data = useComparisonIncomesExpenses();

  return <TwoColumnsChart data={data} />;
}
