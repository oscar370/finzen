import { DateInput, Form, NumberInput, Select, Textarea, TextInput } from "#/components/ui/form";
import { TRANSACTION_TYPES } from "#/lib/constants";
import { translate } from "#/lib/utils";
import { m } from "#/paraglide/messages";
import { addTransaction } from "#/services/transactions";
import type { Category } from "#/types/categories";
import { vDraftTransaction } from "#/types/transactions";
import type { SubmitHandler } from "@formisch/react";
import { Field, reset, useForm } from "@formisch/react";
import { Plus } from "lucide-react";
import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";

type NewTransactionModalProps = {
  categories: Category[];
  type: "income" | "expense";
};

export function NewTransactionModal({ categories, type }: NewTransactionModalProps) {
  const [isPending, setIsPending] = useState(false);
  const modalRef = useRef<HTMLDialogElement | null>(null);

  const form = useForm({
    schema: vDraftTransaction,
    initialInput: {
      name: "",
      amount: 1,
      date: new Date(),
      kind: type,
      categoryId: 0,
      note: "",
    },
  });

  const submitForm: SubmitHandler<typeof vDraftTransaction> = async (values) => {
    try {
      setIsPending(true);
      await addTransaction(values);
      toast.success(m["successes.new_transaction"]());
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
      <div className="tooltip tooltip-left" data-tip={m["transactions.new"]()}>
        <button
          className="btn btn-ghost btn-sm btn-square"
          aria-label={m["transactions.new"]()}
          onClick={() => modalRef.current?.showModal()}
        >
          <Plus className="size-4" />
        </button>
      </div>

      {createPortal(
        <dialog className="modal duration-150" ref={modalRef}>
          <div className="modal-box duration-150">
            <h2 className="text-lg font-bold">{m["transactions.new"]()}</h2>

            <Form of={form} onSubmit={submitForm}>
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

              <Field of={form} path={["date"]}>
                {(field) => (
                  <DateInput
                    {...field.props}
                    label={m.date()}
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

              <Field of={form} path={["note"]}>
                {(field) => (
                  <Textarea
                    {...field.props}
                    label={m.note()}
                    value={field.input}
                    errors={field.errors}
                    onChange={field.onChange}
                  />
                )}
              </Field>

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
