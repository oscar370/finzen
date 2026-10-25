import { ConfirmDeleteDialog } from "@/components/confirm-delete-dialog";
import {
  List,
  ListItem,
  ListItemContent,
  ListItemSuffix,
  ListItemTitle,
} from "@/components/list";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CATEGORY_ICONS } from "@/lib/constants/category-icons";
import { formatCurrency } from "@/lib/i18n/format-currency";
import { translate } from "@/lib/i18n/translate";
import { m } from "@/paraglide/messages";
import { deleteBudget } from "@/services/budgets/delete-budget";
import type { Budget } from "@/types/budgets/budget";
import type { Category } from "@/types/categories/category";
import { Check, CircleHelp, X } from "lucide-react";
import { useState } from "react";
import { BudgetEditDialog } from "./budget-edit-dialog";

type BudgetDetailsDialogProps = {
  budget: Budget | null;
  categories: Category[];
  currency: string;
  regionalFormat: string;
  onClose: () => void;
};

export function BudgetDetailsDialog({
  budget,
  categories,
  currency,
  regionalFormat,
  onClose,
}: BudgetDetailsDialogProps) {
  const [editing, setEditing] = useState(false);
  const [last, setLast] = useState<Budget | null>(null);

  if (budget && budget !== last) setLast(budget);

  const current = budget ?? last;
  const Icon = current
    ? (CATEGORY_ICONS[current.categoryIcon] ?? CircleHelp)
    : CircleHelp;

  return (
    <>
      <Dialog
        open={budget !== null}
        onOpenChange={(open) => {
          if (!open) onClose();
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{m.budget_details()}</DialogTitle>
          </DialogHeader>

          {current && (
            <>
              <List size="sm">
                <ListItem>
                  <ListItemContent>
                    <ListItemTitle>{m.category()}</ListItemTitle>
                  </ListItemContent>
                  <ListItemSuffix>
                    <Icon />
                    {translate(current.categoryName)}
                  </ListItemSuffix>
                </ListItem>

                <ListItem>
                  <ListItemContent>
                    <ListItemTitle>{m.amount()}</ListItemTitle>
                  </ListItemContent>
                  <ListItemSuffix>
                    <span
                      className={`${
                        current.kind === "income"
                          ? "bg-green-800"
                          : "bg-red-800"
                      } rounded-md px-2 text-white`}
                    >
                      {formatCurrency(current.amount, currency, regionalFormat)}
                    </span>
                  </ListItemSuffix>
                </ListItem>

                <ListItem>
                  <ListItemContent>
                    <ListItemTitle>{m.year_month()}</ListItemTitle>
                  </ListItemContent>
                  <ListItemSuffix>{current.yearMonth}</ListItemSuffix>
                </ListItem>

                <ListItem>
                  <ListItemContent>
                    <ListItemTitle>{m.kind()}</ListItemTitle>
                  </ListItemContent>
                  <ListItemSuffix>
                    {current.kind === "income" ? m.income() : m.expense()}
                  </ListItemSuffix>
                </ListItem>

                <ListItem>
                  <ListItemContent>
                    <ListItemTitle>{m.repeat()}</ListItemTitle>
                  </ListItemContent>
                  <ListItemSuffix>
                    {current.repeat ? (
                      <Check />
                    ) : (
                      <X className="text-muted-foreground" />
                    )}
                  </ListItemSuffix>
                </ListItem>
              </List>

              <DialogFooter>
                <ConfirmDeleteDialog
                  title={m.delete_budget()}
                  successMessage={m.successes_deleted_budget()}
                  onConfirm={() => deleteBudget(current.id)}
                  onDeleted={onClose}
                  trigger={
                    <Button type="button" variant="destructive">
                      {m.delete_budget()}
                    </Button>
                  }
                />

                <Button type="button" onClick={() => setEditing(true)}>
                  {m.edit()}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {current && (
        <BudgetEditDialog
          budget={current}
          categories={categories}
          open={editing}
          onCancel={() => setEditing(false)}
          onDone={() => {
            setEditing(false);
            onClose();
          }}
        />
      )}
    </>
  );
}
