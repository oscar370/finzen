import { CATEGORY_ICONS } from "#/lib/constants";
import { formatCurrency } from "#/lib/utils";
import type { Transaction } from "#/types/transactions";
import { ChevronRight } from "lucide-react";

type TransactionItemProps = {
  transaction: Transaction;
  currency: string;
  onClick: (transaction: Transaction) => void;
};

export function TransactionItem({ transaction, currency, onClick }: TransactionItemProps) {
  const Icon = CATEGORY_ICONS[transaction.categoryIcon];
  const isIncome = transaction.kind === "income";

  return (
    <li>
      <button
        className="list-row w-full cursor-pointer items-center"
        onClick={() => onClick(transaction)}
      >
        <div>
          <Icon />
        </div>
        <div className="flex flex-col text-start">
          <span>{transaction.name}</span>
          <span className="label">{transaction.date.toLocaleDateString()}</span>
        </div>
        <span className={`${isIncome ? "bg-green-800" : "bg-red-800"} rounded-md px-2 text-white`}>
          {formatCurrency(transaction.amount, currency)}
        </span>

        <ChevronRight />
      </button>
    </li>
  );
}
