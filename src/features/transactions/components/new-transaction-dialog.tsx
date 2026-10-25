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
import { TransactionForm } from "./transaction-form";

type NewTransactionDialogProps = {
  categories: Category[];
  type: "income" | "expense";
};

export function NewTransactionDialog({
  categories,
  type,
}: NewTransactionDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            aria-label={m.new_transaction()}
            variant="ghost"
            size="icon-sm"
          />
        }
      >
        <Plus />
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{m.new_transaction()}</DialogTitle>
        </DialogHeader>

        <TransactionForm
          categories={categories}
          type={type}
          onDone={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
