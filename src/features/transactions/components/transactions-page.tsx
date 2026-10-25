import {
  PageContainer,
  PageContainerActions,
  PageContainerContent,
  PageContainerHeader,
  PageContainerTittle,
} from "@/components/page-container";
import { useMemo, useState } from "react";
import type { Transaction } from "@/types/transactions/transaction";
import type { getTransactionsPageData } from "../services/get-transactions-page-data";
import { EmptyTransactions } from "./empty-transactions";
import { NewTransactionDialog } from "./new-transaction-dialog";
import { TransactionDetailsDialog } from "./transaction-details-dialog";
import { TransactionFilters } from "./transaction-filters";
import { TransactionList } from "./transactions-list";

type TransactionsPageProps = {
  title: string;
  yearMonth: string;
  onYearMonthChange: (yearMonth: string) => void;
  data: Awaited<ReturnType<typeof getTransactionsPageData>>;
  kind: "income" | "expense";
};

export function TransactionsPage({
  title,
  yearMonth,
  onYearMonthChange,
  data,
  kind,
}: TransactionsPageProps) {
  const { appState, transactions, categories } = data;
  const [selected, setSelected] = useState<Transaction | null>(null);
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined);

  const filteredTransactions = useMemo(() => {
    const query = search.trim().toLowerCase();

    return transactions.filter((transaction) => {
      const matchesSearch =
        query.length === 0 ||
        transaction.name.toLowerCase().includes(query) ||
        transaction.note.toLowerCase().includes(query);
      const matchesCategory =
        categoryId === undefined || transaction.categoryId === categoryId;

      return matchesSearch && matchesCategory;
    });
  }, [transactions, search, categoryId]);

  return (
    <PageContainer>
      <PageContainerHeader>
        <PageContainerTittle>{title}</PageContainerTittle>

        <PageContainerActions>
          <NewTransactionDialog categories={categories} type={kind} />
        </PageContainerActions>
      </PageContainerHeader>

      <PageContainerContent>
        <TransactionFilters
          yearMonth={yearMonth}
          categories={categories}
          search={search}
          categoryId={categoryId}
          onYearMonthChange={onYearMonthChange}
          onSearchChange={setSearch}
          onCategoryChange={setCategoryId}
        />

        {filteredTransactions.length === 0 ? (
          <EmptyTransactions />
        ) : (
          <TransactionList
            transactions={filteredTransactions}
            currency={appState.currency}
            regionalFormat={appState.regionalFormat}
            onClick={setSelected}
          />
        )}
      </PageContainerContent>

      <TransactionDetailsDialog
        transaction={selected}
        categories={categories}
        currency={appState.currency}
        regionalFormat={appState.regionalFormat}
        onClose={() => setSelected(null)}
      />
    </PageContainer>
  );
}
