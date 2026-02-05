import { useAccounts } from "@/api/accounts";
import { ActionRow } from "@/components/ui/action-row";
import { ButtonRow } from "@/components/ui/button-row";
import { ListBox } from "@/components/ui/list-box";
import { useAppStore } from "@/stores/use-app-store";
import { formatCurrency } from "@/utils/format-currency";
import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export function GeneralBalance() {
  const { t } = useTranslation("analytics");
  const navigate = useNavigate();
  const currency = useAppStore((state) => state.currency);
  const accounts = useAccounts();
  const balance = accounts.reduce((t, a) => a.balance + t, 0);

  return (
    <ListBox>
      <ButtonRow onClick={() => navigate("/transactions/new")}>
        <Plus />
        <span>{t("buttons.addTransaction", { ns: "transactions" })}</span>
      </ButtonRow>
      <ActionRow
        title={t("fields.availableBalance")}
        subtitle={formatCurrency(currency, balance)}
        property
      />
    </ListBox>
  );
}
