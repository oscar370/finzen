export type BalanceTransaction = {
  kind: "income" | "expense";
  amount: number;
};

export function calculateBalance(
  balance: number,
  transaction: BalanceTransaction,
  mode: "add" | "remove"
): number {
  const factor = transaction.kind === "income" ? 1 : -1;
  const direction = mode === "add" ? 1 : -1;

  return Number((balance + transaction.amount * factor * direction).toFixed(2));
}
