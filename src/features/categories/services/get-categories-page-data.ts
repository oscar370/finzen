import { getCategories } from "@/services/categories/get-categories";

export async function getCategoriesPageData() {
  const categories = await getCategories();

  return { categories };
}
