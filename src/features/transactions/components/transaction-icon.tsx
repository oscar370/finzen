import { categoriesIcons } from "@/data/categories-icons";

type TransactionIconProps = {
  icon: string;
  kind: "income" | "expense";
};

export function TransactionIcon({ icon, kind }: TransactionIconProps) {
  const Icon = categoriesIcons[icon];

  if (Icon)
    return (
      <span className="w-fit translate-y-px">
        <Icon
          color={
            kind === "income"
              ? "var(--color-green-500)"
              : "var(--color-red-500)"
          }
        />
      </span>
    );
}
