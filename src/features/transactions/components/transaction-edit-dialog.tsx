import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { m } from "@/paraglide/messages";
import type { Category } from "@/types/categories/category";
import type { Transaction } from "@/types/transactions/transaction";
import { TransactionForm } from "./transaction-form";

type TransactionEditDialogProps = {
  transaction: Transaction;
  categories: Category[];
  open: boolean;
  onCancel: () => void;
  onDone: () => void;
};

export function TransactionEditDialog({
  transaction,
  categories,
  open,
  onCancel,
  onDone,
}: TransactionEditDialogProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) onCancel();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{m.edit_transaction()}</DialogTitle>
        </DialogHeader>

        <TransactionForm
          categories={categories}
          type={transaction.kind}
          transaction={transaction}
          onDone={onDone}
        />
      </DialogContent>
    </Dialog>
  );
}
