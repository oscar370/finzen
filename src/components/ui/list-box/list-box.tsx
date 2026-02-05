type ListBoxOwnProps = {
  title?: string;
  description?: string;
  headerButton?: React.ReactNode;
  children: React.ReactNode;
};

type PolymorphicProps<E extends React.ElementType> = ListBoxOwnProps &
  Omit<React.ComponentPropsWithoutRef<E>, keyof ListBoxOwnProps> & {
    as?: E;
  };

type ListBoxProps<E extends React.ElementType = "section"> =
  PolymorphicProps<E>;

export function ListBox<E extends React.ElementType = "section">({
  title,
  description,
  as,
  headerButton,
  children,
  ...props
}: ListBoxProps<E>) {
  const Component = as || "section";
  const isNav = Component === "nav";
  const shouldRenderHeader =
    title || description || headerButton ? true : false;

  return (
    <Component className={`${isNav ? "mt-0" : "mt-4"} w-full`} {...props}>
      {shouldRenderHeader && (
        <header className="mb-1 flex items-center px-1">
          <div className="flex-1">
            {title && <h2 className="font-bold">{title}</h2>}

            {description && (
              <p className="mb-1 text-xs text-(--dim-fg)">{description}</p>
            )}
          </div>
          {headerButton}
        </header>
      )}

      <ul
        className={
          !isNav
            ? "w-full divide-y divide-(--border) overflow-hidden rounded-xl bg-(--card-bg) p-0 shadow-sm"
            : "space-y-1 overflow-y-auto [&>li>a]:rounded-xl [&>li>button]:rounded-xl"
        }
      >
        {children}
      </ul>
    </Component>
  );
}
