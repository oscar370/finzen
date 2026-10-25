import { FormField } from "@/components/form/form-field";
import { TextInput } from "@/components/form/text-input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { notifyError } from "@/lib/errors/notify-error";
import { m } from "@/paraglide/messages";
import { addCategory } from "@/services/categories/add-category";
import { updateCategory } from "@/services/categories/update-category";
import type { Category } from "@/types/categories/category";
import {
  vCategoryDraft,
  type CategoryDraft,
} from "@/types/categories/category-draft";
import { Field, Form, useForm } from "@formisch/react";
import { useTransition } from "react";
import { IconSelector } from "./icon-selector";

type CategoryFormProps = {
  category?: Category | null;
  onDone: () => void;
};

function toDraft(category: Category): CategoryDraft {
  return { name: category.name, icon: category.icon };
}

export function CategoryForm({ category, onDone }: CategoryFormProps) {
  const [isPending, startTransition] = useTransition();
  const form = useForm({
    schema: vCategoryDraft,
    initialInput: category ? toDraft(category) : { name: "", icon: "home" },
  });

  function handleSubmit(values: CategoryDraft) {
    startTransition(async () => {
      try {
        if (category) {
          await updateCategory(category.id, values);
          toast.add({
            description: m.successes_updated_category(),
            type: "success",
          });
        } else {
          await addCategory(values);
          toast.add({
            description: m.successes_new_category(),
            type: "success",
          });
        }

        onDone();
      } catch (error) {
        notifyError(error);
      }
    });
  }

  return (
    <Form of={form} onSubmit={handleSubmit} className="space-y-4">
      <Field of={form} path={["name"]}>
        {(field) => (
          <TextInput
            {...field.props}
            label={m.name()}
            value={field.input}
            errors={field.errors}
            onChange={field.onChange}
          />
        )}
      </Field>

      <Field of={form} path={["icon"]}>
        {(field) => (
          <FormField label={m.icon()} errors={field.errors}>
            {(control) => (
              <IconSelector
                id={control.id}
                aria-invalid={control.invalid}
                value={field.input}
                onChange={field.onChange}
              />
            )}
          </FormField>
        )}
      </Field>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? <Spinner /> : m.save()}
      </Button>
    </Form>
  );
}
