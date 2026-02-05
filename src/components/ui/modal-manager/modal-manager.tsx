import React, { useEffect, useState } from "react";
import { Modal } from "../modal/modal";

type ModalInstance = {
  id: string;
  title: string;
  content: React.ReactNode;
  isOpen: boolean;
};

let listeners: ((modals: ModalInstance[]) => void)[] = [];
let modalsStack: ModalInstance[] = [];

const notify = () => {
  listeners.forEach((l) => l([...modalsStack]));
};

export const modal = {
  open: (title: string, content: React.ReactNode) => {
    const id = crypto.randomUUID();
    const newModal: ModalInstance = { id, title, content, isOpen: true };
    modalsStack = [...modalsStack, newModal];
    notify();
    return id;
  },

  close: (id?: string) => {
    if (modalsStack.length === 0) return;

    if (!id) {
      const last = modalsStack[modalsStack.length - 1];
      modal.close(last.id);
      return;
    }

    modalsStack = modalsStack.map((m) =>
      m.id === id ? { ...m, isOpen: false } : m,
    );
    notify();

    setTimeout(() => {
      modalsStack = modalsStack.filter((m) => m.id !== id);
      notify();
    }, 200);
  },

  closeAll: () => {
    modalsStack = [];
    notify();
  },
};

export function ModalManager() {
  const [modals, setModals] = useState<ModalInstance[]>([]);

  useEffect(() => {
    const listener = (newStack: ModalInstance[]) => setModals(newStack);
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  }, []);

  return (
    <>
      {modals.map((instance) => (
        <Modal
          key={instance.id}
          title={instance.title}
          open={instance.isOpen}
          onClose={() => modal.close(instance.id)}
        >
          {instance.content}
        </Modal>
      ))}
    </>
  );
}
