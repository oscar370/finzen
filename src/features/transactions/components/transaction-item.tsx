import {
  ListItem,
  ListItemContent,
  ListItemDescription,
  ListItemPrefix,
  ListItemSuffix,
  ListItemTitle,
} from "@/components/list";
import { CATEGORY_ICONS } from "@/lib/constants/category-icons";
import { formatCurrency } from "@/lib/i18n/format-currency";
import { translate } from "@/lib/i18n/translate";
import type { Transaction } from "@/types/transactions/transaction";
import { ChevronRight, CircleHelp } from "lucide-react";

type TransactionItemProps = {
  transaction: Transaction;
  currency: string;
  regionalFormat: string;
  onClick: (transaction: Transaction) => void;
};

export function TransactionItem({
  transaction,
  currency,
  regionalFormat,
  onClick,
}: TransactionItemProps) {
  const Icon = CATEGORY_ICONS[transaction.categoryIcon] ?? CircleHelp;
  const isIncome = transaction.kind === "income";

  return (
    <ListItem
      render={<button type="button" />}
      onClick={() => onClick(transaction)}
    >
      <ListItemPrefix>
        <Icon />
      </ListItemPrefix>

      <ListItemContent>
        <ListItemTitle>{transaction.name}</ListItemTitle>
        <ListItemDescription>
          {transaction.date.toLocaleDateString(regionalFormat)} ·{" "}
          {translate(transaction.categoryName)}
        </ListItemDescription>
      </ListItemContent>

      <ListItemSuffix>
        <span
          className={`${isIncome ? "bg-green-800" : "bg-red-800"} rounded-md px-2 text-white`}
        >
          {formatCurrency(transaction.amount, currency, regionalFormat)}
        </span>

        <ChevronRight />
      </ListItemSuffix>
    </ListItem>
  );
}
