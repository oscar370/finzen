import { PageContainer } from "#/components/ui/page-container";
import { FilterTransactions } from "#/features/transactions/filter-transactions";
import { NewTransactionModal } from "#/features/transactions/new-transaction-modal";
import { TransactionDetailsModal } from "#/features/transactions/transaction-details-modal";
import { TransactionList } from "#/features/transactions/transaction-list";
import { QUERY_PARAMS } from "#/lib/constants";
import { m } from "#/paraglide/messages";
import { getCategories } from "#/services/categories";
import { getAppState } from "#/services/settings";
import { getIncomes } from "#/services/transactions";
import type { Transaction } from "#/types/transactions";
import { createFileRoute } from "@tanstack/react-router";
import { useLiveQuery } from "dexie-react-hooks";
import { useState } from "react";

export const Route = createFileRoute("/app/_layout/incomes/")({
  component: RouteComponent,
  loader: async ({ context }) => {
    const [incomes, categories] = await Promise.all([
      getIncomes(QUERY_PARAMS.yearMonth),
      getCategories(),
    ]);

    return {
      appState: context.appState,
      incomes,
      categories,
    };
  },
});

function RouteComponent() {
  const data = Route.useLoaderData();

  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const [yearMonth, setYearMonth] = useState<string | undefined>(QUERY_PARAMS.yearMonth);
  const [search, setSearch] = useState<string | undefined>(undefined);
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined);

  const appState = useLiveQuery(() => getAppState(), [], data.appState);
  const incomes = useLiveQuery(
    () => getIncomes(yearMonth ?? QUERY_PARAMS.yearMonth, search, categoryId),
    [yearMonth, search, categoryId],
    data.incomes,
  );
  const categories = useLiveQuery(() => getCategories(), [], data.categories);

  return (
    <PageContainer
      title={m.incomes()}
      actions={<NewTransactionModal categories={categories} type="income" />}
    >
      <FilterTransactions
        categories={categories}
        search={search}
        yearMonth={yearMonth}
        categoryId={categoryId}
        onSearch={(value) => setSearch(value)}
        onYearMonthChange={(value) => setYearMonth(value)}
        onCategoryChange={(value) => setCategoryId(value)}
      />

      {incomes.length === 0 ? (
        <p className="text-center">{m["transactions.empty"]()}</p>
      ) : (
        <TransactionList
          transactions={incomes}
          currency={appState.currency}
          onClick={(transaction) => setSelectedTransaction(transaction)}
        />
      )}

      <TransactionDetailsModal
        transaction={selectedTransaction}
        categories={categories}
        onClose={() => setSelectedTransaction(null)}
      />
    </PageContainer>
  );
}
