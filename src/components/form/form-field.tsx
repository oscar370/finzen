import { useId } from "react";
import { Field, FieldError, FieldLabel } from "../ui/field";

export type FieldErrors = [string, ...string[]] | null;

type ControlProps = {
  id: string;
  invalid: boolean;
};

type FormFieldProps = {
  label: string;
  errors: FieldErrors;
  children: (control: ControlProps) => React.ReactNode;
};

export function FormField({ label, errors, children }: FormFieldProps) {
  const id = useId();
  const invalid = errors !== null;

  return (
    <Field data-invalid={invalid}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      {children({ id, invalid })}
      {errors && <FieldError errors={errors.map((message) => ({ message }))} />}
    </Field>
  );
}
