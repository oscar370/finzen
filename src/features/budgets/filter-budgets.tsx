import { YearMonthInput } from "#/components/ui/form";
import { m } from "#/paraglide/messages";

type FilterBudgetsProps = {
  yearMonth: string | undefined;
  onYearMonthChange: (yearMonth: string | undefined) => void;
};

export function FilterBudgets({ yearMonth, onYearMonthChange }: FilterBudgetsProps) {
  return (
    <div className="collapse-arrow bg-base-200 collapse">
      <input id="filters" name="filters" type="checkbox" />
      <label htmlFor="filters" className="collapse-title">
        {m.filters()}
      </label>
      <div className="collapse-content space-y-2">
        <YearMonthInput
          name="yearMonth"
          label={m.year_month()}
          value={yearMonth}
          onChange={onYearMonthChange}
        />
      </div>
    </div>
  );
}
