import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";

type ModalProps = {
  open: boolean;
  children: React.ReactNode;
  onClose: () => void;
};

export function Modal({ open, children, onClose }: ModalProps) {
  return (
    <Dialog className="relative z-10" open={open} onClose={onClose}>
      <DialogBackdrop
        className="fixed inset-0 bg-black/80 duration-150 ease-out data-closed:opacity-0"
        transition
      />

      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel
          className="z-10 max-h-[90%] min-w-[70%] overflow-y-auto rounded-xl bg-(--background) shadow-sm duration-150 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0"
          transition
        >
          {children}
        </DialogPanel>
      </div>
    </Dialog>
  );
}
