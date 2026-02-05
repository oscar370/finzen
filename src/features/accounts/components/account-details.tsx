import { archiveAccount, unarchiveAccount } from "@/api/accounts";
import { ActionRow } from "@/components/ui/action-row";
import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { ButtonRow } from "@/components/ui/button-row";
import { ListBox } from "@/components/ui/list-box";
import { modal } from "@/components/ui/modal-manager";
import { useAppStore } from "@/stores/use-app-store";
import type { Account } from "@/types/accounts";
import { formatCurrency } from "@/utils/format-currency";
import { Archive, ArchiveRestore, ArrowUp, Pencil } from "lucide-react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { AddTransferForm } from "./add-transfer-form";

type AccountDetailsProps = {
  account: Account;
};

export function AccountDetails({ account }: AccountDetailsProps) {
  const currency = useAppStore((state) => state.currency);
  const { t } = useTranslation("accounts");
  const navigate = useNavigate();

  async function handleArchive() {
    const result = await archiveAccount(account.id);

    if (!result.ok) {
      toast.error(t("errors.archive"));
      return;
    }

    modal.close();
    toast.success(t("success.archive"));

    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
      return;
    }

    navigate("..", { replace: true });
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
    const result = await unarchiveAccount(account.id);

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

    navigate("..", { replace: true });
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

  function handleOpenTransferModal() {
    modal.open(
      t("modalTransfer.title"),

      <AddTransferForm
        account={account}
        onSuccess={() => {
          if (window.history.state && window.history.state.idx > 0) {
            navigate(-1);
            return;
          }

          navigate("..", { replace: true });
          modal.close();
        }}
      />,
    );
  }

  return (
    <ListBox
      title={t("titles.accountDetails")}
      headerButton={
        <Box linked>
          {account.archive === 1 ? (
            <Button
              aria-label={t("buttons.unarchive")}
              title={t("buttons.unarchive")}
              onClick={handleOpenUnarchiveModal}
            >
              <ArchiveRestore size={18} />
            </Button>
          ) : (
            <>
              <Button
                aria-label={t("buttons.transfer")}
                title={t("buttons.transfer")}
                onClick={handleOpenTransferModal}
              >
                <ArrowUp size={18} />
              </Button>

              <Button
                aria-label={t("buttons.edit")}
                title={t("buttons.edit")}
                role="link"
                onClick={() => navigate(`/accounts/edit/${account.id}`)}
              >
                <Pencil size={18} />
              </Button>

              <Button
                aria-label={t("buttons.archive")}
                title={t("buttons.archive")}
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
        title={t("fields.name.label")}
        subtitle={account.name}
        property
      />
      <ActionRow
        title={t("fields.type.label")}
        subtitle={account.type.charAt(0).toUpperCase() + account.type.slice(1)}
        property
      />
      <ActionRow
        title={t("fields.initialBalance.label")}
        subtitle={formatCurrency(currency, account.initialBalance)}
        property
      />
      <ActionRow
        title={t("fields.balance.label")}
        subtitle={formatCurrency(currency, account.balance)}
        property
      />
    </ListBox>
  );
}
