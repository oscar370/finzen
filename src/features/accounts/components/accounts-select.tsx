import { Select } from "@/components/ui/select";
import { t } from "i18next";
import type { FieldValues, Path, UseFormRegister } from "react-hook-form";
import { accountsTypes } from "../data/account-types";

type AccountsSelectProps<T extends FieldValues> = {
  name: Path<T>;
  register: UseFormRegister<T>;
};

export function AccountsSelect<T extends FieldValues>({
  name,
  register,
}: AccountsSelectProps<T>) {
  return (
    <Select
      label={t("fields.type.label", { ns: "accounts" })}
      variant="form"
      name={name}
      register={register}
    >
      {accountsTypes.map(({ type, label }) => (
        <option key={type} value={type}>
          {t(label, { ns: "accounts" })}
        </option>
      ))}
    </Select>
  );
}
