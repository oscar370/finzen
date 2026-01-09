import { Select } from "@/components/ui/select";
import { t } from "i18next";
import type { FieldValues, Path, UseFormRegister } from "react-hook-form";

type SelectTransactionKindProps<T extends FieldValues> = {
  name: Path<T>;
  register: UseFormRegister<T>;
};

export function SelectTransactionKind<T extends FieldValues>({
  name,
  register,
}: SelectTransactionKindProps<T>) {
  return (
    <Select
      label={t("fields.kind", { ns: "transactions" })}
      name={name}
      register={register}
      variant="form"
    >
      <option value="income">{t("kind.income", { ns: "transactions" })}</option>
      <option value="expense">
        {t("kind.expense", { ns: "transactions" })}
      </option>
    </Select>
  );
}
