import { Navigation } from "@/components/ui/navigation";
import type { Category } from "@/types/categories";
import { t } from "i18next";
import { CategoryIcon } from "./category-icon";

type CategoriesListProps = {
  data: Category[];
};

export function CategoriesList({ data }: CategoriesListProps) {
  return (
    <>
      {data.map(({ id, name, icon }) => (
        <Navigation key={id} to={`/categories/${id}`}>
          <div className="grid w-full grid-cols-[min-content_auto] items-center justify-center gap-2">
            <CategoryIcon icon={icon} />
            <span> {t(name, { ns: "categories" })} </span>
          </div>
        </Navigation>
      ))}
    </>
  );
}
