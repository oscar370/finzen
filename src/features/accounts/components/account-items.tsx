import { ActionRow } from "@/components/ui/action-row";
import { useAppStore } from "@/stores/use-app-store";
import type { Account } from "@/types/accounts";
import { formatCurrency } from "@/utils/format-currency";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

type AccountItemsProps = {
  accounts: Account[];
  backTo?: string;
};

export function AccountItems({ accounts, backTo }: AccountItemsProps) {
  const currency = useAppStore((state) => state.currency);

  return (
    <>
      {accounts.map(({ id, name, balance }) => (
        <ActionRow
          key={id}
          title={name}
          as={Link}
          forceHover
          to={`/accounts/${id}`}
          state={{ backTo }}
        >
          <div className="flex items-center justify-center">
            <span className="rounded-md bg-blue-200 px-1 dark:bg-blue-900">
              {formatCurrency(currency, balance)}
            </span>
            <ChevronRight />
          </div>
        </ActionRow>
      ))}
    </>
  );
}
