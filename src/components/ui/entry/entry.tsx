import type { InputHTMLAttributes } from "react";

type EntryProps = InputHTMLAttributes<HTMLInputElement> & {
  title?: string;
};

export function Entry({ title, ...props }: EntryProps) {
  return (
    <label className="flex w-full cursor-pointer flex-col gap-0.5">
      {title && <span className="w-full">{title}</span>}

      <div className="overflow-hidden rounded-md shadow-sm transition-colors hover:bg-(--hover) has-[input:focus]:hover:bg-transparent">
        <input
          className="h-full w-full border-none bg-(--card-bg) p-2 outline-none placeholder:text-(--dim-fg) placeholder:opacity-80 focus:bg-(--hover) focus:opacity-100"
          {...props}
        />
      </div>
    </label>
  );
}
