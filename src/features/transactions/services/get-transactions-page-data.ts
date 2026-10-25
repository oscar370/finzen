import { getCategories } from "@/services/categories/get-categories";
import { getAppState } from "@/services/settings/get-app-state";
import { getTransactionsByKind } from "@/services/transactions/get-transactions-by-kind";

export async function getTransactionsPageData({
  yearMonth,
  kind,
}: {
  yearMonth: string;
  kind: "income" | "expense";
}) {
  const [appState, transactions, categories] = await Promise.all([
    getAppState(),
    getTransactionsByKind(yearMonth, kind),
    getCategories(),
  ]);
  return { appState, transactions, categories };
}
