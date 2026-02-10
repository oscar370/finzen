import {
  restoreBudgets,
  useBudgets,
  useLastMonthBudgetsCount,
} from "@/api/budgets";
import { ButtonRow } from "@/components/ui/button-row";
import { EntryRow } from "@/components/ui/entry-row";
import { ExpanderRow } from "@/components/ui/expander-row";
import { ListBox } from "@/components/ui/list-box";
import { modal } from "@/components/ui/modal-manager";
import { NavigationPage } from "@/components/ui/navigation-page";
import {
  BudgetBalanceComparison,
  BudgetTotalComparisonChart,
} from "@/features/analytics";
import { BudgetsItems } from "@/features/budgets";
import dayjs from "dayjs";
import { Plus, Redo2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export default function Budgets() {
  const { t } = useTranslation("budgets");
  const navigate = useNavigate();
  const currentYear = dayjs().year();
  const currentMonth = dayjs().month() + 1;
  const [year, setYear] = useState(dayjs().format("YYYY"));
  const [month, setMonth] = useState(dayjs().format("MM"));
  const budgets = useBudgets(+year, +month);
  const lastMonthBudgetsCount = useLastMonthBudgetsCount();

  async function handleRestore() {
    const result = await restoreBudgets(currentYear, currentMonth);

    if (!result?.ok) {
      toast.error(t("errors.restore"));
      return;
    }

    modal.close();
    toast.success(t("success.restore"));
  }

  function handleOpenRestoreModal() {
    modal.open(
      t("modalRestore.title"),
      <>
        <p className="text-center font-bold"> {t("modalRestore.message")} </p>

        <ListBox>
          <ButtonRow variant="suggested" onClick={handleRestore}>
            {t("modalRestore.button")}
          </ButtonRow>
        </ListBox>
      </>,
    );
  }

  return (
    <NavigationPage title={t("sections.budgets", { ns: "common" })}>
      <ListBox>
        <ExpanderRow title={t("filters.title")}>
          <EntryRow
            title={t("fields.year")}
            disabledIcon
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />
          <EntryRow
            title={t("fields.month")}
            disabledIcon
            type="number"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          />
        </ExpanderRow>
        {currentYear === +year &&
          currentMonth === +month &&
          lastMonthBudgetsCount > 0 && (
            <ButtonRow onClick={handleOpenRestoreModal}>
              <Redo2 />
              {t("buttons.restore")}
            </ButtonRow>
          )}
      </ListBox>

      <ListBox title={t("titles.list")}>
        <ButtonRow role="link" onClick={() => navigate("new")}>
          <Plus />
          <span> {t("buttons.add")} </span>
        </ButtonRow>

        <BudgetsItems budgets={budgets} />
      </ListBox>

      <ListBox>
        <ExpanderRow title={t("sections.analytics", { ns: "common" })}>
          <li className="px-4 py-1">
            <p className="mb-1 font-bold">
              {t("titles.budgetBalanceComparison", { ns: "analytics" })}
            </p>

            <BudgetBalanceComparison year={+year} month={+month} />
          </li>

          <li className="px-4 py-1">
            <p className="mb-1 font-bold">
              {t("titles.comparisonIncome", { ns: "analytics" })}
            </p>

            <BudgetTotalComparisonChart
              year={+year}
              month={+month}
              kind="income"
            />
          </li>

          <li className="px-4 py-1">
            <p className="mb-1 font-bold">
              {t("titles.comparisonExpense", { ns: "analytics" })}
            </p>

            <BudgetTotalComparisonChart
              year={+year}
              month={+month}
              kind="expense"
            />
          </li>
        </ExpanderRow>
      </ListBox>
    </NavigationPage>
  );
}
