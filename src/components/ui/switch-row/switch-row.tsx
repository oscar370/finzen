type SwitchRowProps = {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  accent?: string;
  checked: boolean;
  onChange: () => void;
};

export function SwitchRow({
  title,
  subtitle,
  icon: Icon,
  accent,
  checked,
  onChange,
}: SwitchRowProps) {
  return (
    <li>
      <label className="flex min-h-13 cursor-pointer items-center px-4 transition-colors hover:bg-(--hover) focus-visible:bg-(--hover)">
        {Icon && (
          <div
            aria-hidden="true"
            className={`mr-2 ${accent ? accent : "text-(--accent"}`}
          >
            {Icon}
          </div>
        )}
        <div className="min-w-0 flex-1 text-left">
          <span className="leading-tight">{title}</span>
          {subtitle && (
            <span className="mt-0.5 text-sm text-(--dim-fg)">{subtitle}</span>
          )}
        </div>
        <div className="ml-4 flex items-center">
          <div
            className="relative inline-flex cursor-pointer items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <input
              type="checkbox"
              className="peer sr-only"
              checked={checked}
              onChange={onChange}
            />
            <div className="peer h-6 w-11 rounded-full bg-(--border) peer-checked:bg-(--accent) peer-focus-visible:outline-3 peer-focus-visible:outline-(--border) after:absolute after:top-0.5 after:left-0.5 after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white dark:bg-zinc-700"></div>
          </div>
        </div>
      </label>
    </li>
  );
}
