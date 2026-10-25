import { FormField, type FieldErrors } from "./form-field";
import { Switch as SwitchBase } from "../ui/switch";

type SwitchProps = {
  label: string;
  errors: FieldErrors;
  value: boolean | undefined;
  onChange: (value: boolean | undefined) => void;
  disabled?: boolean;
};

export function Switch({
  label,
  errors,
  value,
  onChange,
  disabled,
}: SwitchProps) {
  return (
    <FormField label={label} errors={errors}>
      {(control) => (
        <SwitchBase
          id={control.id}
          aria-invalid={control.invalid}
          checked={value ?? false}
          disabled={disabled}
          onCheckedChange={(checked) => onChange(checked)}
        />
      )}
    </FormField>
  );
}
