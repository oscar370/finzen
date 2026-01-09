import { addTransaction } from "@/api/transactions";
import { Button } from "@/components/ui/button";
import { CurrencyInput } from "@/components/ui/currency-input";
import { Error } from "@/components/ui/error";
import { Input } from "@/components/ui/input";
import { TextArea } from "@/components/ui/text-area";
import { useAppStore } from "@/stores/use-app-store";
import {
  type DraftTransaction,
  type DraftTransactionForm,
} from "@/types/transactions";
import dayjs from "dayjs";
import { t } from "i18next";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { SelectTransactionAccount } from "./select-transaction-account";
import { SelectTransactionCategory } from "./select-transaction-category";
import { SelectTransactionKind } from "./select-transaction-kind";

const initialTransaction: DraftTransaction = {
  name: "",
  amount: 0,
  date: Date.now(),
  kind: "income",
  note: "",
  accountId: "",
  categoryId: "",
};

export function AddTransaction() {
  const navigate = useNavigate();
  const currency = useAppStore((state) => state.currency);
  const date = dayjs(initialTransaction.date).format("YYYY-MM-DD");
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<DraftTransactionForm>({
    defaultValues: {
      ...initialTransaction,
      date,
    },
  });

  async function onSubmit(data: DraftTransactionForm) {
    const transaction = {
      ...data,
      date: dayjs(data.date).valueOf(),
    };

    const result = await addTransaction(transaction);

    if (!result.ok) {
      toast.error(t("errors.add", { ns: "transactions" }));
    }

    toast.success(t("success.add", { ns: "transactions" }));

    if (data.kind === "expense") {
      navigate("/expenses");
    } else {
      navigate("/incomes");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        name="name"
        variant="form"
        register={register}
        rules={{ required: t("errors.required", { ns: "common" }) }}
      >
        {t("fields.name", { ns: "transactions" })}
        {errors.name?.message && <Error> {errors.name.message} </Error>}
      </Input>

      <SelectTransactionKind name="kind" register={register} />

      <CurrencyInput
        name="amount"
        currency={currency}
        variant="form"
        control={control}
        rules={{
          required: t("errors.required", { ns: "common" }),
          min: {
            value: 1,
            message: t("errors.required", { ns: "common" }),
          },
        }}
      >
        {t("fields.amount", { ns: "transactions" })}
        {errors.amount?.message && <Error> {errors.amount.message} </Error>}
      </CurrencyInput>

      <SelectTransactionCategory
        name="categoryId"
        register={register}
        rules={{ required: t("errors.required", { ns: "common" }) }}
        errors={errors}
      />

      <SelectTransactionAccount
        name="accountId"
        register={register}
        rules={{ required: t("errors.required", { ns: "common" }) }}
        errors={errors}
      />

      <Input
        type="date"
        name="date"
        variant="form"
        register={register}
        rules={{ required: t("errors.required", { ns: "common" }) }}
      >
        {t("fields.date", { ns: "transactions" })}
        {errors.date?.message && <Error> {errors.date.message} </Error>}
      </Input>

      <TextArea name="note" variant="form" register={register}>
        {t("fields.note", { ns: "transactions" })}
      </TextArea>

      <div className="mt-3 flex items-center justify-center">
        <Button> {t("buttons.addTransaction", { ns: "transactions" })} </Button>
      </div>
    </form>
  );
}
