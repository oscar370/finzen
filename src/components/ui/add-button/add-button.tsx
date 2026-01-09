import { Button } from "@/components/ui/button";
import type { ButtonHTMLAttributes } from "react";

type AddButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
};

export function AddButton({ children, ...props }: AddButtonProps) {
  return (
    <Button
      className="flex items-center justify-center gap-0.5 font-bold"
      {...props}
    >
      <svg
        className="translate-y-px"
        xmlns="http://www.w3.org/2000/svg"
        height="16px"
        viewBox="0 0 16 16"
        width="16px"
      >
        <path
          d="m 7 3 v 4 h -4 v 2 h 4 v 4 h 2 v -4 h 4 v -2 h -4 v -4 z m 0 0"
          fill="currentColor"
        />
      </svg>

      <span> {children} </span>
    </Button>
  );
}
