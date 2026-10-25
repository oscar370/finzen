import { formatDateValue } from "@/lib/utils/format-date-value";
import { Input } from "../ui/input";
import { FormField, type FieldErrors } from "./form-field";

type DateInputProps = {
  label: string;
  errors: FieldErrors;
  value: Date | undefined;
  onChange: (value: Date | undefined) => void;
  disabled?: boolean;
};

export function DateInput({
  label,
  errors,
  value,
  onChange,
  disabled,
}: DateInputProps) {
  return (
    <FormField label={label} errors={errors}>
      {(control) => (
        <Input
          id={control.id}
          type="date"
          value={formatDateValue(value)}
          aria-invalid={control.invalid}
          disabled={disabled}
          onChange={(event) => {
            const next = event.currentTarget.value;
            onChange(next ? new Date(`${next}T00:00:00`) : undefined);
          }}
        />
      )}
    </FormField>
  );
}
