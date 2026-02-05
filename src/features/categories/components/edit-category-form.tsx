import { updateCategory } from "@/api/categories";
import { ButtonRow } from "@/components/ui/button-row";
import { Entry } from "@/components/ui/entry";
import { ListBox } from "@/components/ui/list-box";
import { Select } from "@/components/ui/select";
import { categoriesIcons } from "@/data/categories-icons";
import type { Category } from "@/types/categories";
import { Plus } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

type EditCategoryFormProps = {
  category: Category;
};

export function EditCategoryForm({ category }: EditCategoryFormProps) {
  const { control, handleSubmit } = useForm({
    defaultValues: category,
  });
  const { t } = useTranslation("categories");
  const navigate = useNavigate();
  const icons = Object.keys(categoriesIcons);
  const iconsOptions = icons.map((icon) => {
    const Icon = categoriesIcons[icon];
    return {
      value: icon,
      label: <Icon aria-hidden="false" aria-label={icon} />,
    };
  });

  async function onSubmit(data: Category) {
    const response = await updateCategory(data);

    if (!response.ok) {
      toast.error(t("errors.add"));
      return;
    }

    toast.success(t("success.add"));

    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
      return;
    }

    navigate("..", { replace: true });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex w-full flex-col gap-1">
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <Entry title={t("fields.name")} {...field} required />
          )}
        />

        <Controller
          name="icon"
          control={control}
          render={({ field }) => (
            <Select
              title={t("fields.icon")}
              options={iconsOptions}
              {...field}
            />
          )}
        />

        <Controller
          name="color"
          control={control}
          render={({ field }) => (
            <Entry title={t("fields.color")} type="color" {...field} required />
          )}
        />
      </div>
      <ListBox>
        <ButtonRow variant="suggested">
          <Plus />
          <span>{t("buttons.addCategory")}</span>
        </ButtonRow>
      </ListBox>
    </form>
  );
}
