import { addCategory } from "@/api/categories";
import { Button } from "@/components/ui/button";
import { CloseButton } from "@/components/ui/close-button";
import { Error } from "@/components/ui/error";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { categoriesIcons } from "@/data/categories-icons";
import { type CategoryDraft } from "@/types/categories";
import { t } from "i18next";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { IconPicker } from "./icon-picker";

const initialState = {
  name: "",
  icon: "helpCircle",
};

export function AddCategoryForm() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<CategoryDraft>({
    defaultValues: initialState,
  });

  const iconValue = watch("icon");
  const Icon = categoriesIcons[iconValue];

  async function onSubmit(data: CategoryDraft) {
    const result = await addCategory(data);

    if (!result.ok) {
      toast.error(t("errors.add", { ns: "categories" }));
      return;
    }

    toast.success(t("success.add", { ns: "categories" }));
    navigate("/categories");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        variant="form"
        name="name"
        register={register}
        rules={{ required: t("errors.required", { ns: "common" }) }}
      >
        {t("fields.name", { ns: "categories" })}
        {errors.name?.message && <Error> {errors.name.message} </Error>}
      </Input>

      <button
        className="grid h-12 w-full cursor-pointer grid-cols-3 rounded-lg px-3.5 py-3 hover:bg-[color-mix(in_srgb,var(--background),var(--text)_10%)]"
        type="button"
        onClick={() => setIsOpen(true)}
      >
        <span className="text-start">
          {t("fields.icon", { ns: "categories" })}
        </span>

        <div className="col-start-2 col-end-4 rounded-md bg-[color-mix(in_srgb,var(--background),var(--text)_15%)] px-2 py-1">
          <Icon />
        </div>
      </button>

      <Modal open={isOpen} onClose={() => setIsOpen(false)}>
        <div className="max-w-150 px-4 py-6">
          <h2 className="mb-3 text-2xl">
            {t("titles.selectIcon", { ns: "categories" })}
          </h2>

          <Controller
            name="icon"
            control={control}
            render={({ field }) => (
              <IconPicker value={field.value} onChange={field.onChange} />
            )}
          />

          <div className="mt-6">
            <CloseButton type="button" onClick={() => setIsOpen(false)}>
              Close
            </CloseButton>
          </div>
        </div>
      </Modal>

      <div className="mt-3 flex justify-center">
        <Button>{t("buttons.addCategory", { ns: "categories" })}</Button>
      </div>
    </form>
  );
}
