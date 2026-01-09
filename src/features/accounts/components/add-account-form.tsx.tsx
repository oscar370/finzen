import { addAccount } from "@/api/accounts";
import { Button } from "@/components/ui/button";
import { CurrencyInput } from "@/components/ui/currency-input";
import { Error } from "@/components/ui/error";
import { Input } from "@/components/ui/input";
import { useAppStore } from "@/stores/use-app-store";
import { type DraftAccount } from "@/types/accounts";
import { t } from "i18next";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { AccountsSelect } from "./accounts-select";

type AddAccountFormProps = {
  children: React.ReactNode;
  onSuccess: () => void;
};

const initialState: DraftAccount = {
  name: "",
  type: "cash",
  initialBalance: 0,
};

export function AddAccountForm({ children, onSuccess }: AddAccountFormProps) {
  const currency = useAppStore((state) => state.currency);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<DraftAccount>({
    defaultValues: initialState,
  });

  async function onSubmit(data: DraftAccount) {
    const response = await addAccount(data);

    if (!response.ok) {
      toast.error(t("errors.add", { ns: "accounts" }));
      return;
    }

    toast.success(t("success.add", { ns: "accounts" }));
    onSuccess();
  }

  return (
    <form
      className="flex w-full flex-col items-center gap-3"
      onSubmit={handleSubmit(onSubmit)}
    >
      {children}

      <div className="flex w-full flex-col gap-1">
        <Input
          name="name"
          variant="form"
          register={register}
          rules={{ required: t("errors.required", { ns: "common" }) }}
        >
          {t("fields.name.label", { ns: "accounts" })}
          {errors.name?.message && <Error> {errors.name.message} </Error>}
        </Input>

        <AccountsSelect name="type" register={register} />

        <CurrencyInput
          name="initialBalance"
          currency={currency}
          control={control}
          variant="form"
          rules={{
            required: t("errors.required", { ns: "common" }),
            min: 0,
          }}
        >
          {t("fields.balance.label", { ns: "accounts" })}
          {errors.initialBalance?.message && (
            <Error> {errors.initialBalance.message} </Error>
          )}
        </CurrencyInput>
      </div>

      <Button type="submit">{t("buttons.add", { ns: "accounts" })}</Button>
    </form>
  );
}
