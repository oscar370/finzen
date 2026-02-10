import { ListBox } from "@/components/ui/list-box";
import { CurrencySelect } from "@/features/currency";
import { useTranslation } from "react-i18next";
import { LanguageSelect } from "./language-select";

export function AppSettings() {
  const { t } = useTranslation("settings");

  return (
    <ListBox title={t("titles.app")}>
      <CurrencySelect />

      <LanguageSelect />
    </ListBox>
  );
}
