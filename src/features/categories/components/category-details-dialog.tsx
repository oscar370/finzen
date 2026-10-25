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
import { translate } from "@/lib/i18n/translate";
import { m } from "@/paraglide/messages";
import { deleteCategory } from "@/services/categories/delete-category";
import type { Category } from "@/types/categories/category";
import { CircleHelp } from "lucide-react";
import { useState } from "react";
import { CategoryEditDialog } from "./category-edit-dialog";

type CategoryDetailsDialogProps = {
  category: Category | null;
  onClose: () => void;
};

export function CategoryDetailsDialog({
  category,
  onClose,
}: CategoryDetailsDialogProps) {
  const [editing, setEditing] = useState(false);
  const [last, setLast] = useState<Category | null>(null);

  if (category && category !== last) setLast(category);

  const current = category ?? last;
  const Icon = current
    ? (CATEGORY_ICONS[current.icon] ?? CircleHelp)
    : CircleHelp;

  return (
    <>
      <Dialog
        open={category !== null}
        onOpenChange={(open) => {
          if (!open) onClose();
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{m.category_details()}</DialogTitle>
          </DialogHeader>

          {current && (
            <>
              <List size="sm">
                <ListItem>
                  <ListItemContent>
                    <ListItemTitle>{m.name()}</ListItemTitle>
                  </ListItemContent>
                  <ListItemSuffix>{translate(current.name)}</ListItemSuffix>
                </ListItem>

                <ListItem>
                  <ListItemContent>
                    <ListItemTitle>{m.icon()}</ListItemTitle>
                  </ListItemContent>
                  <ListItemSuffix>
                    <Icon />
                  </ListItemSuffix>
                </ListItem>
              </List>

              <DialogFooter>
                <ConfirmDeleteDialog
                  title={m.delete_category()}
                  successMessage={m.successes_deleted_category()}
                  onConfirm={() => deleteCategory(current.id)}
                  onDeleted={onClose}
                  trigger={
                    <Button type="button" variant="destructive">
                      {m.delete_category()}
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
        <CategoryEditDialog
          category={current}
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
