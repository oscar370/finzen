import { Button } from "@/components/ui/button";
import { updateCurrency, useAppStore } from "@/stores/use-app-store";
import { t } from "i18next";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { CurrencySelect } from "./currency-select";

export function CurrencyForm() {
  const currency = useAppStore((state) => state.currency);
  const { register, handleSubmit } = useForm({ defaultValues: { currency } });

  function onSubmit(data: { currency: string }) {
    toast.success(t("success.add", { ns: "currency" }));
    updateCurrency(data.currency);
  }

  return (
    <form
      className="flex w-full flex-col items-center gap-3"
      onSubmit={handleSubmit(onSubmit)}
    >
      <h2 className="text-center text-xl font-bold">
        {t("welcome.title", { ns: "currency" })}
      </h2>

      <CurrencySelect name="currency" register={register} />

      <Button type="submit">{t("welcome.button", { ns: "currency" })}</Button>
    </form>
  );
}
