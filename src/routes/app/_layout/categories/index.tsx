import { PageContainer } from "#/components/ui/page-container";
import { CategoryDetailsModal } from "#/features/categories/category-details-modal";
import { CategoryList } from "#/features/categories/category-list";
import { NewCategoryModal } from "#/features/categories/new-category-modal";
import { m } from "#/paraglide/messages";
import { getCategories } from "#/services/categories";
import type { Category } from "#/types/categories";
import { createFileRoute } from "@tanstack/react-router";
import { useLiveQuery } from "dexie-react-hooks";
import { useState } from "react";

export const Route = createFileRoute("/app/_layout/categories/")({
  component: RouteComponent,
  loader: async ({ context }) => {
    return {
      appState: context.appState,
      categories: await getCategories(),
    };
  },
});

function RouteComponent() {
  const data = Route.useLoaderData();
  const categories = useLiveQuery(() => getCategories(), [], data.categories);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  return (
    <PageContainer title={m.categories()} actions={<NewCategoryModal />}>
      <CategoryList categories={categories} onClick={(category) => setSelectedCategory(category)} />

      <CategoryDetailsModal category={selectedCategory} onClose={() => setSelectedCategory(null)} />
    </PageContainer>
  );
}
