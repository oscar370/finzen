import { MonthInput } from "@/components/form/month-input";
import { Select } from "@/components/form/select";
import { TextInput } from "@/components/form/text-input";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { translate } from "@/lib/i18n/translate";
import { m } from "@/paraglide/messages";
import type { Category } from "@/types/categories/category";

type TransactionFiltersProps = {
  yearMonth: string;
  categories: Category[];
  search: string;
  categoryId: number | undefined;
  onYearMonthChange: (value: string) => void;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: number | undefined) => void;
};

export function TransactionFilters({
  yearMonth,
  categories,
  search,
  categoryId,
  onYearMonthChange,
  onSearchChange,
  onCategoryChange,
}: TransactionFiltersProps) {
  return (
    <Collapsible>
      <CollapsibleTrigger>
        <span className="flex-1">{m.filters()}</span>
      </CollapsibleTrigger>

      <CollapsibleContent className="space-y-3">
        <TextInput
          label={m.search()}
          errors={null}
          value={search}
          onChange={(value) => onSearchChange(value ?? "")}
          type="search"
          placeholder={m.search_placeholder()}
        />

        <MonthInput
          label={m.year_month()}
          errors={null}
          value={yearMonth}
          onChange={(value) => {
            if (value) onYearMonthChange(value);
          }}
        />

        <Select
          label={m.category()}
          errors={null}
          value={categoryId === undefined ? "all" : String(categoryId)}
          onChange={(value) =>
            onCategoryChange(value === "all" ? undefined : Number(value))
          }
          items={[
            { label: m.all_categories(), value: "all" },
            ...categories.map((category) => ({
              label: translate(category.name),
              value: String(category.id),
            })),
          ]}
        />
      </CollapsibleContent>
    </Collapsible>
  );
}
