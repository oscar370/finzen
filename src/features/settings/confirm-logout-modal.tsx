import { authClient } from "#/lib/auth-client";
import { m } from "#/paraglide/messages";
import { stopBackup } from "#/services/backup";
import { ChevronRight } from "lucide-react";
import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";

export function ConfirmLogoutModal() {
  const [isPending, setIsPending] = useState(false);
  const modalRef = useRef<HTMLDialogElement | null>(null);

  async function handleGoogleLogout() {
    setIsPending(true);
    try {
      await stopBackup();
      await authClient.signOut();
    } catch (error) {
      console.error(error);
      toast.error(m["errors.unexpected"]());
    } finally {
      setIsPending(false);
    }
  }

  return (
    <>
      <li>
        <button
          className="list-row w-full cursor-pointer items-center"
          disabled={isPending}
          onClick={() => modalRef.current?.showModal()}
        >
          <span className="list-col-grow text-start">{m.logout()}</span>

          {isPending ? <span className="loading loading-spinner"></span> : <ChevronRight />}
        </button>
      </li>

      {createPortal(
        <dialog className="modal duration-150" ref={modalRef}>
          <div className="modal-box space-y-2 overflow-visible duration-150">
            <h2 className="text-lg font-bold">{m.logout()}</h2>

            <p>{m["warnings.logout"]()}</p>

            <div className="flex justify-end gap-2">
              <button
                className="btn"
                disabled={isPending}
                type="button"
                onClick={() => modalRef.current?.close()}
              >
                {m.cancel()}
              </button>
              <button className="btn btn-primary" onClick={handleGoogleLogout}>
                {m.continue()}
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
