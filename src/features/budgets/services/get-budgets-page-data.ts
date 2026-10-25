import { getBudgets } from "@/services/budgets/get-budgets";
import { getCategories } from "@/services/categories/get-categories";
import { getAppState } from "@/services/settings/get-app-state";

export async function getBudgetsPageData({ yearMonth }: { yearMonth: string }) {
  const [appState, categories, budgets] = await Promise.all([
    getAppState(),
    getCategories(),
    getBudgets(yearMonth),
  ]);

  return { appState, categories, budgets };
}
