import {
  ListItem,
  ListItemContent,
  ListItemPrefix,
  ListItemSuffix,
  ListItemTitle,
} from "@/components/list";
import { CATEGORY_ICONS } from "@/lib/constants/category-icons";
import { translate } from "@/lib/i18n/translate";
import type { Category } from "@/types/categories/category";
import { ChevronRight, CircleHelp } from "lucide-react";

type CategoryItemProps = {
  category: Category;
  onClick: (category: Category) => void;
};

export function CategoryItem({ category, onClick }: CategoryItemProps) {
  const Icon = CATEGORY_ICONS[category.icon] ?? CircleHelp;

  return (
    <ListItem
      render={<button type="button" />}
      onClick={() => onClick(category)}
    >
      <ListItemPrefix>
        <Icon />
      </ListItemPrefix>

      <ListItemContent>
        <ListItemTitle>{translate(category.name)}</ListItemTitle>
      </ListItemContent>

      <ListItemSuffix>
        <ChevronRight />
      </ListItemSuffix>
    </ListItem>
  );
}
