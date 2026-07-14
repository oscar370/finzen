import { Select, TextInput, YearMonthInput } from "#/components/ui/form";
import { translate } from "#/lib/utils";
import { m } from "#/paraglide/messages";
import type { Category } from "#/types/categories";

type FilterTransactionsProps = {
  categories: Category[];
  search: string | undefined;
  yearMonth: string | undefined;
  categoryId: number | undefined;
  onSearch: (search: string | undefined) => void;
  onYearMonthChange: (yearMonth: string | undefined) => void;
  onCategoryChange: (categoryId: number | undefined) => void;
};

export function FilterTransactions({
  categories,
  search,
  yearMonth,
  categoryId,
  onSearch,
  onYearMonthChange,
  onCategoryChange,
}: FilterTransactionsProps) {
  return (
    <div className="collapse-arrow bg-base-200 collapse">
      <input id="filters" name="filters" type="checkbox" />
      <label htmlFor="filters" className="collapse-title">
        {m.filters()}
      </label>
      <div className="collapse-content space-y-2">
        <TextInput
          name="search"
          label={m.search()}
          value={search}
          onChange={onSearch}
          type="search"
        />

        <YearMonthInput
          name="yearMonth"
          label={m.year_month()}
          value={yearMonth}
          onChange={onYearMonthChange}
        />

        <Select
          name="category"
          label={m.categories()}
          value={categoryId}
          onChange={onCategoryChange}
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {translate(category.name)}
            </option>
          ))}
        </Select>
      </div>
    </div>
  );
}
