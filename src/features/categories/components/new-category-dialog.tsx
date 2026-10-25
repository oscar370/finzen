import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { m } from "@/paraglide/messages";
import { Plus } from "lucide-react";
import { useState } from "react";
import { CategoryForm } from "./category-form";

export function NewCategoryDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            aria-label={m.new_category()}
            variant="ghost"
            size="icon-sm"
          />
        }
      >
        <Plus />
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{m.new_category()}</DialogTitle>
        </DialogHeader>

        <CategoryForm onDone={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
