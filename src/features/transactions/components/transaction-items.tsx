import { ActionRow } from "@/components/ui/action-row";
import { categoriesIcons } from "@/data/categories-icons";
import { useAppStore } from "@/stores/use-app-store";
import type { Transaction } from "@/types/transactions";
import { formatCurrency } from "@/utils/format-currency";
import dayjs from "dayjs";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

type TransactionItemsProps = {
  transactions: Transaction[];
};

export function TransactionItems({ transactions }: TransactionItemsProps) {
  const currency = useAppStore((state) => state.currency);

  return (
    <>
      {transactions.map(({ id, name, amount, kind, categoryIcon, date }) => {
        const Icon = categoriesIcons[categoryIcon];

        return (
          <ActionRow
            key={id}
            title={name}
            subtitle={dayjs(date).format("LL")}
            icon={<Icon />}
            accent={kind === "income" ? "text-green-600" : "text-red-600"}
            as={Link}
            forceHover
            to={`/transactions/${id}`}
          >
            <div className="flex items-center justify-center">
              <span
                className={`rounded-md px-1 ${kind === "income" ? "bg-green-200 dark:bg-green-900" : "bg-red-200 dark:bg-red-900"}`}
              >
                {formatCurrency(currency, amount)}
              </span>
              <ChevronRight />
            </div>
          </ActionRow>
        );
      })}
    </>
  );
}
