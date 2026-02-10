import { NavigationPage } from "@/components/ui/navigation-page";
import { AddCategoryForm } from "@/features/categories";
import { useTranslation } from "react-i18next";

export default function NewCategory() {
  const { t } = useTranslation("categories");

  return (
    <NavigationPage title={t("titles.newCategory")} isSubPage>
      <AddCategoryForm />
    </NavigationPage>
  );
}
