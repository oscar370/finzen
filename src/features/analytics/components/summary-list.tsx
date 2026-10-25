import {
  List,
  ListItem,
  ListItemContent,
  ListItemSuffix,
  ListItemTitle,
} from "@/components/list";
import { formatCurrency } from "@/lib/i18n/format-currency";
import { m } from "@/paraglide/messages";

type SummaryListProps = {
  currency: string;
  regionalFormat: string;
  balance: number;
  incomes: number;
  expenses: number;
};

export function SummaryList({
  currency,
  regionalFormat,
  balance,
  incomes,
  expenses,
}: SummaryListProps) {
  return (
    <List>
      <ListItem>
        <ListItemContent>
          <ListItemTitle>{m.balance()}</ListItemTitle>
        </ListItemContent>
        <ListItemSuffix className="rounded-md bg-blue-800 px-2 text-white">
          {formatCurrency(balance, currency, regionalFormat)}
        </ListItemSuffix>
      </ListItem>

      <ListItem>
        <ListItemContent>
          <ListItemTitle>{m.monthly_incomes()}</ListItemTitle>
        </ListItemContent>
        <ListItemSuffix className="rounded-md bg-green-800 px-2 text-white">
          {formatCurrency(incomes, currency, regionalFormat)}
        </ListItemSuffix>
      </ListItem>

      <ListItem>
        <ListItemContent>
          <ListItemTitle>{m.monthly_expenses()}</ListItemTitle>
        </ListItemContent>
        <ListItemSuffix className="rounded-md bg-red-800 px-2 text-white">
          {formatCurrency(expenses, currency, regionalFormat)}
        </ListItemSuffix>
      </ListItem>
    </List>
  );
}
