import { MonthInput } from "@/components/form/month-input";
import { NumberInput } from "@/components/form/number-input";
import { Select } from "@/components/form/select";
import { Switch } from "@/components/form/switch";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { notifyError } from "@/lib/errors/notify-error";
import { translate } from "@/lib/i18n/translate";
import { m } from "@/paraglide/messages";
import { addBudget } from "@/services/budgets/add-budget";
import { updateBudget } from "@/services/budgets/update-budget";
import type { Budget } from "@/types/budgets/budget";
import { vBudgetDraft, type BudgetDraft } from "@/types/budgets/budget-draft";
import type { Category } from "@/types/categories/category";
import { Field, Form, useForm } from "@formisch/react";
import { useTransition } from "react";

type BudgetFormProps = {
  categories: Category[];
  yearMonth: string;
  budget?: Budget | null;
  onDone: () => void;
};

function toDraft(budget: Budget): BudgetDraft {
  return {
    amount: budget.amount,
    yearMonth: budget.yearMonth,
    kind: budget.kind,
    categoryId: budget.categoryId,
    repeat: budget.repeat,
    relatedBudget: budget.relatedBudget,
  };
}

export function BudgetForm({
  categories,
  yearMonth,
  budget,
  onDone,
}: BudgetFormProps) {
  const [isPending, startTransition] = useTransition();
  const form = useForm({
    schema: vBudgetDraft,
    initialInput: budget
      ? toDraft(budget)
      : {
          amount: 1,
          yearMonth,
          kind: "expense",
          categoryId: categories[0]?.id ?? 0,
          repeat: false,
        },
  });

  function handleSubmit(values: BudgetDraft) {
    startTransition(async () => {
      try {
        if (budget) {
          await updateBudget(budget.id, values);
          toast.add({
            description: m.successes_updated_budget(),
            type: "success",
          });
        } else {
          await addBudget(values);
          toast.add({ description: m.successes_new_budget(), type: "success" });
        }

        onDone();
      } catch (error) {
        notifyError(error);
      }
    });
  }

  return (
    <Form of={form} onSubmit={handleSubmit} className="space-y-4">
      <Field of={form} path={["yearMonth"]}>
        {(field) => (
          <MonthInput
            {...field.props}
            label={m.year_month()}
            value={field.input}
            errors={field.errors}
            onChange={field.onChange}
          />
        )}
      </Field>

      <Field of={form} path={["amount"]}>
        {(field) => (
          <NumberInput
            {...field.props}
            label={m.amount()}
            value={field.input}
            errors={field.errors}
            onChange={field.onChange}
          />
        )}
      </Field>

      <Field of={form} path={["kind"]}>
        {(field) => (
          <Select
            {...field.props}
            label={m.kind()}
            value={field.input}
            errors={field.errors}
            onChange={field.onChange}
            items={[
              { label: m.income(), value: "income" },
              { label: m.expense(), value: "expense" },
            ]}
          />
        )}
      </Field>

      <Field of={form} path={["categoryId"]}>
        {(field) => (
          <Select
            {...field.props}
            label={m.category()}
            value={field.input}
            errors={field.errors}
            onChange={field.onChange}
            items={categories.map((category) => ({
              label: translate(category.name),
              value: category.id,
            }))}
          />
        )}
      </Field>

      <Field of={form} path={["repeat"]}>
        {(field) => (
          <Switch
            {...field.props}
            label={m.repeat()}
            value={field.input}
            errors={field.errors}
            onChange={field.onChange}
          />
        )}
      </Field>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? <Spinner /> : m.save()}
      </Button>
    </Form>
  );
}
