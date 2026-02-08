import { Search } from "lucide-react";
import type { InputHTMLAttributes } from "react";

type EntrySearchRowProps = InputHTMLAttributes<HTMLInputElement>;

export function EntrySearchRow({
  type = "search",
  ...props
}: EntrySearchRowProps) {
  return (
    <li>
      <label className="flex min-h-13 flex-col justify-center px-4 transition-colors hover:bg-(--hover) has-[input:focus-visible]:bg-(--hover)">
        <div className="flex items-center gap-2">
          <Search size={16} />

          <input
            className="h-full w-full border-none outline-none placeholder:text-(--dim-fg) placeholder:opacity-80 focus:opacity-100"
            type={type}
            {...props}
          />
        </div>
      </label>
    </li>
  );
}
