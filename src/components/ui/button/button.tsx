import clsx from "clsx";
import { useContext, type ButtonHTMLAttributes } from "react";
import { GroupContext } from "../group";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  variant?: keyof typeof variants;
  className?: string;
};

const baseStyles = clsx("cursor-pointer transition-colors", "w-fit");
const destructiveStyles = clsx(
  "hover:bg-[color-mix(in_srgb,var(--color-red-400),var(--text)_10%)]",
  "dark:hover:bg-[color-mix(in_srgb,var(--color-red-800),var(--text)_10%)]",
);
const flatStyles = clsx(
  "hover:bg-[color-mix(in_srgb,var(--background),var(--text)_20%)]",
);
const smallStyles = clsx("rounded-lg", "px-2 py-1", "text-sm");

const variants = {
  primary: clsx(
    baseStyles,
    "h-11 min-w-60",
    "rounded-4xl",
    "px-3 py-2",
    "bg-[color-mix(in_srgb,var(--primary),var(--text)_15%)]",
    "hover:bg-[color-mix(in_srgb,var(--primary),var(--text)_10%)]",
  ),
  nav: clsx(
    "h-11 w-full",
    "cursor-pointer transition-colors",
    "rounded-lg",
    "px-3 py-2",
    "text-start",
    "hover:bg-[color-mix(in_srgb,var(--secondary),var(--text)_10%)]",
    "data-active:bg-[color-mix(in_srgb,var(--secondary),var(--text)_15%)]",
  ),
  destructive: clsx(
    baseStyles,
    destructiveStyles,
    "h-11 min-w-60",
    "rounded-4xl",
    "px-3 py-2",
    "bg-[color-mix(in_srgb,var(--color-red-400),var(--text)_15%)]",
    "dark:bg-[color-mix(in_srgb,var(--color-red-800),var(--text)_15%)]",
  ),
  destructiveSmall: clsx(baseStyles, destructiveStyles, smallStyles),
  flat: clsx(baseStyles, flatStyles, "rounded-4xl", "px-3 py-2"),
  flatSmall: clsx(baseStyles, flatStyles, smallStyles),
  group: clsx(
    "h-12 w-full",
    "cursor-pointer transition-colors",
    "px-3 py-2",
    "bg-[color-mix(in_srgb,var(--background),var(--text)_15%)]",
    "hover:bg-[color-mix(in_srgb,var(--background),var(--text)_10%)]",
    "first:rounded-t-xl last:rounded-b-xl",
  ),
};

export function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  const isGrouped = useContext(GroupContext);
  const finalVariant = isGrouped ? "group" : variant;
  const style = clsx(variants[finalVariant], className);

  return (
    <button className={style} {...props}>
      {children}
    </button>
  );
}
