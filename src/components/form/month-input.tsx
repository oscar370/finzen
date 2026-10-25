import { MonthPicker } from "../month-picker";
import { FormField, type FieldErrors } from "./form-field";

type MonthInputProps = {
  label: string;
  errors: FieldErrors;
  value: string | undefined;
  onChange: (value: string | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
};

export function MonthInput({
  label,
  errors,
  value,
  onChange,
  placeholder,
  disabled,
}: MonthInputProps) {
  return (
    <FormField label={label} errors={errors}>
      {(control) => (
        <MonthPicker
          id={control.id}
          value={value ?? ""}
          aria-invalid={control.invalid}
          onChange={(next) => onChange(next || undefined)}
          placeholder={placeholder}
          disabled={disabled}
        />
      )}
    </FormField>
  );
}
