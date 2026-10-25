import {
  Select as SelectBase,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { FormField, type FieldErrors } from "./form-field";

type SelectOption<T extends string | number> = {
  label: React.ReactNode;
  value: T;
};

type SelectProps<T extends string | number> = {
  label: string;
  errors: FieldErrors;
  value: T | undefined;
  onChange: (value: T | undefined) => void;
  items: SelectOption<T>[];
};

export function Select<T extends string | number>({
  label,
  errors,
  value,
  onChange,
  items,
}: SelectProps<T>) {
  return (
    <FormField label={label} errors={errors}>
      {(control) => (
        <SelectBase
          items={items}
          value={value}
          onValueChange={(v) => onChange(v ?? undefined)}
        >
          <SelectTrigger
            id={control.id}
            type="button"
            aria-invalid={control.invalid}
            className="min-w-30"
          >
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            {items.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </SelectBase>
      )}
    </FormField>
  );
}
