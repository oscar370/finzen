import clsx from "clsx";
import type React from "react";
import { useContext } from "react";
import { GroupContext } from "../group";

type DescriptionRowProps = {
  label: string;
  children: React.ReactNode;
};

const baseStyles = clsx(
  "flex h-12 items-center",
  "bg-[color-mix(in_srgb,var(--background),var(--text)_15%)]",
  "px-3.5",
);

const containerVariants = {
  default: clsx(baseStyles, "rounded-xl shadow-sm"),
  group: clsx(baseStyles, "first:rounded-t-xl last:rounded-b-xl"),
};

export function DescriptionRow({ label, children }: DescriptionRowProps) {
  const isGrouped = useContext(GroupContext);
  const containerStyles = containerVariants[isGrouped ? "group" : "default"];
  return (
    <div className={containerStyles}>
      <div className="flex flex-col select-text">
        <span className="text-xs text-(--text)/80">{label}</span>

        {children}
      </div>
    </div>
  );
}
