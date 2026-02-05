import { useAppStore } from "@/stores/use-app-store";
import { formatCurrency } from "@/utils/format-currency";
import { Bar, BarChart, LabelList, XAxis } from "recharts";

type Data<T> = {
  label: string;
  value: T;
  fill: string;
};

type TwoColumnsChartProps<T> = {
  data: Data<T>[];
};

export function TwoColumnsChart<T>({ data }: TwoColumnsChartProps<T>) {
  const currency = useAppStore((state) => state.currency);
  const newData = data.map((d) => {
    const valueBar = +d.value < 0 ? 0 : d.value;
    return {
      ...d,
      valueBar,
    };
  });

  return (
    <BarChart
      className="aspect-video h-full w-full"
      responsive
      data={newData}
      margin={{
        right: 0,
        left: 0,
        bottom: 20,
      }}
    >
      <XAxis dataKey="label" />
      <Bar dataKey="valueBar" radius={[10, 10, 0, 0]} maxBarSize={100}>
        <LabelList
          dataKey="value"
          position="bottom"
          offset={30}
          formatter={(v) => formatCurrency(currency, Number(v))}
        />
      </Bar>
    </BarChart>
  );
}
