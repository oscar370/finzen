import clsx from "clsx";
import CurrencyInputField from "react-currency-input-field";

import { useContext } from "react";
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
  type RegisterOptions,
} from "react-hook-form";
import { GroupContext } from "../group";

type CurrencyInputProps<T extends FieldValues> = {
  currency: string;
  children: React.ReactNode;
  name: Path<T>;
  control: Control<T>;
  rules?: RegisterOptions<T, Path<T>>;
  variant?: keyof typeof containerVariants;
};

const baseStyles = {
  container: clsx(
    "flex h-12 w-full cursor-pointer items-center justify-between",
    "bg-[color-mix(in_srgb,var(--background),var(--text)_15%)]",
    "px-3.5",
    "hover:bg-[color-mix(in_srgb,var(--background),var(--text)_10%)]",
  ),
  input: clsx(
    "w-fit rounded-md",
    "bg-[color-mix(in_srgb,var(--background),var(--text)_20%)]",
    "px-2 py-1",
    "placeholder:opacity-70",
  ),
};

const containerVariants = {
  default: clsx(baseStyles.container, "rounded-xl"),
  group: clsx(baseStyles.container, "first:rounded-t-xl last:rounded-b-xl"),
  form: clsx(
    baseStyles.container,
    "grid grid-cols-3",
    "rounded-lg",
    "bg-transparent",
  ),
};

const inputVariants = {
  default: baseStyles.input,
  group: baseStyles.input,
  form: clsx(
    "col-start-2 col-end-4",
    "rounded-md",
    "bg-[color-mix(in_srgb,var(--background),var(--text)_15%)]",
    "px-2 py-1",
  ),
};

export function CurrencyInput<T extends FieldValues>({
  currency,
  children,
  name,
  control,
  rules,
  variant = "default",
}: CurrencyInputProps<T>) {
  const locale = navigator.language;
  const isGrouped = useContext(GroupContext);
  const finalVariant = isGrouped ? "group" : variant;
  const containerStyles = containerVariants[finalVariant];
  const inputStyles = inputVariants[finalVariant];

  return (
    <label className={containerStyles}>
      <span className="shrink-0 whitespace-nowrap">{children}</span>
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field }) => (
          <CurrencyInputField
            className={inputStyles}
            intlConfig={{ locale, currency }}
            value={field.value ?? ""}
            onValueChange={(value) => {
              field.onChange(value ? Number(value) : null);
            }}
          />
        )}
      />
    </label>
  );
}
