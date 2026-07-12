import { MONTHS } from "#/lib/constants";
import { formatDateValue } from "#/lib/utils";
import type { FieldElementProps, FormProps, FormSchema } from "@formisch/react";
import { Form as FormBase } from "@formisch/react";
import * as React from "react";

type BaseFieldProps = Partial<Omit<FieldElementProps, "onChange">>;

export function Form<TSchema extends FormSchema>({ ...rest }: FormProps<TSchema>) {
  return <FormBase {...rest} className="space-y-2" />;
}

type TextInputProps = BaseFieldProps & {
  errors?: [string, ...string[]] | null;
  type?: "text" | "email" | "tel" | "password" | "url" | "search" | "month";
  placeholder?: string;
  label: string;
  value: string | undefined;
  onChange: (value: string | undefined) => void;
};

export function TextInput({
  errors,
  type,
  placeholder,
  label,
  value,
  onChange,
  name,
  ...rest
}: TextInputProps) {
  return (
    <div className="flex flex-col">
      <label className="input has-aria-invalid:input-error w-full">
        <span className="label">{label}</span>

        <input
          {...rest}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value ?? ""}
          onChange={(e) => onChange(e.currentTarget.value)}
          aria-invalid={!!errors}
          aria-errormessage={`${name}-error`}
        />
      </label>

      {errors && (
        <div id={`${name}-error`} className="text-error mt-0.5 text-sm">
          {errors[0]}
        </div>
      )}
    </div>
  );
}

type NumberInputProps = BaseFieldProps & {
  errors?: [string, ...string[]] | null;
  placeholder?: string;
  label: string;
  value: number | undefined;
  onChange: (value: number | undefined) => void;
};

export function NumberInput({
  errors,
  placeholder,
  label,
  value,
  onChange,
  name,
  ...rest
}: NumberInputProps) {
  return (
    <div className="flex flex-col">
      <label className="input has-aria-invalid:input-error w-full">
        <span className="label">{label}</span>
        <input
          {...rest}
          name={name}
          type="number"
          placeholder={placeholder}
          value={value ?? ""}
          onChange={(e) => {
            const v = e.currentTarget.value;
            onChange(v ? Number(v) : undefined);
          }}
          aria-invalid={!!errors}
          aria-errormessage={`${name}-error`}
        />
      </label>

      {errors && (
        <div id={`${name}-error`} className="text-error mt-0.5 text-sm">
          {errors[0]}
        </div>
      )}
    </div>
  );
}

type DateInputProps = BaseFieldProps & {
  errors?: [string, ...string[]] | null;
  label: string;
  value: Date | undefined;
  onChange: (value: Date | undefined) => void;
};

export function DateInput({ errors, label, value, onChange, name, ...rest }: DateInputProps) {
  return (
    <div className="flex flex-col">
      <label className="input has-aria-invalid:input-error w-full">
        <span className="label">{label}</span>
        <input
          {...rest}
          name={name}
          type="date"
          value={formatDateValue(value)}
          onChange={(e) => {
            const v = e.currentTarget.value;
            onChange(v ? new Date(v) : undefined);
          }}
          aria-invalid={!!errors}
          aria-errormessage={`${name}-error`}
        />
      </label>

      {errors && (
        <div id={`${name}-error`} className="text-error mt-0.5 text-sm">
          {errors[0]}
        </div>
      )}
    </div>
  );
}

type TextareaProps = BaseFieldProps & {
  errors?: [string, ...string[]] | null;
  label: string;
  value: string | undefined;
  onChange: (value: string | undefined) => void;
};

export function Textarea({ errors, label, value, onChange, name, ...rest }: TextareaProps) {
  return (
    <div className="flex flex-col">
      <label className="floating-label">
        <textarea
          {...rest}
          className="textarea aria-invalid:textarea-error w-full"
          name={name}
          placeholder={label}
          value={value ?? ""}
          onChange={(e) => onChange(e.currentTarget.value)}
          aria-invalid={!!errors}
          aria-errormessage={`${name}-error`}
        />
        <span>{label}</span>
      </label>

      {errors && (
        <div id={`${name}-error`} className="text-error mt-0.5 text-sm">
          {errors[0]}
        </div>
      )}
    </div>
  );
}

type SelectProps<T extends string | number | undefined> = BaseFieldProps & {
  errors?: [string, ...string[]] | null;
  label: string;
  value: T;
  onChange: (value: T) => void;
  children: React.ReactNode;
};

export function Select<T extends string | number | undefined>({
  errors,
  label,
  value,
  onChange,
  children,
  name,
  ...rest
}: SelectProps<T>) {
  return (
    <div className="flex flex-col">
      <label className="select has-aria-invalid:select-error w-full">
        <span className="label">{label}</span>
        <select
          {...rest}
          name={name}
          value={value ?? ""}
          onChange={(e) => {
            const v = e.currentTarget.value;
            onChange((typeof value === "number" ? Number(v) : v) as T);
          }}
          aria-invalid={!!errors}
          aria-errormessage={`${name}-error`}
        >
          {children}
        </select>
      </label>

      {errors && (
        <div id={`${name}-error`} className="text-error mt-0.5 text-sm">
          {errors[0]}
        </div>
      )}
    </div>
  );
}

type MonthYearInputProps = {
  name?: string;
  errors?: [string, ...string[]] | null;
  label: string;
  value: string | undefined;
  onChange: (value: string | undefined) => void;
};

export function MonthYearInput({ errors, label, value, onChange, name }: MonthYearInputProps) {
  const initialYear = value ? parseInt(value.split("-")[0], 10) : new Date().getFullYear();
  const [viewYear, setViewYear] = React.useState(initialYear);
  const detailsRef = React.useRef<HTMLDetailsElement | null>(null);

  const handleSelect = (monthIndex: number) => {
    const monthValue = (monthIndex + 1).toString().padStart(2, "0");
    onChange(`${viewYear}-${monthValue}`);
    detailsRef.current?.removeAttribute("open");
  };

  const displayValue = value
    ? `${MONTHS[parseInt(value.split("-")[1], 10) - 1]} ${value.split("-")[0]}`
    : "";

  return (
    <div className="flex flex-col">
      <button
        className="input aria-invalid:input-error w-full cursor-pointer"
        aria-invalid={!!errors}
        aria-errormessage={`${name}-error`}
        popoverTarget={name}
        style={{ anchorName: `--${name}` }}
      >
        <span className="label">{label}</span>
        <span>{displayValue}</span>
      </button>

      <div
        className="dropdown bg-base-100 rounded-box border-base-200 mt-1 w-72 border p-4 shadow-lg"
        popover="auto"
        id={name}
        style={{ positionAnchor: `--${name}` }}
      >
        <div className="mb-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setViewYear((y) => y - 1)}
            className="btn btn-sm btn-ghost"
          >
            &laquo;
          </button>
          <span className="text-lg font-bold">{viewYear}</span>
          <button
            type="button"
            onClick={() => setViewYear((y) => y + 1)}
            className="btn btn-sm btn-ghost"
          >
            &raquo;
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {MONTHS.map((m, i) => {
            const isSelected = value === `${viewYear}-${(i + 1).toString().padStart(2, "0")}`;
            return (
              <button
                type="button"
                key={m}
                onClick={() => handleSelect(i)}
                className={`btn btn-sm ${isSelected ? "btn-neutral" : "btn-ghost"}`}
              >
                {m.substring(0, 3)}
              </button>
            );
          })}
        </div>
      </div>

      {errors && (
        <div id={`${name}-error`} className="text-error mt-0.5 text-sm">
          {errors[0]}
        </div>
      )}
    </div>
  );
}
