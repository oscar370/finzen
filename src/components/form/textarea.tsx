import { Textarea as TextareaBase } from "../ui/textarea";
import { FormField, type FieldErrors } from "./form-field";

type TextareaProps = {
  label: string;
  errors: FieldErrors;
  value: string | undefined;
  onChange: (value: string | undefined) => void;
};

export function Textarea({ label, errors, value, onChange }: TextareaProps) {
  return (
    <FormField label={label} errors={errors}>
      {(control) => (
        <TextareaBase
          id={control.id}
          value={value ?? ""}
          aria-invalid={control.invalid}
          onChange={(e) => onChange(e.currentTarget.value)}
        />
      )}
    </FormField>
  );
}
