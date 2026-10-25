import { Input } from "../ui/input";
import { FormField, type FieldErrors } from "./form-field";

type NumberInputProps = {
  label: string;
  errors: FieldErrors;
  value: number | undefined;
  onChange: (value: number | undefined) => void;
};

export function NumberInput({
  label,
  errors,
  value,
  onChange,
}: NumberInputProps) {
  return (
    <FormField label={label} errors={errors}>
      {(control) => (
        <Input
          id={control.id}
          value={value ?? ""}
          aria-invalid={control.invalid}
          type="number"
          onChange={(e) => {
            const raw = e.currentTarget.value;
            const parsed = raw ? Number(raw) : undefined;
            onChange(
              parsed === undefined || Number.isNaN(parsed) ? undefined : parsed
            );
          }}
        />
      )}
    </FormField>
  );
}
