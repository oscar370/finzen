import {
  PageContainer,
  PageContainerActions,
  PageContainerContent,
  PageContainerHeader,
  PageContainerTittle,
} from "@/components/page-container";
import { CategoryDetailsDialog } from "@/features/categories/components/category-details-dialog";
import { CategoryList } from "@/features/categories/components/category-list";
import { NewCategoryDialog } from "@/features/categories/components/new-category-dialog";
import { getCategoriesPageData } from "@/features/categories/services/get-categories-page-data";
import { m } from "@/paraglide/messages";
import type { Category } from "@/types/categories/category";
import { createFileRoute } from "@tanstack/react-router";
import { useLiveQuery } from "dexie-react-hooks";
import { useState } from "react";

export const Route = createFileRoute("/app/_layout/categories")({
  component: RouteComponent,
  loader: async () => getCategoriesPageData(),
});

function RouteComponent() {
  const { categories } = useLiveQuery(
    () => getCategoriesPageData(),
    [],
    Route.useLoaderData()
  );
  const [selected, setSelected] = useState<Category | null>(null);

  return (
    <PageContainer>
      <PageContainerHeader>
        <PageContainerTittle>{m.categories()}</PageContainerTittle>

        <PageContainerActions>
          <NewCategoryDialog />
        </PageContainerActions>
      </PageContainerHeader>

      <PageContainerContent>
        {categories.length === 0 ? (
          <p className="text-center">{m.empty_categories()}</p>
        ) : (
          <CategoryList categories={categories} onClick={setSelected} />
        )}
      </PageContainerContent>

      <CategoryDetailsDialog
        category={selected}
        onClose={() => setSelected(null)}
      />
    </PageContainer>
  );
}
