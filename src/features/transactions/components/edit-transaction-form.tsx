import { useAccounts } from "@/api/accounts";
import { useCategories } from "@/api/categories";
import { updateTransaction } from "@/api/transactions";
import { ButtonRow } from "@/components/ui/button-row";
import { CurrencyEntry } from "@/components/ui/currency-entry";
import { Entry } from "@/components/ui/entry";
import { ListBox } from "@/components/ui/list-box";
import { Select } from "@/components/ui/select";
import { useAppStore } from "@/stores/use-app-store";
import type { Transaction, TransactionForm } from "@/types/transactions";
import dayjs from "dayjs";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

type EditTransactionFormProps = {
  transaction: Transaction;
};

export function EditTransactionForm({ transaction }: EditTransactionFormProps) {
  const navigate = useNavigate();
  const { t } = useTranslation("transactions");
  const currency = useAppStore((state) => state.currency);
  const locale = navigator.language;
  const categories = useCategories();
  const accounts = useAccounts();
  const date = dayjs(transaction.date).format("YYYY-MM-DDTHH:mm");
  const { control, setValue, handleSubmit } = useForm<TransactionForm>({
    defaultValues: {
      ...transaction,
      date,
    },
  });

  async function onSubmit(data: TransactionForm) {
    const transaction: Transaction = {
      ...data,
      date: dayjs(data.date).valueOf(),
      amount: +data.amount,
    };

    const result = await updateTransaction(transaction);

    if (!result.ok) {
      toast.error(t("errors.edit"));
      return;
    }

    toast.success(t("success.edit"));

    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
      return;
    }

    navigate(`${data.kind}s`, { replace: true });
  }

  useEffect(() => {
    setValue("accountId", accounts[0]?.id);
  }, [setValue, accounts]);

  useEffect(() => {
    setValue("categoryId", categories[0]?.id);
  }, [setValue, categories]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex w-full flex-col gap-1">
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <Entry title={t("fields.name")} required {...field} />
          )}
        />

        <Controller
          name="kind"
          control={control}
          render={({ field }) => (
            <Select
              title={t("fields.kind")}
              options={[
                { value: "expense", label: t("kind.expense") },
                { value: "income", label: t("kind.income") },
              ]}
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
              name={name}
              value={value}
              decimalsLimit={2}
              required
              allowNegativeValue={false}
              intlConfig={{ locale, currency }}
              onValueChange={(value) =>
                value ? onChange(value) : onChange("")
              }
            />
          )}
        />

        <Controller
          name="categoryId"
          control={control}
          render={({ field }) => (
            <Select
              title={t("fields.category")}
              options={categories.map((category) => ({
                value: category.id,
                label: t(category.name, { ns: "categories" }),
              }))}
              {...field}
            />
          )}
        />

        <Controller
          name="accountId"
          control={control}
          render={({ field }) => (
            <Select
              title={t("fields.account")}
              options={accounts.map((account) => ({
                value: account.id,
                label: t(account.name),
              }))}
              {...field}
            />
          )}
        />

        <Controller
          name="date"
          control={control}
          render={({ field }) => (
            <Entry
              title={t("fields.date")}
              type="datetime-local"
              required
              {...field}
            />
          )}
        />

        <Controller
          name="note"
          control={control}
          render={({ field }) => <Entry title={t("fields.note")} {...field} />}
        />
      </div>

      <ListBox>
        <ButtonRow variant="suggested">
          {t("buttons.saveChanges", { ns: "common" })}
        </ButtonRow>
      </ListBox>
    </form>
  );
}
