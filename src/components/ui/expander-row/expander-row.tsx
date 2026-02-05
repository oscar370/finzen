import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { ChevronDown } from "lucide-react";

type ExpanderRowProps = {
  title: string;
  subtitle?: string | React.ReactNode;
  children: React.ReactNode;
};

export function ExpanderRow({ title, subtitle, children }: ExpanderRowProps) {
  return (
    <Disclosure>
      <li>
        <DisclosureButton className="group flex min-h-13 w-full cursor-pointer items-center px-4 transition-colors hover:bg-(--hover) focus:bg-(--hover)">
          <div className="flex min-w-0 flex-1 flex-col text-left">
            <span className="leading-tight">{title}</span>
            {subtitle && (
              <span className="mt-0.5 text-sm text-(--dim-fg)">{subtitle}</span>
            )}
          </div>

          <ChevronDown className="transition-transform duration-300 ease-out group-data-open:rotate-180" />
        </DisclosureButton>
      </li>

      <DisclosurePanel className="divide-y divide-(--border) bg-(--expander-card-bg)">
        {children}
      </DisclosurePanel>
    </Disclosure>
  );
}
