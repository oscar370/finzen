import { m } from "#/paraglide/messages";
import { deleteCategory } from "#/services/categories";
import { Trash } from "lucide-react";
import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";

type DeleteCategoryModalProps = {
  categoryId: number | undefined;
  onDelete: () => void;
};

export function DeleteCategoryModal({ categoryId, onDelete }: DeleteCategoryModalProps) {
  const [isPending, setIsPending] = useState(false);
  const modalRef = useRef<HTMLDialogElement | null>(null);

  async function handleDelete() {
    if (!categoryId) return;
    try {
      setIsPending(true);
      await deleteCategory(categoryId);
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
      <div className="tooltip tooltip-left" data-tip={m["categories.delete"]()}>
        <button
          className="btn btn-square btn-sm btn-ghost text-error"
          aria-label={m["categories.delete"]()}
          onClick={() => modalRef.current?.showModal()}
        >
          <Trash className="size-4" />
        </button>
      </div>

      {createPortal(
        <dialog className="modal duration-150" ref={modalRef} onClose={(e) => e.stopPropagation()}>
          <div className="modal-box flex flex-col items-center justify-center duration-150">
            <h2 className="text-lg font-bold">{m["categories.delete"]()}</h2>

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
