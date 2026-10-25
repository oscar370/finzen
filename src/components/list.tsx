import { mergeProps, useRender } from "@base-ui/react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";

type ListSize = "default" | "sm" | "xs";

function List({
  className,
  size = "default",
  ...props
}: React.ComponentProps<"ul"> & { size?: ListSize }) {
  return (
    <ul
      data-slot="list"
      data-size={size}
      className={cn(
        "group/list flex flex-col divide-y divide-border overflow-hidden rounded-2xl",
        className
      )}
      {...props}
    />
  );
}

function ListItem({
  className,
  render,
  ...props
}: useRender.ComponentProps<"div">) {
  const element = useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        className: cn(
          "group/item flex w-full flex-wrap items-center border border-transparent bg-muted/50 text-sm",
          "transition-colors duration-100 outline-none",
          "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
          "[a]:transition-colors [a]:hover:bg-muted",
          "group-data-[size=default]/list:gap-3.5 group-data-[size=default]/list:px-4 group-data-[size=default]/list:py-3.5",
          "group-data-[size=sm]/list:gap-3.5 group-data-[size=sm]/list:px-3.5 group-data-[size=sm]/list:py-3",
          "group-data-[size=xs]/list:gap-2 group-data-[size=xs]/list:px-2.5 group-data-[size=xs]/list:py-2",
          className
        ),
      },
      props
    ),
    render,
    state: {
      slot: "list-item",
    },
  });

  return <li>{element}</li>;
}

const listItemPrefix = cva(
  "flex shrink-0 items-center justify-center gap-2 group-has-data-[slot=list-item-description]/item:translate-y-0.5 [&_svg]:pointer-events-none",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        image:
          "size-10 overflow-hidden rounded-xl group-data-[size=sm]/list:size-8 group-data-[size=xs]/list:size-6 group-data-[size=xs]/list:rounded-lg [&_img]:size-full [&_img]:object-cover",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function ListItemPrefix({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof listItemPrefix>) {
  return (
    <div
      data-slot="list-item-prefix"
      data-variant={variant}
      className={cn(listItemPrefix({ variant, className }))}
      {...props}
    />
  );
}

function ListItemContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="list-item-content"
      className={cn(
        "flex flex-1 flex-col gap-1 group-data-[size=xs]/list:gap-0.5 [&+[data-slot=list-item-content]]:flex-none",
        className
      )}
      {...props}
    />
  );
}

function ListItemTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="list-item-title"
      className={cn(
        "line-clamp-1 flex w-fit items-center gap-2 text-sm leading-snug font-medium underline-offset-4",
        className
      )}
      {...props}
    />
  );
}

function ListItemDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="list-item-description"
      className={cn(
        "line-clamp-2 text-left text-sm font-normal text-muted-foreground [&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary",
        className
      )}
      {...props}
    />
  );
}

function ListItemSuffix({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="list-item-suffix"
      className={cn("flex items-center gap-2", className)}
      {...props}
    />
  );
}

export {
  List,
  ListItem,
  ListItemContent,
  ListItemDescription,
  ListItemPrefix,
  ListItemSuffix,
  ListItemTitle,
};
