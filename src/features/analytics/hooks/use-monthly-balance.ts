import { useAccounts } from "@/api/accounts";
import { useExpenses, useIncomes } from "@/api/transactions";
import { getBeginningOfMonth } from "@/utils/get-beginning-of-month";
import { getEndOfMonth } from "@/utils/get-end-of-month";

export function useMonthlyBalance(year: number, month: number) {
  const beggingOfMonth = getBeginningOfMonth(year, month);
  const endOfMonth = getEndOfMonth(year, month);

  const accounts = useAccounts();
  const incomes = useIncomes(beggingOfMonth, endOfMonth);
  const expenses = useExpenses(beggingOfMonth, endOfMonth);

  const totalAccounts = accounts.reduce(
    (prev, account) => prev + account.balance,
    0,
  );

  const totalIncomes = incomes.reduce(
    (prev, transaction) => prev + transaction.amount,
    0,
  );

  const totalExpenses = expenses.reduce(
    (prev, transaction) => prev + transaction.amount,
    0,
  );

  const saving = totalIncomes - totalExpenses;

  const balance = totalAccounts + saving;

  return {
    totalIncomes,
    totalExpenses,
    saving,
    balance,
  };
}
