import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { m } from "@/paraglide/messages";
import type { Category } from "@/types/categories/category";
import { CategoryForm } from "./category-form";

type CategoryEditDialogProps = {
  category: Category;
  open: boolean;
  onCancel: () => void;
  onDone: () => void;
};

export function CategoryEditDialog({
  category,
  open,
  onCancel,
  onDone,
}: CategoryEditDialogProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) onCancel();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{m.edit_category()}</DialogTitle>
        </DialogHeader>

        <CategoryForm category={category} onDone={onDone} />
      </DialogContent>
    </Dialog>
  );
}
