import { useCategoryById } from "@/api/categories";
import { NavigationPage } from "@/components/ui/navigation-page";
import { CategoryDetails } from "@/features/categories";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

export default function Category() {
  const { id } = useParams();
  const { t } = useTranslation("categories");
  const category = useCategoryById(id!);

  if (category)
    return (
      <NavigationPage title={t(category.name)} isSubPage>
        <CategoryDetails category={category} />
      </NavigationPage>
    );
}
