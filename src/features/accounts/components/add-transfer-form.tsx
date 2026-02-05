import { useAccounts } from "@/api/accounts";
import { addTransfer } from "@/api/transactions";
import { ButtonRow } from "@/components/ui/button-row";
import { CurrencyEntry } from "@/components/ui/currency-entry";
import { Entry } from "@/components/ui/entry";
import { ListBox } from "@/components/ui/list-box";
import { Select } from "@/components/ui/select";
import { useAppStore } from "@/stores/use-app-store";
import type { Account } from "@/types/accounts";
import {
  type Transfer,
  type TransferForm as TransferFormT,
} from "@/types/transactions";
import dayjs from "dayjs";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

type TransferFormProps = {
  account: Account;
  onSuccess: () => void;
};

export function AddTransferForm({ account, onSuccess }: TransferFormProps) {
  const { t } = useTranslation("transactions");
  const accounts = useAccounts();
  const currency = useAppStore((state) => state.currency);
  const locale = navigator.language;
  const initialTransfer: TransferFormT = {
    fromAccountId: account.id,
    toAccountId: "",
    amount: 1,
    date: dayjs().format("YYYY-MM-DD"),
    note: "",
  };
  const { control, setValue, handleSubmit } = useForm<TransferFormT>({
    defaultValues: initialTransfer,
  });

  async function onSubmit(data: TransferFormT) {
    const transfer: Transfer = {
      ...data,
      date: dayjs(data.date).valueOf(),
    };
    const result = await addTransfer(transfer);

    if (!result.ok) {
      toast.error(t("errors.add"));
      return;
    }

    toast.success(t("success.add"));
    onSuccess();
  }

  useEffect(() => {
    setValue("toAccountId", accounts[0]?.id);
  }, [setValue, accounts]);

  if (accounts)
    return (
      <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="toAccountId"
          control={control}
          render={({ field }) => (
            <Select
              title={t("fields.toAccount")}
              options={accounts.map((account) => ({
                value: account.id,
                label: t(account.name),
              }))}
              {...field}
            />
          )}
        />

        <Controller
          name="amount"
          control={control}
          render={({ field: { onChange, name, value } }) => (
            <CurrencyEntry
              title={t("fields.amount")}
              required
              name={name}
              value={value}
              decimalsLimit={2}
              min={1}
              intlConfig={{ locale, currency }}
              allowNegativeValue={false}
              onValueChange={(value) =>
                value
                  ? +value > 1
                    ? onChange(Number(value))
                    : onChange(1)
                  : onChange(1)
              }
            />
          )}
        />

        <Controller
          name="date"
          control={control}
          render={({ field }) => (
            <Entry title={t("fields.date")} type="date" required {...field} />
          )}
        />

        <Controller
          name="note"
          control={control}
          render={({ field }) => <Entry title={t("fields.note")} {...field} />}
        />

        <ListBox>
          <ButtonRow variant="suggested">
            {t("buttons.addTransaction")}
          </ButtonRow>
        </ListBox>
      </form>
    );
}
