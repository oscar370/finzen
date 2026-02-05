import { db } from "@/lib/dexie";
import type { Budget, BudgetDraft } from "@/types/budgets";
import dayjs from "dayjs";
import { useLiveQuery } from "dexie-react-hooks";
import { t } from "i18next";

export async function addBudget(budgetDraft: BudgetDraft) {
  try {
    const id = `${budgetDraft.year}-${budgetDraft.month}-${budgetDraft.kind}-${budgetDraft.categoryId}`;
    const category = await db.categories.get(budgetDraft.categoryId);

    if (!category) throw new Error("Category not found");

    const budget: Budget = {
      ...budgetDraft,
      id,
      categoryName: category.name,
      categoryIcon: category.icon,
      updatedAt: Date.now(),
      syncStatus: "pending",
      deleted: 0,
    };

    await db.budget.add(budget);

    return {
      ok: true,
    };
  } catch (error) {
    console.error("Error adding budget:", error);
    return {
      ok: false,
    };
  }
}

export function useBudgets(year: number, month: number) {
  return (
    useLiveQuery(async () => {
      const start = new Date(year, month - 1, 1).getTime();
      const end = new Date(year, month, 0, 23, 59, 59, 999).getTime();

      const [budgets, transactions] = await Promise.all([
        db.budget
          .where("[year+month]")
          .equals([year, month])
          .filter((b) => b.deleted === 0)
          .toArray(),

        db.transactions
          .where("[archive+date]")
          .between([0, start], [0, end])
          .toArray(),
      ]);

      const actuals = transactions.reduce(
        (acc, txn) => {
          const key = `${txn.categoryId}-${txn.kind}`;
          acc[key] = (acc[key] || 0) + txn.amount;
          return acc;
        },
        {} as Record<string, number>,
      );

      return budgets.map((budget) => {
        const actualAmount =
          actuals[`${budget.categoryId}-${budget.kind}`] || 0;

        return {
          ...budget,
          diff: budget.amount - actualAmount,
        };
      });
    }, [year, month]) ?? []
  );
}

export function useLastMonthBudgetsCount() {
  return (
    useLiveQuery(async () => {
      let prevMonth = dayjs().month() + 1 - 1;
      let prevYear = dayjs().year();

      if (prevMonth === 0) {
        prevMonth = 12;
        prevYear -= 1;
      }

      return await db.budget
        .where("[year+month]")
        .equals([prevYear, prevMonth])
        .filter((b) => b.deleted === 0)
        .count();
    }) ?? 0
  );
}

export function useBudget(id: string) {
  return useLiveQuery(() => db.budget.get(id), [id]);
}

export async function updateBudget(budget: Budget) {
  try {
    const oldPlannedTxn = await db.budget.get(budget.id);

    if (!oldPlannedTxn) throw new Error("The budget was not found");

    await db.budget.update(budget.id, {
      ...budget,
      syncStatus: "pending",
      updatedAt: Date.now(),
    });

    return { ok: true };
  } catch (error) {
    console.error("Error deleting budget:", error);
    return { ok: false };
  }
}

export async function deleteBudget(id: string) {
  try {
    const budget = await db.budget.get(id);

    if (!budget) throw new Error("The planned transaction was not found");

    await db.budget.update(id, {
      ...budget,
      deleted: 1,
      syncStatus: "pending",
      updatedAt: Date.now(),
    });

    return { ok: true };
  } catch (error) {
    console.error("Error deleting budget:", error);
    return { ok: false };
  }
}

export const restoreBudgets = async (
  targetYear: number,
  targetMonth: number,
) => {
  try {
    let prevMonth = targetMonth - 1;
    let prevYear = targetYear;

    if (prevMonth === 0) {
      prevMonth = 12;
      prevYear -= 1;
    }

    const sourceBudgets = await db.budget
      .where("[year+month]")
      .equals([prevYear, prevMonth])
      .filter((b) => b.deleted === 0)
      .toArray();

    if (sourceBudgets.length === 0)
      throw new Error(t("errors.emptyPreviousMonth", { ns: "budgets" }));

    const newBudgets: Budget[] = sourceBudgets.map((b) => {
      const newId = `${targetYear}-${targetMonth}-${b.kind}-${b.categoryId}`;

      return {
        ...b,
        id: newId,
        year: targetYear,
        month: targetMonth,
        updatedAt: Date.now(),
        syncStatus: "pending",
        deleted: 0,
      };
    });

    await db.budget.bulkPut(newBudgets);

    return {
      ok: true,
    };
  } catch (error) {
    console.error("Error copying budget:", error);
    return {
      ok: false,
    };
  }
};
