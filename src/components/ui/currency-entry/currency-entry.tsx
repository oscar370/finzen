import CurrencyInput, {
  type CurrencyInputProps,
} from "react-currency-input-field";

type CurrencyEntryProps = CurrencyInputProps & {
  title?: string;
};

export function CurrencyEntry({ title, ...props }: CurrencyEntryProps) {
  return (
    <label className="flex w-full cursor-pointer flex-col gap-0.5">
      {title && <span className="w-full">{title}</span>}

      <div className="overflow-hidden rounded-md transition-colors hover:bg-(--hover) has-[input:focus]:hover:bg-transparent">
        <CurrencyInput
          className="h-full w-full border-none bg-(--card-bg) p-2 outline-none placeholder:text-(--dim-fg) placeholder:opacity-80 focus:bg-(--hover) focus:opacity-100"
          {...props}
        />
      </div>
    </label>
  );
}
