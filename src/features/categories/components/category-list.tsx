import { List } from "@/components/list";
import type { Category } from "@/types/categories/category";
import { CategoryItem } from "./category-item";

type CategoryListProps = {
  categories: Category[];
  onClick: (category: Category) => void;
};

export function CategoryList({ categories, onClick }: CategoryListProps) {
  return (
    <List>
      {categories.map((category) => (
        <CategoryItem key={category.id} category={category} onClick={onClick} />
      ))}
    </List>
  );
}
