import {
  PageContainer,
  PageContainerContent,
  PageContainerHeader,
  PageContainerTittle,
} from "@/components/page-container";
import { Section, SectionTitle } from "@/components/section";
import { BudgetsTable } from "@/features/analytics/components/budgets-table";
import { HomeFilters } from "@/features/analytics/components/home-filters";
import { SummaryList } from "@/features/analytics/components/summary-list";
import { getHomePageData } from "@/features/analytics/services/get-home-page-data";
import { buildBudgetSummary } from "@/features/analytics/utils/build-budget-summary";
import { validateMonthSearch } from "@/lib/utils/validate-month-search";
import { m } from "@/paraglide/messages";
import { createFileRoute } from "@tanstack/react-router";
import { useLiveQuery } from "dexie-react-hooks";

export const Route = createFileRoute("/app/_layout/")({
  component: RouteComponent,
  validateSearch: validateMonthSearch,
  loaderDeps: ({ search }) => ({ yearMonth: search.yearMonth }),
  loader: async ({ deps }) => getHomePageData(deps),
});

function RouteComponent() {
  const deps = Route.useLoaderDeps();
  const navigate = Route.useNavigate();

  const {
    appState,
    monthlySummary,
    incomeBudgets,
    expenseBudgets,
    incomes,
    expenses,
  } = useLiveQuery(() => getHomePageData(deps), [deps], Route.useLoaderData());

  const incomeBudgetsSummary = buildBudgetSummary(
    incomeBudgets,
    incomes,
    "income"
  );

  const expenseBudgetsSummary = buildBudgetSummary(
    expenseBudgets,
    expenses,
    "expense"
  );

  return (
    <PageContainer>
      <PageContainerHeader>
        <PageContainerTittle>{m.home()}</PageContainerTittle>
      </PageContainerHeader>

      <PageContainerContent>
        <HomeFilters
          yearMonth={deps.yearMonth}
          onYearMonthChange={(yearMonth) => navigate({ search: { yearMonth } })}
        />

        <Section>
          <SectionTitle>{m.summary()}</SectionTitle>

          <SummaryList
            currency={appState.currency}
            regionalFormat={appState.regionalFormat}
            balance={appState.balance}
            incomes={monthlySummary?.income ?? 0}
            expenses={monthlySummary?.expense ?? 0}
          />
        </Section>

        <Section>
          <SectionTitle>{m.monthly_incomes()}</SectionTitle>

          <BudgetsTable
            budgetsSummary={incomeBudgetsSummary}
            currency={appState.currency}
            regionalFormat={appState.regionalFormat}
          />
        </Section>

        <Section>
          <SectionTitle>{m.monthly_expenses()}</SectionTitle>

          <BudgetsTable
            budgetsSummary={expenseBudgetsSummary}
            currency={appState.currency}
            regionalFormat={appState.regionalFormat}
          />
        </Section>
      </PageContainerContent>
    </PageContainer>
  );
}
