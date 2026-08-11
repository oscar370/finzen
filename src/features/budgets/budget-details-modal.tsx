import { NumberInput, Select, TextInput } from "#/components/ui/form";
import { TRANSACTION_TYPES } from "#/lib/constants";
import { translate } from "#/lib/utils";
import { m } from "#/paraglide/messages";
import { updateBudget } from "#/services/budgets";
import type { Budget } from "#/types/budgets";
import { vBudget } from "#/types/budgets";
import type { Category } from "#/types/categories";
import type { SubmitHandler } from "@formisch/react";
import { Field, Form, reset, useForm } from "@formisch/react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";
import { DeleteBudgetModal } from "./delete-budget-modal";

type BudgetDetailsModal = {
  budget: Budget | null;
  categories: Category[];
  onClose: () => void;
};

export function BudgetDetailsModal({ budget, categories, onClose }: BudgetDetailsModal) {
  const modalRef = useRef<HTMLDialogElement | null>(null);
  const [isPending, setIsPending] = useState(false);

  const form = useForm({
    schema: vBudget,
  });

  useEffect(() => {
    if (budget) {
      reset(form, { initialInput: budget });
      modalRef.current?.showModal();
    } else {
      reset(form);
      modalRef.current?.close();
    }
  }, [budget, form]);

  const submitForm: SubmitHandler<typeof vBudget> = async (values) => {
    try {
      setIsPending(true);
      await updateBudget(values);
      toast.success(m["successes.updated_budget"]());
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
      {createPortal(
        <dialog className="modal duration-150" onClose={onClose} ref={modalRef}>
          <div className="modal-box duration-150">
            <div className="flex justify-between">
              <h2 className="text-lg font-bold">{m["budgets.details"]()}</h2>

              <DeleteBudgetModal budgetId={budget?.id} onDelete={() => modalRef.current?.close()} />
            </div>

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
                      type="month"
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
