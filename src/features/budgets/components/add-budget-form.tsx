import { addBudget } from "@/api/budgets";
import { useAvailableCategories } from "@/api/categories";
import { ButtonRow } from "@/components/ui/button-row";
import { CurrencyEntry } from "@/components/ui/currency-entry";
import { Entry } from "@/components/ui/entry";
import { ListBox } from "@/components/ui/list-box";
import { Select } from "@/components/ui/select";
import { useAppStore } from "@/stores/use-app-store";
import type { BudgetDraft, BudgetDraftForm } from "@/types/budgets";
import dayjs from "dayjs";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const initialState: BudgetDraftForm = {
  year: dayjs().format("YYYY"),
  month: dayjs().format("MM"),
  categoryId: "",
  amount: 1,
  kind: "expense",
};

export function AddBudgetForm() {
  const { t } = useTranslation("budgets");
  const navigate = useNavigate();
  const currency = useAppStore((state) => state.currency);
  const locale = navigator.language;
  const { control, setValue, watch, handleSubmit } = useForm({
    defaultValues: initialState,
  });
  const year = watch("year");
  const month = watch("month");
  const kind = watch("kind");
  const categories = useAvailableCategories(+year, +month, kind);

  async function onSubmit(data: BudgetDraftForm) {
    const budget: BudgetDraft = {
      ...data,
      year: +data.year,
      month: +data.month,
    };

    const response = await addBudget(budget);

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

  useEffect(() => {
    setValue("categoryId", categories[0]?.id);
  }, [setValue, categories]);

  return (
    <form className="space-y-2" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex w-full flex-col gap-1">
        <Controller
          name="year"
          control={control}
          render={({ field }) => (
            <Entry
              title={t("fields.year")}
              {...field}
              required
              pattern="[0-9]{4}"
            />
          )}
        />

        <Controller
          name="month"
          control={control}
          render={({ field }) => (
            <Entry
              title={t("fields.month")}
              {...field}
              required
              pattern="[0-9]{2}"
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
                value ? onChange(Number(value)) : onChange("")
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
          name="kind"
          control={control}
          render={({ field }) => (
            <Select
              title={t("fields.kind")}
              options={[
                {
                  value: "expense",
                  label: t("kind.expense", { ns: "transactions" }),
                },
                {
                  value: "income",
                  label: t("kind.income", { ns: "transactions" }),
                },
              ]}
              {...field}
            />
          )}
        />
      </div>

      <ListBox>
        <ButtonRow variant="suggested">
          <span>{t("buttons.add")}</span>
        </ButtonRow>
      </ListBox>
    </form>
  );
}
