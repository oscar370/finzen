import { useAccountsByBalance } from "@/api/accounts";
import { ListBox } from "@/components/ui/list-box";
import { AccountItems } from "@/features/accounts";
import { useTranslation } from "react-i18next";

export function MainAccounts() {
  const accounts = useAccountsByBalance(3);
  const { t } = useTranslation("analytics");

  return (
    <ListBox
      title={t("titles.mainAccounts")}
      description={t("descriptions.mainAccounts")}
    >
      <AccountItems accounts={accounts} backTo="/home" />
    </ListBox>
  );
}
