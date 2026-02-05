import { useAccountById } from "@/api/accounts";
import { NavigationPage } from "@/components/ui/navigation-page";
import { EditAccountForm } from "@/features/accounts";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

export function EditAccount() {
  const { id } = useParams();
  const { t } = useTranslation("account");
  const account = useAccountById(id!);

  if (account)
    return (
      <NavigationPage title={t("titles.editAccount")} isSubPage>
        <EditAccountForm account={account} />
      </NavigationPage>
    );
}
