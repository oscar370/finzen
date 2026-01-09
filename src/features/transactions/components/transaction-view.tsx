import { archiveTransaction } from "@/api/transactions";
import { ArchiveButton } from "@/components/ui/archive-button";
import { CloseButton } from "@/components/ui/close-button";
import { EditButton } from "@/components/ui/edit-button";
import { Group } from "@/components/ui/group";
import { Modal } from "@/components/ui/modal";
import type { Transaction } from "@/types/transactions";
import { t } from "i18next";
import { useState } from "react";
import toast from "react-hot-toast";
import { TransactionDetail } from "./transaction-detail";

type TransactionViewProps = {
  transaction: Transaction;
};

export function TransactionView({ transaction }: TransactionViewProps) {
  const [isOpen, setIsOpen] = useState(false);

  function handleOpenModal() {
    setIsOpen(true);
  }

  function handleCloseModal() {
    setIsOpen(false);
  }

  async function handleArchive() {
    try {
      await archiveTransaction(transaction.id);
      toast.success(t("success.archive", { ns: "transactions" }));
    } catch (error) {
      console.error(error);
      toast.error(t("errors.archive", { ns: "transactions" }));
    } finally {
      setIsOpen(false);
    }
  }

  return (
    <>
      <main className="mx-auto max-w-150 space-y-3 px-1 py-3">
        <Group
          title={t("fields.title", { ns: "transactions" })}
          button={
            <ArchiveButton onClick={handleOpenModal}>
              {t("buttons.archive", { ns: "transactions" })}
            </ArchiveButton>
          }
        >
          <TransactionDetail data={transaction} />
        </Group>

        <div className="flex justify-center">
          <EditButton to={`/transactions/edit/${transaction.id}`}>
            Edit transaction
          </EditButton>
        </div>
      </main>

      <Modal open={isOpen} onClose={handleCloseModal}>
        <div className="max-w-150 px-4 py-6">
          <h2 className="text-2xl"> Archive transaction? </h2>
          <p className="text-justify">
            It will no longer affect statistics and will disappear from all
            views.
          </p>

          <div className="mt-6 flex gap-4">
            <CloseButton onClick={handleCloseModal}> Cancel </CloseButton>
            <ArchiveButton onClick={handleArchive}> Archive </ArchiveButton>
          </div>
        </div>
      </Modal>
    </>
  );
}
