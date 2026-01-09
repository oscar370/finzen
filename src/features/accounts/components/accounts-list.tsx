import { useAccounts } from "@/api/accounts";
import { AddButton } from "@/components/ui/add-button";
import { CurrencyNavigation } from "@/components/ui/currency-navigation";
import { Group } from "@/components/ui/group";
import { t } from "i18next";

export function AccountsList() {
  const accounts = useAccounts();

  if (accounts)
    return (
      <Group>
        <AddButton>{t("buttons.add", { ns: "accounts" })}</AddButton>
        {accounts.map(({ id, name, balance }) => (
          <CurrencyNavigation
            key={id}
            to={`/accounts/${id}`}
            balance={balance}
            variant="account"
          >
            {name}
          </CurrencyNavigation>
        ))}
      </Group>
    );
}
