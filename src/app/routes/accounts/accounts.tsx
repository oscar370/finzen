import { useAccounts } from "@/api/accounts";
import { ButtonRow } from "@/components/ui/button-row";
import { ListBox } from "@/components/ui/list-box";
import { NavigationPage } from "@/components/ui/navigation-page";
import { AccountItems } from "@/features/accounts";
import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export function Accounts() {
  const { t } = useTranslation("common");
  const navigate = useNavigate();
  const accounts = useAccounts();

  if (accounts)
    return (
      <NavigationPage title={t("sections.accounts")}>
        <ListBox>
          <ButtonRow role="link" onClick={() => navigate("new")}>
            <Plus />
            <span>{t("buttons.add", { ns: "accounts" })}</span>
          </ButtonRow>
          <AccountItems accounts={accounts} />
        </ListBox>
      </NavigationPage>
    );
}
