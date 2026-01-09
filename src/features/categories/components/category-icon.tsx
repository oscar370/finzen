import { categoriesIcons } from "@/data/categories-icons";

type CategoryIconProps = {
  icon: string;
};

export function CategoryIcon({ icon }: CategoryIconProps) {
  const Icon = categoriesIcons[icon];

  if (Icon)
    return (
      <span className="w-fit translate-y-px">
        <Icon />
      </span>
    );
}
