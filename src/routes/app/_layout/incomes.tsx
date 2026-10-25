import { TransactionsPage } from "@/features/transactions/components/transactions-page";
import { getTransactionsPageData } from "@/features/transactions/services/get-transactions-page-data";
import { validateMonthSearch } from "@/lib/utils/validate-month-search";
import { m } from "@/paraglide/messages";
import { createFileRoute } from "@tanstack/react-router";
import { useLiveQuery } from "dexie-react-hooks";

export const Route = createFileRoute("/app/_layout/incomes")({
  component: RouteComponent,
  validateSearch: validateMonthSearch,
  loaderDeps: ({ search }) => ({
    yearMonth: search.yearMonth,
    kind: "income" as const,
  }),
  loader: async ({ deps }) => getTransactionsPageData(deps),
});

function RouteComponent() {
  const deps = Route.useLoaderDeps();
  const navigate = Route.useNavigate();

  const data = useLiveQuery(
    () => getTransactionsPageData(deps),
    [deps],
    Route.useLoaderData()
  );

  return (
    <TransactionsPage
      title={m.incomes()}
      yearMonth={deps.yearMonth}
      onYearMonthChange={(yearMonth) => navigate({ search: { yearMonth } })}
      data={data}
      kind="income"
    />
  );
}
