import { ActionRow } from "@/components/ui/action-row";
import { categoriesIcons } from "@/data/categories-icons";
import type { Category } from "@/types/categories";
import { ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

type CategoryItemsProps = {
  categories: Category[];
};

export function CategoryItems({ categories }: CategoryItemsProps) {
  const { t } = useTranslation("categories");

  return (
    <>
      {categories.map(({ id, name, icon }) => {
        const Icon = categoriesIcons[icon];

        return (
          <ActionRow
            key={id}
            title={t(name)}
            icon={<Icon />}
            accent="text-(--text)"
            as={Link}
            forceHover
            to={`/categories/${id}`}
          >
            <ChevronRight />
          </ActionRow>
        );
      })}
    </>
  );
}
