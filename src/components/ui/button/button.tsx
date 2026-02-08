import clsx from "clsx";
import type { ButtonHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  variant?:
    | "regular"
    | "flat"
    | "suggested"
    | "destructive"
    | "pill"
    | "pillSuggested";
};

export function Button({
  children,
  variant = "regular",
  className,
  disabled,
  ...props
}: ButtonProps) {
  const buttonClasses = twMerge(
    clsx(
      "flex min-h-8 cursor-pointer items-center justify-center gap-1 px-4.25 py-1.25 disabled:cursor-not-allowed disabled:opacity-60",
      variant === "regular" && "bg-(--card-bg)",
      variant === "flat" && "bg-transparent shadow-none",
      variant === "suggested" && "bg-(--accent) text-white",
      variant === "destructive" && "bg-(--destructive) text-white",
      variant === "pill" && "bg-(--card-bg)",
      variant === "pillSuggested" && "bg-(--accent) text-white",
      className,
    ),
  );

  const wrapperClasses = twMerge(
    clsx(
      "overflow-hidden rounded-lg transition-colors hover:bg-(--hover) has-[button:focus-visible]:bg-(--hover)",
      (variant === "pill" || variant === "pillSuggested") && "rounded-full",
    ),
  );

  return (
    <div className={wrapperClasses}>
      <button className={buttonClasses} disabled={disabled} {...props}>
        {children}
      </button>
    </div>
  );
}
