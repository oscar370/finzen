import { CATEGORY_ICONS } from "#/lib/constants";
import { formatCurrency } from "#/lib/utils";
import { m } from "#/paraglide/messages";
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
    <li className="list-row items-center">
      <div>
        <Icon />
      </div>
      <div className="flex flex-col">
        <span>{transaction.name}</span>
        <span className="label">{transaction.date.toLocaleDateString()}</span>
      </div>
      <span className={`${isIncome ? "bg-green-800" : "bg-red-800"} rounded-md px-2 text-white`}>
        {formatCurrency(transaction.amount, currency)}
      </span>
      <button
        className="btn btn-sm btn-square btn-ghost"
        aria-label={m.open_details()}
        onClick={() => onClick(transaction)}
      >
        <ChevronRight />
      </button>
    </li>
  );
}
