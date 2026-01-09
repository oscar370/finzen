import { useCategories } from "@/api/categories";
import { Select } from "@/components/ui/select";
import { t } from "i18next";
import type {
  FieldErrors,
  FieldValues,
  Path,
  RegisterOptions,
  UseFormRegister,
} from "react-hook-form";

type SelectTransactionCategoryProps<T extends FieldValues> = {
  name: Path<T>;
  register: UseFormRegister<T>;
  rules?: RegisterOptions<T, Path<T>>;
  errors?: FieldErrors<T>;
};

export function SelectTransactionCategory<T extends FieldValues>({
  name,
  register,
  rules,
  errors,
}: SelectTransactionCategoryProps<T>) {
  const categories = useCategories();

  if (categories.length)
    return (
      <Select
        label={t("fields.category", { ns: "transactions" })}
        name={name}
        register={register}
        rules={rules}
        errors={errors}
        variant="form"
      >
        {categories.map(({ id, name }) => (
          <option key={id} value={id} hidden={id === "system"}>
            {t(name, { ns: "categories" })}
          </option>
        ))}
      </Select>
    );
}
