import { useAccounts } from "@/api/accounts";
import { ActionRow } from "@/components/ui/action-row";
import { ListBox } from "@/components/ui/list-box";
import { useAppStore } from "@/stores/use-app-store";
import { formatCurrency } from "@/utils/format-currency";
import { useTranslation } from "react-i18next";

export function BalanceByAccount() {
  const { t } = useTranslation("analytics");
  const currency = useAppStore((state) => state.currency);
  const accounts = useAccounts();

  const cashBalance = accounts.reduce(
    (t, a) => (a.type === "cash" ? t + a.balance : t + 0),
    0,
  );

  const debitBalance = accounts.reduce(
    (t, a) => (a.type === "debit" ? t + a.balance : t + 0),
    0,
  );

  const creditBalance = accounts.reduce(
    (t, a) => (a.type === "credit" ? t + a.balance : t + 0),
    0,
  );

  const investmentBalance = accounts.reduce(
    (t, a) => (a.type === "investment" ? t + a.balance : t + 0),
    0,
  );

  return (
    <ListBox title={t("titles.balanceByAccount")}>
      <ActionRow
        title={t("types.cash", { ns: "accounts" })}
        subtitle={formatCurrency(currency, cashBalance)}
        property
      />
      <ActionRow
        title={t("types.debit", { ns: "accounts" })}
        subtitle={formatCurrency(currency, debitBalance)}
        property
      />
      <ActionRow
        title={t("types.credit", { ns: "accounts" })}
        subtitle={formatCurrency(currency, creditBalance)}
        property
      />
      <ActionRow
        title={t("types.investment", { ns: "accounts" })}
        subtitle={formatCurrency(currency, investmentBalance)}
        property
      />
    </ListBox>
  );
}
