import { Input } from "../ui/input";
import { FormField, type FieldErrors } from "./form-field";

type TextInputProps = {
  label: string;
  errors: FieldErrors;
  value: string | undefined;
  onChange: (value: string | undefined) => void;
  type?: "text" | "email" | "tel" | "password" | "url" | "search";
  placeholder?: string;
};

export function TextInput({
  label,
  errors,
  value,
  onChange,
  type,
  placeholder,
}: TextInputProps) {
  return (
    <FormField label={label} errors={errors}>
      {(control) => (
        <Input
          id={control.id}
          value={value ?? ""}
          aria-invalid={control.invalid}
          type={type}
          placeholder={placeholder}
          onChange={(e) => onChange(e.currentTarget.value)}
        />
      )}
    </FormField>
  );
}
