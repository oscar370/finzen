import { formatCurrency } from "#/lib/utils";
import { m } from "#/paraglide/messages";
import type { AppState } from "#/types/app-state";
import type { MonthlySummary } from "#/types/monthly-summaries";

type SummaryListProps = {
  appState: AppState;
  monthlySummary?: MonthlySummary;
};

export function SummaryList({ appState, monthlySummary }: SummaryListProps) {
  return (
    <ul className="list bg-base-200 rounded-box">
      <li className="list-row">
        <div className="list-col-grow">
          <span>{m.balance()}</span>
        </div>
        <div className="rounded-md bg-blue-800 px-2 text-white">
          {formatCurrency(appState.balance, appState.currency)}
        </div>
      </li>

      <li className="list-row">
        <div className="list-col-grow">
          <span>{m.monthly_incomes()}</span>
        </div>
        <div className="rounded-md bg-green-800 px-2 text-white">
          {formatCurrency(monthlySummary?.income ?? 0, appState.currency)}
        </div>
      </li>

      <li className="list-row">
        <div className="list-col-grow">
          <span>{m.monthly_expenses()}</span>
        </div>
        <div className="rounded-md bg-red-800 px-2 text-white">
          {formatCurrency(monthlySummary?.expense ?? 0, appState.currency)}
        </div>
      </li>
    </ul>
  );
}
