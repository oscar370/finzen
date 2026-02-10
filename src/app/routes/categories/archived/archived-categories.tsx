import { useArchivedCategories } from "@/api/categories";
import { ListBox } from "@/components/ui/list-box";
import { NavigationPage } from "@/components/ui/navigation-page";
import { CategoryItems } from "@/features/categories";
import { useTranslation } from "react-i18next";

export default function ArchivedCategories() {
  const categories = useArchivedCategories();
  const { t } = useTranslation("categories");

  if (categories)
    return (
      <NavigationPage title={t("titles.archived")} isSubPage>
        {categories.length === 0 ? (
          <p className="mt-4 text-center"> {t("messages.empty")} </p>
        ) : (
          <ListBox>
            <CategoryItems categories={categories} />
          </ListBox>
        )}
      </NavigationPage>
    );
}
