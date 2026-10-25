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
import { deleteTransaction } from "@/services/transactions/delete-transaction";
import type { Category } from "@/types/categories/category";
import type { Transaction } from "@/types/transactions/transaction";
import { CircleHelp } from "lucide-react";
import { useState } from "react";
import { TransactionEditDialog } from "./transaction-edit-dialog";

type TransactionDetailsDialogProps = {
  transaction: Transaction | null;
  categories: Category[];
  currency: string;
  regionalFormat: string;
  onClose: () => void;
};

export function TransactionDetailsDialog({
  transaction,
  categories,
  currency,
  regionalFormat,
  onClose,
}: TransactionDetailsDialogProps) {
  const [editing, setEditing] = useState(false);
  const [last, setLast] = useState<Transaction | null>(null);

  if (transaction && transaction !== last) setLast(transaction);

  const current = transaction ?? last;
  const Icon = current
    ? (CATEGORY_ICONS[current.categoryIcon] ?? CircleHelp)
    : CircleHelp;

  return (
    <>
      <Dialog
        open={transaction !== null}
        onOpenChange={(open) => {
          if (!open) onClose();
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{m.transaction_details()}</DialogTitle>
          </DialogHeader>

          {current && (
            <>
              <List size="sm">
                <ListItem>
                  <ListItemContent>
                    <ListItemTitle>{m.name()}</ListItemTitle>
                  </ListItemContent>
                  <ListItemSuffix>{current.name}</ListItemSuffix>
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
                    <ListItemTitle>{m.date()}</ListItemTitle>
                  </ListItemContent>
                  <ListItemSuffix>
                    {current.date.toLocaleDateString(regionalFormat)}
                  </ListItemSuffix>
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
                    <ListItemTitle>{m.category()}</ListItemTitle>
                  </ListItemContent>
                  <ListItemSuffix>
                    <Icon />
                    {translate(current.categoryName)}
                  </ListItemSuffix>
                </ListItem>

                {current.note && (
                  <ListItem>
                    <ListItemContent>
                      <ListItemTitle>{m.note()}</ListItemTitle>
                    </ListItemContent>
                    <ListItemSuffix>{current.note}</ListItemSuffix>
                  </ListItem>
                )}
              </List>

              <DialogFooter>
                <ConfirmDeleteDialog
                  title={m.delete_transaction()}
                  successMessage={m.successes_deleted_transaction()}
                  onConfirm={() => deleteTransaction(current.id)}
                  onDeleted={onClose}
                  trigger={
                    <Button type="button" variant="destructive">
                      {m.delete_transaction()}
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
        <TransactionEditDialog
          transaction={current}
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
