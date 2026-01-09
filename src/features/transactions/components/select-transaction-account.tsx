import { useAccounts } from "@/api/accounts";
import { Select } from "@/components/ui/select";
import { t } from "i18next";
import type {
  FieldErrors,
  FieldValues,
  Path,
  RegisterOptions,
  UseFormRegister,
} from "react-hook-form";

type SelectTransactionAccountProps<T extends FieldValues> = {
  name: Path<T>;
  register: UseFormRegister<T>;
  rules?: RegisterOptions<T, Path<T>>;
  errors?: FieldErrors<T>;
};

export function SelectTransactionAccount<T extends FieldValues>({
  name,
  register,
  rules,
  errors,
}: SelectTransactionAccountProps<T>) {
  const accounts = useAccounts();

  if (accounts.length)
    return (
      <Select
        label={t("fields.account", { ns: "transactions" })}
        name={name}
        register={register}
        rules={rules}
        errors={errors}
        variant="form"
      >
        {accounts.map(({ id, name }) => (
          <option key={id} value={id}>
            {name}
          </option>
        ))}
      </Select>
    );
}
