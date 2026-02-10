import { useArchivedAccounts } from "@/api/accounts";
import { ListBox } from "@/components/ui/list-box";
import { NavigationPage } from "@/components/ui/navigation-page";
import { AccountItems } from "@/features/accounts";
import { useTranslation } from "react-i18next";

export default function ArchivedAccounts() {
  const { t } = useTranslation("accounts");
  const accounts = useArchivedAccounts();

  if (accounts)
    return (
      <NavigationPage title={t("titles.archived")} isSubPage>
        {accounts.length === 0 ? (
          <p className="mt-4 text-center"> {t("messages.empty")} </p>
        ) : (
          <ListBox>
            <AccountItems accounts={accounts} />
          </ListBox>
        )}
      </NavigationPage>
    );
}
