import { useCategories } from "@/api/categories";
import { AddButton } from "@/components/ui/add-button";
import { Group } from "@/components/ui/group";
import { TitleBar } from "@/components/ui/title-bar";
import { CategoriesList } from "@/features/categories";
import { t } from "i18next";
import { useNavigate } from "react-router-dom";

export function Categories() {
  const categories = useCategories();
  const navigate = useNavigate();

  if (categories)
    return (
      <>
        <TitleBar title={t("sections.categories", { ns: "common" })} />

        <main className="mx-auto max-w-150 px-1 py-3">
          <Group>
            <AddButton onClick={() => navigate("/categories/new")}>
              {t("buttons.addCategory", { ns: "categories" })}
            </AddButton>
            <CategoriesList data={categories} />
          </Group>
        </main>
      </>
    );
}
