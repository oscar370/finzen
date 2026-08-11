import { PageContainer } from "#/components/ui/page-container";
import { BudgetDetailsModal } from "#/features/budgets/budget-details-modal";
import { BudgetList } from "#/features/budgets/budget-list";
import { FilterBudgets } from "#/features/budgets/filter-budgets";
import { NewBudgetModal } from "#/features/budgets/new-budget-modal";
import { QUERY_PARAMS } from "#/lib/constants";
import { m } from "#/paraglide/messages";
import { getBudgets } from "#/services/budgets";
import { getCategories } from "#/services/categories";
import { getAppState } from "#/services/settings";
import type { Budget } from "#/types/budgets";
import { createFileRoute } from "@tanstack/react-router";
import { useLiveQuery } from "dexie-react-hooks";
import { useState } from "react";

export const Route = createFileRoute("/app/_layout/budgets/")({
  component: RouteComponent,
  loader: async ({ context }) => {
    const [categories, budgets] = await Promise.all([
      getCategories(),
      getBudgets(QUERY_PARAMS.yearMonth),
    ]);

    return {
      categories,
      budgets,
      appState: context.appState,
    };
  },
});

function RouteComponent() {
  const data = Route.useLoaderData();
  const [yearMonth, setYearMonth] = useState<string | undefined>(QUERY_PARAMS.yearMonth);
  const appState = useLiveQuery(() => getAppState(), [], data.appState);
  const categories = useLiveQuery(() => getCategories(), [], data.categories);
  const budgets = useLiveQuery(
    () => getBudgets(yearMonth ?? QUERY_PARAMS.yearMonth),
    [yearMonth],
    data.budgets,
  );
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);

  return (
    <PageContainer title={m.budgets()} actions={<NewBudgetModal categories={categories} />}>
      <FilterBudgets yearMonth={yearMonth} onYearMonthChange={(value) => setYearMonth(value)} />

      {budgets.length === 0 ? (
        <p className="text-center">{m["budgets.empty"]()}</p>
      ) : (
        <BudgetList
          budgets={budgets}
          currency={appState.currency}
          onClick={(budget) => setSelectedBudget(budget)}
        />
      )}

      <BudgetDetailsModal
        budget={selectedBudget}
        categories={categories}
        onClose={() => setSelectedBudget(null)}
      />
    </PageContainer>
  );
}
