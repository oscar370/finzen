import { NumberInput, Select, TextInput } from "#/components/ui/form";
import { QUERY_PARAMS, TRANSACTION_TYPES } from "#/lib/constants";
import { translate } from "#/lib/utils";
import { m } from "#/paraglide/messages";
import { addBudget } from "#/services/budgets";
import { vDraftBudget } from "#/types/budgets";
import type { Category } from "#/types/categories";
import type { SubmitHandler } from "@formisch/react";
import { Field, Form, reset, useForm } from "@formisch/react";
import { Plus } from "lucide-react";
import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";

type NewBudgetModal = {
  categories: Category[];
};

export function NewBudgetModal({ categories }: NewBudgetModal) {
  const modalRef = useRef<HTMLDialogElement | null>(null);
  const [isPending, setIsPending] = useState(false);

  const form = useForm({
    schema: vDraftBudget,
    initialInput: {
      amount: 1,
      yearMonth: QUERY_PARAMS.yearMonth,
      kind: "expense",
      categoryId: 0,
    },
  });

  const submitForm: SubmitHandler<typeof vDraftBudget> = async (values) => {
    try {
      setIsPending(true);
      await addBudget(values);
      toast.success(m["successes.new_budget"]());
      modalRef.current?.close();
      reset(form);
    } catch (error) {
      toast.error(m["errors.unexpected"]());
      console.error(error);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <>
      <div className="tooltip tooltip-left" data-tip={m["budgets.new"]()}>
        <button
          className="btn btn-square btn-sm btn-ghost"
          aria-label={m["budgets.new"]()}
          onClick={() => modalRef.current?.showModal()}
        >
          <Plus className="size-4" />
        </button>
      </div>

      {createPortal(
        <dialog className="modal duration-150" ref={modalRef}>
          <div className="modal-box duration-150">
            <h2 className="text-lg font-bold">{m["budgets.new"]()}</h2>

            <Form className="space-y-2" of={form} onSubmit={submitForm}>
              <div className="fieldset">
                <Field of={form} path={["yearMonth"]}>
                  {(field) => (
                    <TextInput
                      {...field.props}
                      label={m.date()}
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
                    >
                      {TRANSACTION_TYPES.map((transactionType) => (
                        <option key={transactionType.value} value={transactionType.value}>
                          {transactionType.label()}
                        </option>
                      ))}
                    </Select>
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
                    >
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {translate(category.name)}
                        </option>
                      ))}
                    </Select>
                  )}
                </Field>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  className="btn"
                  disabled={isPending}
                  type="button"
                  onClick={() => modalRef.current?.close()}
                >
                  {m.cancel()}
                </button>
                <button className="btn btn-primary" disabled={isPending} type="submit">
                  {isPending ? (
                    <span className="loading loading-spinner loading-md"></span>
                  ) : (
                    m.save()
                  )}
                </button>
              </div>
            </Form>
          </div>

          <form className="modal-backdrop" method="dialog">
            <button>{m.close_modal()}</button>
          </form>
        </dialog>,
        document.body,
      )}
    </>
  );
}
