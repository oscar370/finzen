import { CATEGORY_ICONS } from "#/lib/constants";
import { translate } from "#/lib/utils";
import { m } from "#/paraglide/messages";
import type { Category } from "#/types/categories";
import { ChevronRight } from "lucide-react";

type CategoryItemProps = {
  category: Category;
  onClick: (category: Category) => void;
};

export function CategoryItem({ category, onClick }: CategoryItemProps) {
  const Icon = CATEGORY_ICONS[category.icon];

  return (
    <li className="list-row items-center">
      <div>
        <Icon />
      </div>

      <span>{translate(category.name)}</span>

      <button
        className="btn btn-square btn-sm btn-ghost"
        aria-label={m.open_details()}
        onClick={() => onClick(category)}
      >
        <ChevronRight />
      </button>
    </li>
  );
}
