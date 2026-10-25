import { List } from "@/components/list";
import type { Transaction } from "@/types/transactions/transaction";
import { TransactionItem } from "./transaction-item";

type TransactionListProps = {
  transactions: Transaction[];
  currency: string;
  regionalFormat: string;
  onClick: (transaction: Transaction) => void;
};

export function TransactionList({
  transactions,
  currency,
  regionalFormat,
  onClick,
}: TransactionListProps) {
  return (
    <List>
      {transactions.map((transaction) => (
        <TransactionItem
          key={transaction.id}
          transaction={transaction}
          currency={currency}
          regionalFormat={regionalFormat}
          onClick={onClick}
        />
      ))}
    </List>
  );
}
