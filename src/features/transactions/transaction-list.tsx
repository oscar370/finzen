import type { Transaction } from "#/types/transactions";
import { TransactionItem } from "./transaction-item";

type TransactionListProps = {
  transactions: Transaction[];
  currency: string;
  onClick: (transaction: Transaction) => void;
};

export function TransactionList({ transactions, currency, onClick }: TransactionListProps) {
  return (
    <ul className="list rounded-box bg-base-200">
      {transactions.map((transaction) => (
        <TransactionItem
          key={transaction.id}
          transaction={transaction}
          currency={currency}
          onClick={(txn) => onClick(txn)}
        />
      ))}
    </ul>
  );
}
