import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { m } from "@/paraglide/messages";
import type { Budget } from "@/types/budgets/budget";
import type { Category } from "@/types/categories/category";
import { BudgetForm } from "./budget-form";

type BudgetEditDialogProps = {
  budget: Budget;
  categories: Category[];
  open: boolean;
  onCancel: () => void;
  onDone: () => void;
};

export function BudgetEditDialog({
  budget,
  categories,
  open,
  onCancel,
  onDone,
}: BudgetEditDialogProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) onCancel();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{m.edit_budget()}</DialogTitle>
        </DialogHeader>

        <BudgetForm
          categories={categories}
          yearMonth={budget.yearMonth}
          budget={budget}
          onDone={onDone}
        />
      </DialogContent>
    </Dialog>
  );
}
