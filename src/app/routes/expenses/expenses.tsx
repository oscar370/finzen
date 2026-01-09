import { useExpenses } from "@/api/transactions";
import { AddButton } from "@/components/ui/add-button";
import { Group } from "@/components/ui/group";
import { TitleBar } from "@/components/ui/title-bar";
import { TransactionsList } from "@/features/transactions";
import dayjs from "dayjs";
import { t } from "i18next";
import { useNavigate } from "react-router-dom";

export function Expenses() {
  const firstDate = dayjs().startOf("month").valueOf();
  const lastDate = dayjs().endOf("month").valueOf();
  const expenses = useExpenses(firstDate, lastDate, 0, 20);
  const navigate = useNavigate();

  return (
    <>
      <TitleBar title={t("sections.expenses", { ns: "common" })} />

      <main className="mx-auto max-w-150 px-1 py-3">
        <Group>
          <AddButton onClick={() => navigate("/transactions/new")}>
            {t("buttons.addTransaction", { ns: "transactions" })}
          </AddButton>
          <TransactionsList data={expenses} />
        </Group>
      </main>
    </>
  );
}
