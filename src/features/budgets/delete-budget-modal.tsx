import { m } from "#/paraglide/messages";
import { deleteBudget } from "#/services/budgets";
import { Trash } from "lucide-react";
import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";

type DeleteBudgetModalProps = {
  budgetId: number | undefined;
  onDelete: () => void;
};

export function DeleteBudgetModal({ budgetId, onDelete }: DeleteBudgetModalProps) {
  const [isPending, setIsPending] = useState(false);
  const modalRef = useRef<HTMLDialogElement | null>(null);

  async function handleDelete() {
    if (!budgetId) return;

    try {
      setIsPending(true);
      await deleteBudget(budgetId);
      toast.success(m["successes.deleted_category"]());
      modalRef.current?.close();
      onDelete();
    } catch (error) {
      toast.error(m["errors.unexpected"]());
      console.error(error);
    } finally {
      setIsPending(false);
    }
  }

  return (
    <>
      <div className="tooltip tooltip-left" data-tip={m["budgets.delete"]()}>
        <button
          className="btn btn-square btn-sm btn-ghost text-error"
          aria-label={m["budgets.delete"]()}
          onClick={() => modalRef.current?.showModal()}
        >
          <Trash className="size-4" />
        </button>
      </div>

      {createPortal(
        <dialog className="modal duration-150" ref={modalRef}>
          <div className="modal-box flex flex-col items-center justify-center duration-150">
            <h2 className="text-lg font-bold">{m["budgets.delete"]()}</h2>

            <p>{m["warnings.delete"]()}</p>

            <div className="mt-6 flex w-full justify-center gap-2">
              <button
                className="btn"
                disabled={isPending}
                onClick={() => modalRef.current?.close()}
              >
                {m.cancel()}
              </button>

              <button className="btn btn-error" disabled={isPending} onClick={handleDelete}>
                {m.confirm()}
              </button>
            </div>
          </div>

          <form className="modal-backdrop" method="dialog">
            <button>{m.close_modal()}</button>
          </form>
        </dialog>,
        document.body,
      )}
    </>
  );
}
