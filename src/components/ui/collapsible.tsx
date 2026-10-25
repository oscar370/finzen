import { Collapsible as CollapsiblePrimitive } from "@base-ui/react/collapsible";
import { cn } from "cn";
import { ChevronDown } from "lucide-react";

function Collapsible({ className, ...props }: CollapsiblePrimitive.Root.Props) {
  return (
    <CollapsiblePrimitive.Root
      className={cn(
        "rounded-2xl bg-muted/50 transition-colors duration-150 hover:bg-muted",
        className
      )}
      data-slot="collapsible"
      {...props}
    />
  );
}

function CollapsibleTrigger({
  className,
  children,
  ...props
}: CollapsiblePrimitive.Trigger.Props) {
  return (
    <CollapsiblePrimitive.Trigger
      className={cn(
        "group flex w-full rounded-2xl border border-transparent px-4 py-3.5 text-left text-sm transition-[color,box-shadow,border-color] duration-150 outline-none",
        "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
        className
      )}
      data-slot="collapsible-trigger"
      {...props}
    >
      {children}
      <ChevronDown className="transition-transform duration-100 ease-[ease-out] group-data-panel-open:rotate-180" />
    </CollapsiblePrimitive.Trigger>
  );
}

function CollapsibleContent({
  className,
  children,
  ...props
}: CollapsiblePrimitive.Panel.Props) {
  return (
    <CollapsiblePrimitive.Panel
      className={cn(
        "flex h-(--collapsible-panel-height) flex-col justify-end overflow-hidden",
        "transition-[height] duration-200 ease-out",
        "data-ending-style:h-0 data-starting-style:h-0",
        "[&[hidden]:not([hidden='until-found'])]:hidden"
      )}
      data-slot="collapsible-content"
      {...props}
    >
      <div className={cn("px-4 pt-1 pb-3.5 text-sm", className)}>
        {children}
      </div>
    </CollapsiblePrimitive.Panel>
  );
}

export { Collapsible, CollapsibleContent, CollapsibleTrigger };
