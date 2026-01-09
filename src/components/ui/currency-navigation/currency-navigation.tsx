import { Navigation } from "@/components/ui/navigation";
import { useAppStore } from "@/stores/use-app-store";
import { formatCurrency } from "@/utils/format-currency";
import clsx from "clsx";

type CurrencyNavigationProps = {
  to: string;
  balance: number;
  children: React.ReactNode;
  variant: keyof typeof variants;
};

const base = clsx("rounded-lg px-1 py-0.5");

const variants = {
  income: clsx(
    base,
    "bg-[color-mix(in_srgb,var(--color-green-400),var(--text)_15%)]/70",
    "dark:bg-[color-mix(in_srgb,var(--color-green-800),var(--text)_15%)]/70",
  ),
  expense: clsx(
    base,
    "bg-[color-mix(in_srgb,var(--color-red-400),var(--text)_15%)]/70",
    "dark:bg-[color-mix(in_srgb,var(--color-red-800),var(--text)_15%)]/70",
  ),
  account: clsx(
    base,
    "bg-[color-mix(in_srgb,var(--color-blue-400),var(--text)_15%)]/70",
    "dark:bg-[color-mix(in_srgb,var(--color-blue-800),var(--text)_15%)]/70",
  ),
};

export function CurrencyNavigation({
  to,
  balance,
  children,
  variant,
}: CurrencyNavigationProps) {
  const styles = variants[variant];

  return (
    <Navigation to={to} logo={<Logo className={styles} amount={balance} />}>
      {children}
    </Navigation>
  );
}

type LogoProps = {
  amount: number;
  className: string;
};

function Logo({ amount, className }: LogoProps) {
  const currency = useAppStore((state) => state.currency);

  return (
    <div className="flex items-center">
      <span className={className}>{formatCurrency(currency, amount)}</span>

      <svg
        className="translate-y-px"
        xmlns="http://www.w3.org/2000/svg"
        height="16px"
        viewBox="0 0 16 16"
        width="16px"
      >
        <path
          d="m 7.707031 12.707031 l 4 -4 c 0.390625 -0.390625 0.390625 -1.023437 0 -1.414062 l -4 -4 c -0.390625 -0.390625 -1.023437 -0.390625 -1.414062 0 s -0.390625 1.023437 0 1.414062 l 3.292969 3.292969 l -3.292969 3.292969 c -0.390625 0.390625 -0.390625 1.023437 0 1.414062 s 1.023437 0.390625 1.414062 0 z m 0 0"
          fill="currentColor"
          fillRule="evenodd"
        />
      </svg>
    </div>
  );
}
