import { useAccounts } from "@/api/accounts";
import { useCategories } from "@/api/categories";
import { addTransaction } from "@/api/transactions";
import { ButtonRow } from "@/components/ui/button-row";
import { CurrencyEntry } from "@/components/ui/currency-entry";
import { Entry } from "@/components/ui/entry";
import { ListBox } from "@/components/ui/list-box";
import { Select } from "@/components/ui/select";
import { useAppStore } from "@/stores/use-app-store";
import type {
  DraftTransaction,
  DraftTransactionForm,
} from "@/types/transactions";
import dayjs from "dayjs";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

const initialTransaction: DraftTransaction = {
  name: "",
  amount: 1,
  date: dayjs().valueOf(),
  kind: "income",
  note: "",
  accountId: "",
  categoryId: "",
};

export function AddTransactionForm() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { t } = useTranslation("transactions");
  const currency = useAppStore((state) => state.currency);
  const locale = navigator.language;
  const categories = useCategories();
  const accounts = useAccounts();
  const date = dayjs(initialTransaction.date).format("YYYY-MM-DDTHH:mm");
  const kind = state?.kind ?? "income";
  const { control, setValue, handleSubmit } = useForm<DraftTransactionForm>({
    defaultValues: {
      ...initialTransaction,
      date,
      kind: kind,
    },
  });

  async function onSubmit(data: DraftTransactionForm) {
    const transaction = {
      ...data,
      date: dayjs(data.date).valueOf(),
    };

    const result = await addTransaction(transaction);

    if (!result.ok) {
      toast.error(t("errors.add"));
      return;
    }

    toast.success(t("success.add"));

    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
      return;
    }

    navigate(`/${data.kind}s`, { replace: true });
  }

  useEffect(() => {
    setValue("accountId", accounts[0]?.id);
  }, [setValue, accounts]);

  useEffect(() => {
    setValue("categoryId", categories[0]?.id);
  }, [setValue, categories]);

  return (
    <form className="space-y-2" onSubmit={handleSubmit(onSubmit)}>
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

      <ListBox>
        <ButtonRow variant="suggested">{t("buttons.addTransaction")}</ButtonRow>
      </ListBox>
    </form>
  );
}
