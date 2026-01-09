import { AddButton } from "@/components/ui/add-button";
import { Group } from "@/components/ui/group";
import { TitleBar } from "@/components/ui/title-bar";
import { AnnualOverview, MonthlyOverview } from "@/features/analytics";
import { t } from "i18next";
import { useNavigate } from "react-router-dom";

export function Home() {
  const navigate = useNavigate();

  return (
    <>
      <TitleBar title="Home" />

      <main className="mx-auto w-full max-w-150 space-y-3 px-1 py-3">
        <Group>
          <AddButton onClick={() => navigate("/transactions/new")}>
            {t("buttons.addTransaction", { ns: "transactions" })}
          </AddButton>
        </Group>

        <MonthlyOverview />
        <AnnualOverview />
      </main>
    </>
  );
}
