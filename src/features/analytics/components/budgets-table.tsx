import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/i18n/format-currency";
import { translate } from "@/lib/i18n/translate";
import { m } from "@/paraglide/messages";
import type { BudgetSummary } from "@/types/budgets/budget-summary";

type BudgetsTableProps = {
  budgetsSummary: BudgetSummary[];
  currency: string;
  regionalFormat: string;
};

export function BudgetsTable({
  budgetsSummary,
  currency,
  regionalFormat,
}: BudgetsTableProps) {
  return (
    <Table className="overflow-hidden rounded-2xl bg-muted/50">
      <TableHeader>
        <TableRow>
          <TableHead>{m.category()}</TableHead>
          <TableHead>{m.expected()}</TableHead>
          <TableHead>{m.real()}</TableHead>
          <TableHead>{m.difference()}</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {budgetsSummary.length === 0 ? (
          <TableRow>
            <TableCell className="h-24 text-center" colSpan={4}>
              {m.empty_budgets()}
            </TableCell>
          </TableRow>
        ) : (
          budgetsSummary.map((summary, index) => (
            <TableRow key={`${summary.name}-${index}`}>
              <TableCell>{translate(summary.name)}</TableCell>
              <TableCell>
                {formatCurrency(summary.budgeted, currency, regionalFormat)}
              </TableCell>
              <TableCell>
                {formatCurrency(summary.real, currency, regionalFormat)}
              </TableCell>
              <TableCell>
                {formatCurrency(summary.difference, currency, regionalFormat)}
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
