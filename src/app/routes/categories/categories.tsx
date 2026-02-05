import { useCategories } from "@/api/categories";
import { ButtonRow } from "@/components/ui/button-row";
import { ListBox } from "@/components/ui/list-box";
import { NavigationPage } from "@/components/ui/navigation-page";
import { CategoryItems } from "@/features/categories";
import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export function Categories() {
  const categories = useCategories();
  const { t } = useTranslation("common");
  const navigate = useNavigate();

  return (
    <NavigationPage title={t("sections.categories")}>
      <ListBox>
        <ButtonRow role="link" onClick={() => navigate("new")}>
          <Plus />
          <span>{t("buttons.addCategory", { ns: "categories" })} </span>
        </ButtonRow>
        <CategoryItems categories={categories} />
      </ListBox>
    </NavigationPage>
  );
}
