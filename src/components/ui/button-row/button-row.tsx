import clsx from "clsx";
import type { ButtonHTMLAttributes } from "react";

type ButtonRowProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  variant?: "regular" | "suggested" | "destructive";
};

export function ButtonRow({
  children,
  variant = "regular",
  className,
  disabled,
  ...props
}: ButtonRowProps) {
  const buttonClasses = clsx(
    "group relative flex min-h-12 w-full cursor-pointer items-center justify-center gap-1 px-4.25 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60",
    variant === "suggested" && "bg-(--accent) text-white",
    variant === "destructive" && "bg-(--destructive) text-white",
    className,
  );

  const overlayClasses = clsx(
    "absolute inset-0 transition-colors group-focus-visible:bg-(--hover) hover:bg-(--hover)",
    disabled && "hover:bg-transparent",
  );

  return (
    <li>
      <button className={buttonClasses} disabled={disabled} {...props}>
        <div aria-hidden className={overlayClasses}></div>
        {children}
      </button>
    </li>
  );
}
