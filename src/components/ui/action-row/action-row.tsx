import clsx from "clsx";
import React from "react";

type ActionRowOwnProps = {
  title: string;
  subtitle?: string | React.ReactNode;
  icon?: React.ReactNode;
  accent?: string;
  property?: boolean;
  isActive?: boolean;
  forceHover?: boolean;
};

type PolymorphicProps<E extends React.ElementType> = ActionRowOwnProps &
  Omit<React.ComponentPropsWithoutRef<E>, keyof ActionRowOwnProps> & {
    as?: E;
  };

type ActionRowProps<E extends React.ElementType = "div"> = PolymorphicProps<E>;

export function ActionRow<E extends React.ElementType = "div">({
  title,
  subtitle,
  icon: Icon,
  accent,
  property,
  as,
  isActive,
  forceHover = false,
  children,
  onClick,
  className,
  ...props
}: ActionRowProps<E>) {
  const Component = as || "div";

  const componentClassName = clsx(
    "flex min-h-13 w-full items-center px-4 transition-colors",
    ((onClick && !isActive) || (forceHover && !isActive)) &&
      "cursor-pointer hover:bg-(--hover) focus:bg-(--hover)",
    isActive && "bg-(--active)",
    !onClick && "select-text",
    className,
  );

  const iconClasses = clsx("mr-2", accent ? accent : "text-(--accent)");
  const titleClasses = clsx(
    property ? "mb-0.5 text-sm text-(--dim-fg)" : "leading-tight",
  );
  const subtitleClasses = clsx(
    !property ? "mt-0.5 text-sm text-(--dim-fg)" : "leading-tight",
  );

  return (
    <li>
      <Component
        className={componentClassName}
        aria-current={isActive ? "page" : undefined}
        onClick={onClick}
        {...props}
      >
        {Icon && (
          <div aria-hidden="true" className={iconClasses}>
            {Icon}
          </div>
        )}
        <div className="flex min-w-0 flex-1 flex-col text-left">
          <span className={titleClasses}>{title}</span>
          {subtitle && <span className={subtitleClasses}>{subtitle}</span>}
        </div>
        <div className="ml-4 flex items-center">{children}</div>
      </Component>
    </li>
  );
}
