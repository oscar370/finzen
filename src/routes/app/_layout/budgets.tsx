import {
  PageContainer,
  PageContainerActions,
  PageContainerContent,
  PageContainerHeader,
  PageContainerTittle,
} from "@/components/page-container";
import { BudgetDetailsDialog } from "@/features/budgets/components/budget-details-dialog";
import { BudgetFilters } from "@/features/budgets/components/budget-filters";
import { BudgetList } from "@/features/budgets/components/budget-list";
import { NewBudgetDialog } from "@/features/budgets/components/new-budget-dialog";
import { getBudgetsPageData } from "@/features/budgets/services/get-budgets-page-data";
import { validateMonthSearch } from "@/lib/utils/validate-month-search";
import { m } from "@/paraglide/messages";
import type { Budget } from "@/types/budgets/budget";
import { createFileRoute } from "@tanstack/react-router";
import { useLiveQuery } from "dexie-react-hooks";
import { useState } from "react";

export const Route = createFileRoute("/app/_layout/budgets")({
  component: RouteComponent,
  validateSearch: validateMonthSearch,
  loaderDeps: ({ search }) => ({ yearMonth: search.yearMonth }),
  loader: async ({ deps }) => getBudgetsPageData(deps),
});

function RouteComponent() {
  const deps = Route.useLoaderDeps();
  const navigate = Route.useNavigate();
  const [selected, setSelected] = useState<Budget | null>(null);

  const { appState, categories, budgets } = useLiveQuery(
    () => getBudgetsPageData(deps),
    [deps],
    Route.useLoaderData()
  );

  return (
    <PageContainer>
      <PageContainerHeader>
        <PageContainerTittle>{m.budgets()}</PageContainerTittle>

        <PageContainerActions>
          <NewBudgetDialog categories={categories} yearMonth={deps.yearMonth} />
        </PageContainerActions>
      </PageContainerHeader>

      <PageContainerContent>
        <BudgetFilters
          yearMonth={deps.yearMonth}
          onYearMonthChange={(yearMonth) => navigate({ search: { yearMonth } })}
        />

        {budgets.length === 0 ? (
          <p className="text-center">{m.empty_budgets()}</p>
        ) : (
          <BudgetList
            budgets={budgets}
            currency={appState.currency}
            regionalFormat={appState.regionalFormat}
            onClick={setSelected}
          />
        )}
      </PageContainerContent>

      <BudgetDetailsDialog
        budget={selected}
        categories={categories}
        currency={appState.currency}
        regionalFormat={appState.regionalFormat}
        onClose={() => setSelected(null)}
      />
    </PageContainer>
  );
}
