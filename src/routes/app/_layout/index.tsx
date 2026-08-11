import { PageContainer } from "#/components/ui/page-container";
import { BudgetsTable } from "#/features/analytics/budgets-table";
import { SummaryList } from "#/features/analytics/summary-list";
import { QUERY_PARAMS } from "#/lib/constants";
import { m } from "#/paraglide/messages";
import { getBudgetsByKind } from "#/services/budgets";
import { getMonthlySummary } from "#/services/monthly-summary";
import { getAppState } from "#/services/settings";
import { getExpenses, getIncomes } from "#/services/transactions";
import { createFileRoute } from "@tanstack/react-router";
import { useLiveQuery } from "dexie-react-hooks";

export const Route = createFileRoute("/app/_layout/")({
  component: RouteComponent,
  loader: async ({ context }) => {
    const [monthlySummary, expenses, expenseBudgets, incomes, incomeBudgets] = await Promise.all([
      getMonthlySummary(new Date()),
      getExpenses(QUERY_PARAMS.yearMonth),
      getBudgetsByKind(QUERY_PARAMS.yearMonth, "expense"),
      getIncomes(QUERY_PARAMS.yearMonth),
      getBudgetsByKind(QUERY_PARAMS.yearMonth, "income"),
    ]);

    return {
      monthlySummary,
      appState: context.appState,
      expenses,
      expenseBudgets,
      incomes,
      incomeBudgets,
    };
  },
});

function RouteComponent() {
  const data = Route.useLoaderData();
  const appState = useLiveQuery(() => getAppState(), [], data.appState);
  const monthlySummary = useLiveQuery(() => getMonthlySummary(new Date()), [], data.monthlySummary);
  const expenses = useLiveQuery(() => getExpenses(QUERY_PARAMS.yearMonth), [], data.expenses);
  const expenseBudgets = useLiveQuery(
    () => getBudgetsByKind(QUERY_PARAMS.yearMonth, "expense"),
    [],
    data.expenseBudgets,
  );
  const incomes = useLiveQuery(() => getIncomes(QUERY_PARAMS.yearMonth), [], data.incomes);
  const incomeBudgets = useLiveQuery(
    () => getBudgetsByKind(QUERY_PARAMS.yearMonth, "income"),
    [],
    data.incomeBudgets,
  );

  return (
    <PageContainer title={m.home()}>
      <section>
        <h2 className="mb-1 ml-0.5 font-bold">{m.summary()}</h2>
        <SummaryList appState={appState} monthlySummary={monthlySummary} />
      </section>

      <section>
        <h2 className="mb-1 ml-0.5 font-bold">{m.monthly_expenses()}</h2>
        <BudgetsTable
          type="expense"
          currency={appState.currency}
          transactions={expenses}
          budgets={expenseBudgets}
        />
      </section>

      <section>
        <h2 className="mb-1 ml-0.5 font-bold">{m.monthly_incomes()}</h2>
        <BudgetsTable
          type="income"
          currency={appState.currency}
          transactions={incomes}
          budgets={incomeBudgets}
        />
      </section>
    </PageContainer>
  );
}
