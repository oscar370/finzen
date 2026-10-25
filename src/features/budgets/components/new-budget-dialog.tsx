import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { m } from "@/paraglide/messages";
import type { Category } from "@/types/categories/category";
import { Plus } from "lucide-react";
import { useState } from "react";
import { BudgetForm } from "./budget-form";

type NewBudgetDialogProps = {
  categories: Category[];
  yearMonth: string;
};

export function NewBudgetDialog({
  categories,
  yearMonth,
}: NewBudgetDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button aria-label={m.new_budget()} variant="ghost" size="icon-sm" />
        }
      >
        <Plus />
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{m.new_budget()}</DialogTitle>
        </DialogHeader>

        <BudgetForm
          categories={categories}
          yearMonth={yearMonth}
          onDone={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
