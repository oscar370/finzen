import { MonthInput } from "@/components/form/month-input";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { m } from "@/paraglide/messages";

type HomeFiltersProps = {
  yearMonth: string;
  onYearMonthChange: (value: string) => void;
};

export function HomeFilters({
  yearMonth,
  onYearMonthChange,
}: HomeFiltersProps) {
  return (
    <Collapsible>
      <CollapsibleTrigger>
        <span className="flex-1">{m.filters()}</span>
      </CollapsibleTrigger>

      <CollapsibleContent className="space-y-3">
        <MonthInput
          label={m.year_month()}
          errors={null}
          value={yearMonth}
          onChange={(value) => {
            if (value) onYearMonthChange(value);
          }}
        />
      </CollapsibleContent>
    </Collapsible>
  );
}
