import { CurrencyNavigation } from "@/components/ui/currency-navigation";
import type { Transaction } from "@/types/transactions";
import dayjs from "dayjs";
import { TransactionIcon } from "./transaction-icon";

type TransactionsListProps = {
  data: Transaction[];
};

export function TransactionsList({ data }: TransactionsListProps) {
  return (
    <>
      {data.map(({ id, name, amount, kind, categoryIcon, date }) => (
        <CurrencyNavigation
          to={`/transactions/${id}`}
          key={id}
          variant={kind}
          balance={amount}
        >
          <div className="grid w-full grid-cols-[min-content_auto] items-center justify-center gap-2">
            <TransactionIcon icon={categoryIcon} kind={kind} />

            <div className="flex flex-col">
              <span>{name}</span>
              <span className="text-sm text-(--text)/80">
                {dayjs(date).format("LL")}
              </span>
            </div>
          </div>
        </CurrencyNavigation>
      ))}
    </>
  );
}
