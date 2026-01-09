import { useAccounts } from "@/api/accounts";
import { useExpenses, useIncomes } from "@/api/transactions";
import { getBeginningOfYear } from "@/utils/get-beginning-of-year";
import { getEndOfYear } from "@/utils/get-end-of-year";

export function useBalance(year: number) {
  const beggingOfYear = getBeginningOfYear(year);
  const endOfYear = getEndOfYear(year);

  const accounts = useAccounts();
  const incomes = useIncomes(beggingOfYear, endOfYear);
  const expenses = useExpenses(beggingOfYear, endOfYear);

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
