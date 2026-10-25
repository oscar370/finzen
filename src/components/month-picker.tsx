"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getMonths } from "@/lib/i18n/get-months";
import { capitalize } from "@/lib/utils/capitalize";
import { formatYearMonth } from "@/lib/utils/format-year-month";
import { parseYearMonth } from "@/lib/utils/parse-year-month";
import { m } from "@/paraglide/messages";
import { getLocale, type Locale } from "@/paraglide/runtime";
import { cn } from "cn";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import * as React from "react";

type MonthParts = { year: number; month: number };

const toIndex = (p: MonthParts) => p.year * 12 + p.month;

export interface MonthPickerProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  min?: string;
  max?: string;
  name?: string;
  id?: string;
  disabled?: boolean;
  placeholder?: string;
  locale?: Locale;
  className?: string;
  "aria-invalid"?: boolean;
}

export function MonthPicker({
  value: valueProp,
  defaultValue = "",
  onChange,
  min,
  max,
  name,
  id,
  disabled,
  placeholder = m.select_a_month(),
  locale = getLocale(),
  className,
  "aria-invalid": ariaInvalid,
}: MonthPickerProps) {
  const isControlled = valueProp !== undefined;
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const value = isControlled ? valueProp : internalValue;

  const selected = parseYearMonth(value);
  const minParts = parseYearMonth(min);
  const maxParts = parseYearMonth(max);

  const today = new Date();
  const current = { year: today.getFullYear(), month: today.getMonth() };

  const [open, setOpen] = React.useState(false);
  const [viewYear, setViewYear] = React.useState(
    selected?.year ?? current.year
  );

  const setValue = (next: string) => {
    if (!isControlled) setInternalValue(next);
    onChange?.(next);
  };

  const isOutOfRange = (p: MonthParts) =>
    (minParts && toIndex(p) < toIndex(minParts)) ||
    (maxParts && toIndex(p) > toIndex(maxParts));

  const shortMonths = React.useMemo(
    () =>
      getMonths(locale, "short").map((option) => ({
        ...option,
        label: capitalize(option.label.replace(".", ""), locale),
      })),
    [locale]
  );

  const longLabel = React.useMemo(() => {
    if (!selected) return null;
    const label = new Intl.DateTimeFormat(locale, {
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    }).format(new Date(Date.UTC(selected.year, selected.month, 1)));
    return capitalize(label, locale);
  }, [selected?.year, selected?.month, locale]);

  const canGoPrev = !minParts || viewYear > minParts.year;
  const canGoNext = !maxParts || viewYear < maxParts.year;

  const select = (month: number) => {
    setValue(formatYearMonth(viewYear, month));
    setOpen(false);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) setViewYear(selected?.year ?? current.year);
    setOpen(nextOpen);
  };

  return (
    <>
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger
          id={id}
          type="button"
          disabled={disabled}
          aria-invalid={ariaInvalid}
          className={cn(
            "flex h-8 w-full min-w-0 items-center gap-2 rounded-2xl border border-transparent bg-input/50 px-2.5 py-1 text-left text-base transition-[color,box-shadow] duration-200 outline-none md:text-sm",
            "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30",
            "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
            "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
            "data-popup-open:border-ring data-popup-open:ring-3 data-popup-open:ring-ring/30",
            !selected && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="size-4 shrink-0 text-muted-foreground" />
          <span className="truncate">{longLabel ?? placeholder}</span>
        </PopoverTrigger>

        <PopoverContent className="w-64 p-3" align="start">
          <div className="flex items-center justify-between">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setViewYear((y) => y - 1)}
              disabled={!canGoPrev}
              aria-label={m.previous_year()}
            >
              <ChevronLeft className="size-4" />
            </Button>
            <span className="text-sm font-medium" aria-live="polite">
              {viewYear}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setViewYear((y) => y + 1)}
              disabled={!canGoNext}
              aria-label={m.next_year()}
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>

          <div
            className="grid grid-cols-3 gap-2"
            role="group"
            aria-label={String(viewYear)}
          >
            {shortMonths.map((month, i) => {
              const parts = { year: viewYear, month: i };
              const isSelected =
                selected?.year === viewYear && selected.month === i;
              const isCurrent =
                current.year === viewYear && current.month === i;

              return (
                <Button
                  key={i}
                  type="button"
                  variant={isSelected ? "default" : "ghost"}
                  size="sm"
                  disabled={!!isOutOfRange(parts)}
                  onClick={() => select(i)}
                  aria-pressed={isSelected}
                  className={cn(
                    "h-8",
                    isCurrent && !isSelected && "border border-primary/50"
                  )}
                >
                  {month.label}
                </Button>
              );
            })}
          </div>
        </PopoverContent>
      </Popover>

      {name && <input type="hidden" name={name} value={value} />}
    </>
  );
}
