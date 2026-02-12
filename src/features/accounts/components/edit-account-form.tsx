import { updateAccount } from "@/api/accounts";
import { Button } from "@/components/ui/button";
import { CurrencyEntry } from "@/components/ui/currency-entry";
import { Entry } from "@/components/ui/entry";
import { Select } from "@/components/ui/select";
import { useAppStore } from "@/stores/use-app-store";
import type { Account } from "@/types/accounts";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

type EditAccountFormProps = {
  account: Account;
};

export function EditAccountForm({ account }: EditAccountFormProps) {
  const { control, handleSubmit } = useForm({ defaultValues: account });
  const { t } = useTranslation("accounts");
  const currency = useAppStore((state) => state.currency);
  const navigate = useNavigate();
  const locale = navigator.language;

  const accountsTypes = [
    { value: "cash", label: t("types.cash") },
    { value: "debit", label: t("types.debit") },
    { value: "credit", label: t("types.credit") },
    { value: "investment", label: t("types.investment") },
  ];

  async function onSubmit(data: Account) {
    const safeData: Account = {
      ...data,
      initialBalance: +data.initialBalance,
    };
    const response = await updateAccount(safeData);

    if (!response.ok) {
      toast.error(t("errors.edit"));
      return;
    }

    toast.success(t("success.edit"));

    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
      return;
    }

    navigate("..", { replace: true });
  }

  return (
    <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex w-full flex-col gap-1">
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <Entry title={t("fields.name.label")} {...field} required />
          )}
        />

        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <Select
              title={t("fields.type.label")}
              options={accountsTypes}
              {...field}
            />
          )}
        />

        <Controller
          name="initialBalance"
          control={control}
          render={({ field: { onChange, name, value } }) => (
            <CurrencyEntry
              title={t("fields.initialBalance.label")}
              required
              name={name}
              value={value}
              decimalsLimit={2}
              intlConfig={{ locale, currency }}
              allowNegativeValue={false}
              onValueChange={(value) =>
                value ? onChange(value) : onChange("")
              }
            />
          )}
        />
      </div>

      <Button className="mt-4 w-full bg-(--accent)!" variant="pill">
        {t("buttons.add")}
      </Button>
    </form>
  );
}
