import { categoriesIcons } from "@/data/categories-icons";

type IconPickerProps = {
  value: string;
  onChange: (value: string) => void;
};

export function IconPicker({ value, onChange }: IconPickerProps) {
  const icons = Object.keys(categoriesIcons);
  return (
    <div className="grid grid-cols-4 gap-2 md:grid-cols-10">
      {icons.map((icon) => {
        const selected = value === icon;
        const Icon = categoriesIcons[icon];
        return (
          <>
            <button
              key={icon}
              className={`cursor-pointer rounded-xl border-3 bg-[color-mix(in_srgb,var(--background),var(--text)_15%)] px-1.5 py-1.5 hover:bg-[color-mix(in_srgb,var(--background),var(--text)_10%)] ${selected ? "border-(--primary)" : "border-transparent"}`}
              type="button"
              onClick={() => onChange(icon)}
            >
              <span className="flex items-center justify-center">
                <Icon size={30} />
              </span>
            </button>
          </>
        );
      })}
    </div>
  );
}
