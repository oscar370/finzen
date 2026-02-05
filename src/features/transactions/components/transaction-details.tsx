import { useAccountById } from "@/api/accounts";
import { useCategoryById } from "@/api/categories";
import { archiveTransaction, unarchiveTransaction } from "@/api/transactions";
import { ActionRow } from "@/components/ui/action-row";
import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { ButtonRow } from "@/components/ui/button-row";
import { ListBox } from "@/components/ui/list-box";
import { modal } from "@/components/ui/modal-manager";
import { useAppStore } from "@/stores/use-app-store";
import type { Transaction } from "@/types/transactions";
import { formatCurrency } from "@/utils/format-currency";
import dayjs from "dayjs";
import { Archive, ArchiveRestore, Pencil } from "lucide-react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

type TransactionDetailsProps = {
  transaction: Transaction;
};

export function TransactionDetails({ transaction }: TransactionDetailsProps) {
  const { t } = useTranslation("transactions");
  const currency = useAppStore((state) => state.currency);
  const category = useCategoryById(transaction.categoryId);
  const account = useAccountById(transaction.accountId);
  const navigate = useNavigate();

  async function handleArchive() {
    const result = await archiveTransaction(transaction.id);

    if (!result?.ok) {
      toast.error(t("errors.archive"));
      return;
    }

    modal.close();
    toast.success(t("success.archive"));

    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
      return;
    }

    navigate(`${transaction.kind}s`, { replace: true });
  }

  function handleOpenArchiveModal() {
    modal.open(
      t("modalArchive.title"),
      <>
        <p className="text-center font-bold"> {t("modalArchive.message")} </p>

        <ListBox>
          <ButtonRow variant="destructive" onClick={handleArchive}>
            {t("modalArchive.button")}
          </ButtonRow>
        </ListBox>
      </>,
    );
  }

  async function handleUnarchive() {
    const result = await unarchiveTransaction(transaction.id);

    if (!result?.ok) {
      toast.error(t("errors.unarchive"));
      return;
    }

    modal.close();
    toast.success(t("success.unarchive"));
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
      return;
    }

    navigate(`${transaction.kind}s`, { replace: true });
  }

  function handleOpenUnarchiveModal() {
    modal.open(
      t("modalUnarchive.title"),
      <>
        <p className="text-center font-bold"> {t("modalUnarchive.message")} </p>

        <ListBox>
          <ButtonRow variant="suggested" onClick={handleUnarchive}>
            {t("modalUnarchive.button")}
          </ButtonRow>
        </ListBox>
      </>,
    );
  }

  return (
    <ListBox
      title={t("transactionDetails.title")}
      headerButton={
        <Box linked>
          {transaction.archive === 1 ? (
            <Button
              aria-label={t("buttons.unarchive")}
              onClick={handleOpenUnarchiveModal}
            >
              <ArchiveRestore />
            </Button>
          ) : (
            <>
              <Button
                aria-label={t("buttons.edit")}
                role="link"
                onClick={() => navigate(`/transactions/edit/${transaction.id}`)}
              >
                <Pencil size={18} />
              </Button>

              <Button
                aria-label={t("buttons.archive")}
                variant="destructive"
                onClick={handleOpenArchiveModal}
              >
                <Archive size={18} />
              </Button>
            </>
          )}
        </Box>
      }
    >
      <ActionRow
        title={t("fields.name")}
        subtitle={transaction.name}
        property
      />
      <ActionRow
        title={t("fields.kind")}
        subtitle={t(`kind.${transaction.kind}`)}
        property
      />
      <ActionRow
        title={t("fields.amount")}
        subtitle={formatCurrency(currency, transaction.amount)}
        property
      />
      <ActionRow
        title={t("fields.category")}
        subtitle={t(`${category?.name}`, { ns: "categories" })}
        property
      />
      <ActionRow
        title={t("fields.account")}
        subtitle={account?.name}
        property
      />
      <ActionRow
        title={t("fields.date")}
        subtitle={dayjs(transaction.date).format("LLLL")}
        property
      />
      <ActionRow
        title={t("fields.note")}
        subtitle={transaction.note}
        property
      />
    </ListBox>
  );
}
