import { DescriptionRow } from "@/components/ui/description-row";
import { Group } from "@/components/ui/group";
import { useAppStore } from "@/stores/use-app-store";
import type { Account } from "@/types/accounts";
import { formatCurrency } from "@/utils/format-currency";
import { t } from "i18next";
import { accountsTypesDic } from "../data/account-types";

type AccountDetailsProps = {
  data: Account;
};

export function AccountDetails({ data }: AccountDetailsProps) {
  const currency = useAppStore((state) => state.currency);
  const { name, type, balance, initialBalance } = data;
  return (
    <Group>
      <DescriptionRow label={t("fields.name.label", { ns: "accounts" })}>
        {name}
      </DescriptionRow>
      <DescriptionRow label={t("fields.type.label", { ns: "accounts" })}>
        {t(accountsTypesDic[type], { ns: "accounts" })}
      </DescriptionRow>
      <DescriptionRow label={t("fields.balance.label", { ns: "accounts" })}>
        {formatCurrency(currency, balance)}
      </DescriptionRow>
      <DescriptionRow
        label={t("fields.initialBalance.label", { ns: "accounts" })}
      >
        {formatCurrency(currency, initialBalance)}
      </DescriptionRow>
    </Group>
  );
}
