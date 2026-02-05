import { useBudgetTotalComparison } from "@/api/analytics";
import { TwoColumnsChart } from "./two-columns-chart";

type Props = {
  year: number;
  month: number;
  kind: "expense" | "income";
};

export function BudgetTotalComparisonChart({ year, month, kind }: Props) {
  const data = useBudgetTotalComparison(year, month, kind);

  return <TwoColumnsChart data={data} />;
}
