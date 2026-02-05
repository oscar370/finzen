import { useCategoryDistribution } from "@/api/analytics";
import { useAppStore } from "@/stores/use-app-store";
import { formatCurrency } from "@/utils/format-currency";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import { Legend, Pie, PieChart } from "recharts";

export const ExpenseDistributionChart = () => {
  const currency = useAppStore((state) => state.currency);
  const from = dayjs().startOf("month").valueOf();
  const to = dayjs().endOf("month").valueOf();
  const data = useCategoryDistribution(from, to);
  const { t } = useTranslation("analytics");

  if (data.length === 0)
    return <p className="text-(--dim-fg)"> {t("messages.empty")} </p>;

  return (
    <PieChart className="aspect-video h-full w-full" responsive>
      <Pie
        data={data}
        nameKey="name"
        dataKey="value"
        cx="50%"
        cy="50%"
        outerRadius="50%"
        label={(v) => formatCurrency(currency, v.value)}
      />
      <Legend />
    </PieChart>
  );
};
