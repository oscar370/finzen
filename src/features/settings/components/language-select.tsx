import { SelectRow } from "@/components/ui/select-row";
import { useTranslation } from "react-i18next";

export function LanguageSelect() {
  const { t, i18n } = useTranslation("settings");

  function handleChangeLanguage(value: string) {
    i18n.changeLanguage(value);
  }
  return (
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
  );
}
