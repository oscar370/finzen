import { addAccount } from "@/api/accounts";
import { ButtonRow } from "@/components/ui/button-row";
import { CurrencyEntry } from "@/components/ui/currency-entry";
import { Entry } from "@/components/ui/entry";
import { ListBox } from "@/components/ui/list-box";
import { Select } from "@/components/ui/select";
import { useAppStore } from "@/stores/use-app-store";
import type { DraftAccount } from "@/types/accounts";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

const initialState: DraftAccount = {
  name: "",
  type: "cash",
  initialBalance: 0,
};

type AddAccountFormProps = {
  onSuccess: () => void;
};

export function AddAccountForm({ onSuccess }: AddAccountFormProps) {
  const { control, handleSubmit } = useForm({ defaultValues: initialState });
  const { t } = useTranslation("accounts");
  const currency = useAppStore((state) => state.currency);
  const locale = navigator.language;

  const accountsTypes = [
    { value: "cash", label: t("types.cash") },
    { value: "debit", label: t("types.debit") },
    { value: "credit", label: t("types.credit") },
    { value: "investment", label: t("types.investment") },
  ];

  async function onSubmit(data: DraftAccount) {
    const response = await addAccount(data);

    if (!response.ok) {
      toast.error(t("errors.add"));
      return;
    }

    toast.success(t("success.add"));
    onSuccess();
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
                value ? onChange(Number(value)) : onChange(0)
              }
            />
          )}
        />
      </div>

      <ListBox>
        <ButtonRow variant="suggested">{t("buttons.add")}</ButtonRow>
      </ListBox>
    </form>
  );
}
