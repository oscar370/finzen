import { toast } from "@/components/ui/toast";
import { m } from "@/paraglide/messages";
import { AppError } from "./app-error";

export function notifyError(error: unknown) {
  if (error instanceof AppError) {
    toast.add({
      description: error.message,
      type: "error",
    });

    return;
  }

  console.error(error);

  toast.add({
    description: m.errors_unexpected(),
    type: "error",
  });
}
