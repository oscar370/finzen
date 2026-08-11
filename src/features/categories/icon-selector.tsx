import { CATEGORY_ICONS } from "#/lib/constants";
import { Bolt } from "lucide-react";
import { useRef } from "react";

type IconSelectorProps = {
  label: string;
  value: string | undefined;
  onChange: (value: string | undefined) => void;
};

export function IconSelector({ label, value, onChange }: IconSelectorProps) {
  const IconSelected = CATEGORY_ICONS[value ?? 0] ?? Bolt;
  const detailsRef = useRef<HTMLDetailsElement | null>(null);

  function handleIconClick(v: string) {
    onChange(v);
    detailsRef.current?.removeAttribute("open");
  }

  return (
    <details className="dropdown" ref={detailsRef}>
      <summary className="input w-full cursor-pointer">
        <span className="label">{label}</span>
        <IconSelected />
      </summary>
      <ul className="menu dropdown-content bg-base-100 rounded-box border-base-200 z-10 mt-1 grid max-h-52 w-72 grid-cols-4 overflow-y-auto border p-4 shadow-lg transition-all">
        {Object.entries(CATEGORY_ICONS).map((icon) => {
          const Icon = icon[1];
          return (
            <li key={icon[0]}>
              <button
                className={`flex items-center justify-center ${value === icon[0] ? "menu-active" : ""}`}
                aria-label={icon[0]}
                type="button"
                onClick={() => handleIconClick(icon[0])}
              >
                <Icon />
              </button>
            </li>
          );
        })}
      </ul>
    </details>
  );
}
