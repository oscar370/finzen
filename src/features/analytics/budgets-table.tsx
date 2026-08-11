import { formatCurrency, translate } from "#/lib/utils";
import { m } from "#/paraglide/messages";
import type { Budget } from "#/types/budgets";
import type { Transaction } from "#/types/transactions";
import { buildBudgetSummary } from "./analytics.utils";

type BudgetsTableProps = {
  budgets: Budget[];
  transactions: Transaction[];
  currency: string;
  type: "expense" | "income";
};

export function BudgetsTable({ budgets, transactions, currency, type }: BudgetsTableProps) {
  const budgetSummary = buildBudgetSummary(budgets, transactions, type);

  return (
    <div className="rounded-box bg-base-200 overflow-x-auto">
      <table className="table">
        <thead>
          <tr>
            <th>{m.category()}</th>
            <th>{m.expected()}</th>
            <th>{m.real()}</th>
            <th>{m.difference()}</th>
          </tr>
        </thead>

        <tbody>
          {budgetSummary.length === 0 ? (
            <tr>
              <th className="h-24 text-center" colSpan={4}>
                {m["budgets.empty"]()}
              </th>
            </tr>
          ) : (
            budgetSummary.map((summary) => (
              <tr key={summary.name}>
                <th>{translate(summary.name)}</th>
                <th>{formatCurrency(summary.budgeted, currency)}</th>
                <th>{formatCurrency(summary.real, currency)}</th>
                <th>{formatCurrency(summary.difference, currency)}</th>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
