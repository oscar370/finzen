import clsx from "clsx";
import { useContext, type InputHTMLAttributes } from "react";
import type {
  FieldValues,
  Path,
  RegisterOptions,
  UseFormRegister,
} from "react-hook-form";
import { GroupContext } from "../group";

type InputProps<T extends FieldValues> =
  InputHTMLAttributes<HTMLInputElement> & {
    children: React.ReactNode;
    name: Path<T>;
    register: UseFormRegister<T>;
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

export function Input<T extends FieldValues>({
  children,
  variant = "default",
  name,
  register,
  rules,
  ...props
}: InputProps<T>) {
  const isGrouped = useContext(GroupContext);
  const finalVariant = isGrouped ? "group" : variant;
  const containerStyles = containerVariants[finalVariant];
  const inputStyles = inputVariants[finalVariant];

  return (
    <label className={containerStyles}>
      <span className="shrink-0 cursor-pointer whitespace-nowrap">
        {children}
      </span>
      <input className={inputStyles} {...props} {...register(name, rules)} />
    </label>
  );
}
