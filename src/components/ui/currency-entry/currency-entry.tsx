import CurrencyInput, {
  type CurrencyInputProps,
} from "react-currency-input-field";

type CurrencyEntryProps = CurrencyInputProps & {
  title: string;
};

export function CurrencyEntry({ title, ...props }: CurrencyEntryProps) {
  return (
    <label className="flex w-full cursor-pointer flex-col gap-0.5 transition-colors">
      <span className="w-full">{title}</span>

      <div className="relative overflow-hidden rounded-md">
        <CurrencyInput
          className="h-full w-full border-none bg-(--card-bg) p-2 outline-none placeholder:text-(--dim-fg) placeholder:opacity-80 focus:bg-(--hover) focus:opacity-100"
          {...props}
        />

        <div className="absolute inset-0 transition-colors hover:bg-(--hover)"></div>
      </div>
    </label>
  );
}
