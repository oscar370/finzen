import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { useTranslation } from "react-i18next";

type DialogProps = {
  title: string;
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export function Modal({ title, open, onClose, children }: DialogProps) {
  const { t } = useTranslation("arias");
  return (
    <Dialog className="relative z-10" open={open} onClose={onClose}>
      <DialogBackdrop
        className="fixed inset-0 bg-black/50 duration-100 ease-out data-closed:opacity-0"
        transition
      />

      <div className="fixed inset-0 flex w-screen items-center justify-center">
        <DialogPanel
          className="z-10 max-w-150 overflow-y-auto rounded-xl bg-(--dialog-bg) py-2 shadow-sm duration-100 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0"
          transition
        >
          <header className="px-1">
            <nav className="grid grid-cols-3">
              <span
                aria-label={t("modal.title")}
                className="col-end-3 text-center"
              >
                {title}
              </span>
              <div className="text-end">
                <button
                  title={t("modal.close-button")}
                  aria-label={t("modal.close-button")}
                  className="w-fit cursor-pointer rounded-full bg-[#000006]/12 p-1 dark:bg-[#404041]"
                  onClick={onClose}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="16px"
                    viewBox="0 0 16 16"
                    width="16px"
                    className="text-black/80 dark:text-white"
                  >
                    <path
                      d="m 5.019531 4 c -0.265625 0 -0.519531 0.105469 -0.707031 0.292969 c -0.390625 0.390625 -0.390625 1.023437 0 1.414062 l 2.292969 2.292969 l -2.292969 2.292969 c -0.390625 0.390625 -0.390625 1.023437 0 1.414062 s 1.023438 0.390625 1.414062 0 l 2.292969 -2.292969 l 2.292969 2.292969 c 0.390625 0.390625 1.023438 0.390625 1.414062 0 c 0.390626 -0.390625 0.390626 -1.023437 0 -1.414062 l -2.292968 -2.292969 l 2.292968 -2.292969 c 0.390626 -0.390625 0.390626 -1.023437 0 -1.414062 c -0.1875 -0.1875 -0.441406 -0.292969 -0.707031 -0.292969 s -0.519531 0.105469 -0.707031 0.292969 l -2.292969 2.292969 l -2.292969 -2.292969 c -0.1875 -0.1875 -0.441406 -0.292969 -0.707031 -0.292969 z m 0 0"
                      fill="currentColor"
                    />
                  </svg>
                </button>
              </div>
            </nav>
          </header>

          <div className="mt-2 px-4">{children}</div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
