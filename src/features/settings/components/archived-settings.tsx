import { ActionRow } from "@/components/ui/action-row";
import { ListBox } from "@/components/ui/list-box";
import { ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export function ArchivedSettings() {
  const { t } = useTranslation("settings");

  return (
    <ListBox title={t("titles.archived")}>
      <ActionRow
        title={t("buttons.transactions")}
        as={Link}
        to="/transactions/archived"
        forceHover
      >
        <ChevronRight />
      </ActionRow>

      <ActionRow
        title={t("buttons.accounts")}
        as={Link}
        to="/accounts/archived"
        forceHover
      >
        <ChevronRight />
      </ActionRow>

      <ActionRow
        title={t("buttons.categories")}
        as={Link}
        to="/categories/archived"
        forceHover
      >
        <ChevronRight />
      </ActionRow>
    </ListBox>
  );
}
