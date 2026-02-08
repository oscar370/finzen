import { ListBox } from "@/components/ui/list-box";
import { SelectRow } from "@/components/ui/select-row";
import { CurrencySelect } from "@/features/currency";
import { useTranslation } from "react-i18next";

export function AppSettings() {
  const { t, i18n } = useTranslation("settings");

  function handleChangeLanguage(value: string) {
    i18n.changeLanguage(value);
  }

  return (
    <ListBox title={t("titles.app")}>
      <CurrencySelect />

      <SelectRow
        title={t("fields.language.label")}
        value={i18n.language}
        options={[
          {
            value: "en",
            label: t("fields.language.options.english"),
          },
          {
            value: "es",
            label: t("fields.language.options.spanish"),
          },
        ]}
        onChange={handleChangeLanguage}
      />
    </ListBox>
  );
}
