import { NavigationPage } from "@/components/ui/navigation-page";
import {
  BalanceByAccount,
  GeneralBalance,
  LatestTransactions,
  MainAccounts,
} from "@/features/analytics";
import { useTranslation } from "react-i18next";

export function Home() {
  const { t } = useTranslation("common");

  return (
    <NavigationPage title={t("sections.home")}>
      <GeneralBalance />
      <BalanceByAccount />
      <MainAccounts />
      <LatestTransactions />
    </NavigationPage>
  );
}
