import { db } from "@/lib/dexie";
import dayjs from "dayjs";
import { useLiveQuery } from "dexie-react-hooks";
import { t } from "i18next";

export function useCategoryDistribution(from: number, to: number) {
  return (
    useLiveQuery(async () => {
      const transactions = await db.transactions
        .where("date")
        .between(from, to, true, true)
        .filter((t) => t.kind === "expense" && t.archive === 0)
        .toArray();

      const distribution = transactions.reduce(
        (acc, curr) => {
          const { categoryId, amount } = curr;
          acc[categoryId] = (acc[categoryId] || 0) + amount;
          return acc;
        },
        {} as Record<string, number>,
      );

      const categories = await db.categories.toArray();

      return Object.entries(distribution)
        .map(([id, value]) => {
          const category = categories.find((c) => c.id === id);
          return {
            name: category
              ? t(category.name, { ns: "categories" })
              : t("labels.others", { ns: "categories" }),
            value: value,
            fill: category ? category.color : "#94a3b8",
          };
        })
        .sort((a, b) => b.value - a.value);
    }, [from, to]) ?? []
  );
}

export function useComparisonIncomesExpenses() {
  const currentYear = dayjs().year();
  const currentMonth = dayjs().month() + 1;

  return (
    useLiveQuery(async () => {
      const currentId = `${currentYear}-${String(currentMonth).padStart(2, "0")}`;

      const current = await db.monthly_summaries.get(currentId);

      return [
        {
          label: t("kind.income", { ns: "transactions" }),
          value: current?.income ?? 0,
          fill: "#00c951",
        },
        {
          label: t("kind.expense", { ns: "transactions" }),
          value: current?.expense ?? 0,
          fill: "#fb2c36",
        },
      ];
    }, [currentYear, currentMonth]) ?? []
  );
}

export function useMonthlyBalanceComparison() {
  const currentYear = dayjs().year();
  const currentMonth = dayjs().month() + 1;

  return (
    useLiveQuery(async () => {
      let prevMonth = currentMonth - 1;
      let prevYear = currentYear;

      if (prevMonth === 0) {
        prevMonth = 12;
        prevYear -= 1;
      }

      const currentId = `${currentYear}-${String(currentMonth).padStart(2, "0")}`;
      const prevId = `${prevYear}-${String(prevMonth).padStart(2, "0")}`;

      const [current, prev] = await Promise.all([
        db.monthly_summaries.get(currentId),
        db.monthly_summaries.get(prevId),
      ]);

      return [
        {
          label: t("fields.previousMonth", { ns: "analytics" }),
          value: (prev?.income ?? 0) - (prev?.expense ?? 0),
          fill: "#9e9e9e",
        },
        {
          label: t("fields.currentMonth", { ns: "analytics" }),
          value: (current?.income ?? 0) - (current?.expense ?? 0),
          fill: "#4caf50",
        },
      ];
    }, [currentYear, currentMonth]) ?? []
  );
}

export function useBudgetTotalComparison(
  year: number,
  month: number,
  kind: "income" | "expense",
) {
  return (
    useLiveQuery(async () => {
      const start = new Date(year, month - 1, 1).getTime();
      const end = new Date(year, month, 0, 23, 59, 59, 999).getTime();

      const [budgets, transactions] = await Promise.all([
        db.budget
          .where("[year+month]")
          .equals([year, month])
          .filter((b) => b.deleted === 0 && b.kind === kind)
          .toArray(),
        db.transactions
          .where("[archive+date]")
          .between([0, start], [0, end])
          .filter((t) => t.kind === kind)
          .toArray(),
      ]);

      const totalPlanned = budgets.reduce((acc, b) => acc + b.amount, 0);

      const totalActual = transactions.reduce((acc, t) => acc + t.amount, 0);

      const colors =
        kind === "expense"
          ? { planned: "#94a3b8", actual: "#ef4444" }
          : { planned: "#94a3b8", actual: "#22c55e" };

      const data = [
        {
          label: t("fields.planned", { ns: "analytics" }),
          value: Number(totalPlanned.toFixed(2)),
          fill: colors.planned,
        },
        {
          label: t("fields.current", { ns: "analytics" }),
          value: Number(totalActual.toFixed(2)),
          fill: colors.actual,
        },
      ];

      return data;
    }, [year, month, kind]) ?? []
  );
}

export function useBudgetBalanceComparison(year: number, month: number) {
  return (
    useLiveQuery(async () => {
      const [budgets, summary] = await Promise.all([
        db.budget
          .where("[year+month]")
          .equals([year, month])
          .filter((b) => b.deleted === 0)
          .toArray(),
        db.monthly_summaries.get(`${year}-${String(month).padStart(2, "0")}`),
      ]);

      const planned = budgets.reduce((acc, b) => {
        return b.kind === "income" ? acc + b.amount : acc - b.amount;
      }, 0);

      const actual = (summary?.income || 0) - (summary?.expense || 0);

      const data = [
        {
          label: t("fields.planned", { ns: "analytics" }),
          value: Number(planned.toFixed(2)),
          fill: "#6366f1",
        },
        {
          label: t("fields.current", { ns: "analytics" }),
          value: Number(actual.toFixed(2)),
          fill: actual >= 0 ? "#22c55e" : "#ef4444",
        },
      ];

      return data;
    }, [year, month]) ?? []
  );
}
