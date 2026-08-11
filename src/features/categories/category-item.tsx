import { CATEGORY_ICONS } from "#/lib/constants";
import { translate } from "#/lib/utils";
import type { Category } from "#/types/categories";
import { ChevronRight } from "lucide-react";

type CategoryItemProps = {
  category: Category;
  onClick: (category: Category) => void;
};

export function CategoryItem({ category, onClick }: CategoryItemProps) {
  const Icon = CATEGORY_ICONS[category.icon];

  return (
    <li>
      <button
        className="list-row w-full cursor-pointer items-center"
        onClick={() => onClick(category)}
      >
        <div>
          <Icon />
        </div>

        <span className="text-start">{translate(category.name)}</span>

        <ChevronRight />
      </button>
    </li>
  );
}
