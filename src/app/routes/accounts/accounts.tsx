import { TitleBar } from "@/components/ui/title-bar";
import { AccountsList } from "@/features/accounts";
import { t } from "i18next";

export function Accounts() {
  return (
    <>
      <TitleBar title={t("sections.accounts", { ns: "common" })} />

      <main className="mx-auto max-w-150 px-1 py-3">
        <AccountsList />
      </main>
    </>
  );
}
