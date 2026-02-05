import { deleteBudget } from "@/api/budgets";
import { ActionRow } from "@/components/ui/action-row";
import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { ButtonRow } from "@/components/ui/button-row";
import { ListBox } from "@/components/ui/list-box";
import { modal } from "@/components/ui/modal-manager";
import { useAppStore } from "@/stores/use-app-store";
import type { Budget } from "@/types/budgets";
import { formatCurrency } from "@/utils/format-currency";
import { Pencil, Trash } from "lucide-react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

type BudgetDetailsProps = {
  budget: Budget;
};

export function BudgetDetails({ budget }: BudgetDetailsProps) {
  const { t } = useTranslation("budgets");
  const currency = useAppStore((state) => state.currency);
  const navigate = useNavigate();

  async function handleDelete() {
    const result = await deleteBudget(budget.id);

    if (!result?.ok) {
      toast.error(t("errors.delete"));
      return;
    }

    modal.close();
    toast.success(t("success.delete"));

    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
      return;
    }

    navigate("/budgets", { replace: true });
  }

  function handleOpenDeleteModal() {
    modal.open(
      t("modalDelete.title"),
      <>
        <p className="text-xl font-bold"> {t("modalDelete.message")} </p>

        <ListBox>
          <ButtonRow variant="destructive" onClick={handleDelete}>
            {t("modalDelete.button")}
          </ButtonRow>
        </ListBox>
      </>,
    );
  }

  return (
    <ListBox
      title={t("titles.details")}
      headerButton={
        <Box linked>
          <Button
            aria-label={t("buttons.edit")}
            role="link"
            onClick={() => navigate(`/budgets/edit/${budget.id}`)}
          >
            <Pencil size={18} />
          </Button>

          <Button
            aria-label={t("buttons.delete")}
            variant="destructive"
            onClick={handleOpenDeleteModal}
          >
            <Trash size={18} />
          </Button>
        </Box>
      }
    >
      <ActionRow
        title={t("fields.category")}
        subtitle={t(budget.categoryName, { ns: "categories" })}
        property
      />
      <ActionRow title={t("fields.year")} subtitle={budget.year} property />
      <ActionRow title={t("fields.month")} subtitle={budget.month} property />
      <ActionRow
        title={t("fields.kind")}
        subtitle={t(`kind.${budget.kind}`, { ns: "transactions" })}
        property
      />
      <ActionRow
        title={t("fields.amount")}
        subtitle={formatCurrency(currency, budget.amount)}
        property
      />
    </ListBox>
  );
}
