import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CATEGORY_ICONS } from "@/lib/constants/category-icons";
import { m } from "@/paraglide/messages";
import { cn } from "cn";
import { Bolt, ChevronDown } from "lucide-react";
import { useState } from "react";

type IconSelectorProps = {
  id?: string;
  value: string | undefined;
  onChange: (value: string) => void;
  "aria-invalid"?: boolean;
};

export function IconSelector({
  id,
  value,
  onChange,
  "aria-invalid": ariaInvalid,
}: IconSelectorProps) {
  const [open, setOpen] = useState(false);
  const SelectedIcon = (value && CATEGORY_ICONS[value]) || Bolt;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        id={id}
        aria-invalid={ariaInvalid}
        render={
          <Button
            type="button"
            variant="outline"
            className="w-full justify-between"
          />
        }
      >
        <span className="flex items-center gap-2">
          <SelectedIcon />
          {value ?? m.icon()}
        </span>
        <ChevronDown className="size-4" />
      </PopoverTrigger>

      <PopoverContent align="start" className="w-72">
        <div className="grid grid-cols-6 gap-1">
          {Object.entries(CATEGORY_ICONS).map(([name, Icon]) => (
            <Button
              key={name}
              type="button"
              variant={value === name ? "default" : "ghost"}
              size="icon"
              aria-label={name}
              className={cn("size-9")}
              onClick={() => {
                onChange(name);
                setOpen(false);
              }}
            >
              <Icon />
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
