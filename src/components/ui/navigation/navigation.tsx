import clsx from "clsx";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { GroupContext } from "../group";

type NavigationConfig = {
  children: React.ReactNode;
  to: string;
  logo?: React.ReactNode;
};

const baseStyles = clsx(
  "flex h-12 w-full items-center justify-between",
  "cursor-pointer",
  "px-3.5 py-3",
  "bg-[color-mix(in_srgb,var(--background),var(--text)_15%)]",
  "hover:bg-[color-mix(in_srgb,var(--background),var(--text)_10%)]",
);

const containerVariants = {
  default: clsx(baseStyles, "rounded-xl shadow-sm"),
  group: clsx(baseStyles, "first:rounded-t-xl last:rounded-b-xl"),
};

export function Navigation({ children, to, logo }: NavigationConfig) {
  const isGrouped = useContext(GroupContext);
  const containerStyles = containerVariants[isGrouped ? "group" : "default"];

  return (
    <Link to={to} className={containerStyles}>
      <div>{children}</div>

      {logo ? (
        logo
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="16px"
          viewBox="0 0 16 16"
          width="16px"
        >
          <path
            d="m 7.707031 12.707031 l 4 -4 c 0.390625 -0.390625 0.390625 -1.023437 0 -1.414062 l -4 -4 c -0.390625 -0.390625 -1.023437 -0.390625 -1.414062 0 s -0.390625 1.023437 0 1.414062 l 3.292969 3.292969 l -3.292969 3.292969 c -0.390625 0.390625 -0.390625 1.023437 0 1.414062 s 1.023437 0.390625 1.414062 0 z m 0 0"
            fill="currentColor"
            fillRule="evenodd"
          />
        </svg>
      )}
    </Link>
  );
}
