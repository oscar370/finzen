import clsx from "clsx";
import { useContext, useRef } from "react";
import type {
  FieldErrors,
  FieldValues,
  Path,
  RegisterOptions,
  UseFormRegister,
} from "react-hook-form";
import { Error } from "../error";
import { GroupContext } from "../group";

type SelectProps<T extends FieldValues> = {
  children: React.ReactNode;
  label: string;
  name: Path<T>;
  register: UseFormRegister<T>;
  rules?: RegisterOptions<T, Path<T>>;
  errors?: FieldErrors<T>;
  variant?: keyof typeof variants;
};

const baseStyles = {
  container: clsx(
    "flex h-12 w-full cursor-pointer items-center justify-between",
    "bg-[color-mix(in_srgb,var(--background),var(--text)_15%)]",
    "px-3.5",
    "hover:bg-[color-mix(in_srgb,var(--background),var(--text)_10%)]",
  ),
  select: clsx(
    "cursor-pointer",
    "bg-[color-mix(in_srgb,var(--background),var(--text)_15%)]",
    "px-2 py-1",
    "hover:bg-[color-mix(in_srgb,var(--background),var(--text)_10%)]",
    "focus:outline-0",
  ),
};

const variants = {
  default: clsx(baseStyles.container, "rounded-xl shadow-sm"),
  group: clsx(baseStyles.container, "first:rounded-t-xl last:rounded-b-xl"),
  form: clsx(
    "grid h-12 w-full cursor-pointer",
    "grid-cols-3 items-center justify-center",
    "rounded-lg bg-transparent px-3.5",
    "shadow-none",
    "hover:bg-[color-mix(in_srgb,var(--background),var(--text)_10%)]",
  ),
};

const selectVariants = {
  default: baseStyles.select,
  group: baseStyles.select,
  form: clsx(
    "col-start-2 col-end-4 rounded-md",
    "bg-[color-mix(in_srgb,var(--background),var(--text)_15%)]",
    "px-2 py-1",
  ),
};

export function Select<T extends FieldValues>({
  children,
  label,
  name,
  register,
  rules,
  errors,
  variant = "default",
}: SelectProps<T>) {
  const selectRef = useRef<HTMLSelectElement>(null);
  const isGrouped = useContext(GroupContext);
  const finalVariant = isGrouped ? "group" : variant;
  const styles = variants[finalVariant];
  const selectStyles = selectVariants[finalVariant];
  const { ref, ...rest } = register(name, rules);

  function handleOpenSelect() {
    selectRef.current?.showPicker();
  }

  return (
    <label className={styles} onClick={handleOpenSelect}>
      <span>
        {label}

        {errors?.[name]?.message && (
          <Error> {String(errors[name].message)} </Error>
        )}
      </span>
      <select
        className={selectStyles}
        ref={(el) => {
          ref(el);
          selectRef.current = el;
        }}
        {...rest}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </select>
    </label>
  );
}
