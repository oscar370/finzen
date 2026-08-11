import type { Category } from "#/types/categories";
import { CategoryItem } from "./category-item";

type CategoryListProps = {
  categories: Category[];
  onClick: (category: Category) => void;
};

export function CategoryList({ categories, onClick }: CategoryListProps) {
  return (
    <ul className="list rounded-box bg-base-200">
      {categories.map((category) => (
        <CategoryItem key={category.id} category={category} onClick={(cat) => onClick(cat)} />
      ))}
    </ul>
  );
}
