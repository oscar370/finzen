import { NavigationPage } from "@/components/ui/navigation-page";
import {
  AppSettings,
  ArchivedSettings,
  BackupSettings,
} from "@/features/settings";
import { useTranslation } from "react-i18next";

export function Settings() {
  const { t } = useTranslation("common");

  return (
    <NavigationPage title={t("sections.settings")}>
      <AppSettings />

      <ArchivedSettings />

      <BackupSettings />
    </NavigationPage>
  );
}
