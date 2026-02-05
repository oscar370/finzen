import { useBudgetBalanceComparison } from "@/api/analytics";
import { TwoColumnsChart } from "./two-columns-chart";

type Props = {
  year: number;
  month: number;
};

export function BudgetBalanceComparison({ year, month }: Props) {
  const data = useBudgetBalanceComparison(year, month);

  return <TwoColumnsChart data={data} />;
}
