import clsx from "clsx";
import { useContext, type TextareaHTMLAttributes } from "react";
import type {
  FieldValues,
  Path,
  RegisterOptions,
  UseFormRegister,
} from "react-hook-form";
import { GroupContext } from "../group";

type TextAreaProps<T extends FieldValues> =
  TextareaHTMLAttributes<HTMLTextAreaElement> & {
    children: React.ReactNode;
    name: Path<T>;
    register: UseFormRegister<T>;
    rules?: RegisterOptions<T, Path<T>>;
    variant?: keyof typeof containerVariants;
  };

const baseStyles = {
  container: clsx(
    "block h-fit w-full cursor-pointer",
    "bg-[color-mix(in_srgb,var(--background),var(--text)_15%)]",
    "px-3.5 py-2",
    "hover:bg-[color-mix(in_srgb,var(--background),var(--text)_10%)]",
  ),
  textArea: clsx(
    "block w-full rounded-md",
    "bg-[color-mix(in_srgb,var(--background),var(--text)_20%)]",
    "px-2 py-1",
    "placeholder:opacity-70",
  ),
};

const containerVariants = {
  default: clsx(baseStyles.container, "rounded-xl"),
  group: clsx(baseStyles.container, "first:rounded-t-xl last:rounded-b-xl"),
  form: clsx(baseStyles.container, "rounded-lg", "bg-transparent"),
};

const textAreaVariants = {
  default: baseStyles.textArea,
  group: baseStyles.textArea,
  form: clsx(
    baseStyles.textArea,
    "rounded-md",
    "bg-[color-mix(in_srgb,var(--background),var(--text)_15%)]",
    "px-2 py-1",
  ),
};

export function TextArea<T extends FieldValues>({
  children,
  name,
  register,
  rules,
  variant = "default",
  ...props
}: TextAreaProps<T>) {
  const isGrouped = useContext(GroupContext);
  const finalVariant = isGrouped ? "group" : variant;
  const containerStyles = containerVariants[finalVariant];
  const inputStyles = textAreaVariants[finalVariant];

  return (
    <label className={containerStyles}>
      <span className="shrink-0 cursor-pointer whitespace-nowrap">
        {children}
      </span>
      <textarea className={inputStyles} {...props} {...register(name, rules)} />
    </label>
  );
}
