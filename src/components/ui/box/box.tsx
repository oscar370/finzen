import clsx from "clsx";

type BoxProps = {
  gap?: number;
  align?: "vertical" | "horizontal";
  linked?: boolean;
  children: React.ReactNode;
};

export function Box({
  gap = 1.5,
  align = "horizontal",
  linked = false,
  children,
}: BoxProps) {
  const boxClasses = clsx(
    "flex w-fit",
    align === "horizontal" ? "flex-row" : "flex-col",
    !linked && `gap-${gap}`,
    linked && "overflow-hidden rounded-lg *:rounded-none",
    linked &&
      align === "horizontal" &&
      "*:first-child:rounded-l-lg *:last-child:rounded-r-lg divide-x divide-(--border)",
    linked &&
      align === "vertical" &&
      "*:first-child:rounded-t-lg *:last-child:rounded-b-lg divide-y divide-(--border)",
  );

  return <div className={boxClasses}>{children}</div>;
}
