import { useCategoryById } from "@/api/categories";
import { NavigationPage } from "@/components/ui/navigation-page";
import { EditCategoryForm } from "@/features/categories";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

export function EditCategory() {
  const { id } = useParams();
  const category = useCategoryById(id!);
  const { t } = useTranslation("categories");

  if (category)
    return (
      <NavigationPage title={t(category.name)} isSubPage>
        <EditCategoryForm category={category} />
      </NavigationPage>
    );
}
