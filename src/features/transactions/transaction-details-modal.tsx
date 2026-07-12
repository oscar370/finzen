import { DateInput, Form, NumberInput, Select, Textarea, TextInput } from "#/components/ui/form";
import { TRANSACTION_TYPES } from "#/lib/constants";
import { translate } from "#/lib/utils";
import { m } from "#/paraglide/messages";
import { updateTransaction } from "#/services/transactions";
import type { Category } from "#/types/categories";
import type { Transaction } from "#/types/transactions";
import { vTransaction } from "#/types/transactions";
import type { SubmitHandler } from "@formisch/react";
import { Field, reset, useForm } from "@formisch/react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";
import { DeleteTransactionModal } from "./delete-transaction-modal";

type TransactionDetailsModalProps = {
  transaction: Transaction | null;
  categories: Category[];
  onClose: () => void;
};

export function TransactionDetailsModal({
  transaction,
  categories,
  onClose,
}: TransactionDetailsModalProps) {
  const [isPending, setIsPending] = useState(false);
  const modalRef = useRef<HTMLDialogElement | null>(null);

  const form = useForm({
    schema: vTransaction,
  });

  useEffect(() => {
    if (transaction) {
      reset(form, { initialInput: transaction });
      modalRef.current?.showModal();
    } else {
      modalRef.current?.close();
      reset(form);
    }
  }, [transaction, form]);

  const submitForm: SubmitHandler<typeof vTransaction> = async (values) => {
    try {
      setIsPending(true);
      await updateTransaction(values);
      toast.success(m["successes.updated_transaction"]());
      modalRef.current?.close();
      reset(form);
    } catch (error) {
      toast.error(m["errors.unexpected"]());
      console.error(error);
    } finally {
      setIsPending(false);
    }
  };

  function handleDelete() {
    modalRef.current?.close();
    reset(form);
  }

  return createPortal(
    <dialog className="modal duration-150" ref={modalRef} onClose={onClose}>
      <div className="modal-box duration-150">
        <div className="flex justify-between">
          <h2 className="text-lg font-bold">{m["transactions.details"]()}</h2>

          <DeleteTransactionModal transaction={transaction} onDelete={handleDelete} />
        </div>

        <Form of={form} onSubmit={submitForm}>
          <div className="fieldset">
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
              {isPending ? <span className="loading loading-spinner loading-md"></span> : m.save()}
            </button>
          </div>
        </Form>
      </div>

      <form className="modal-backdrop" method="dialog">
        <button>{m.close_modal()}</button>
      </form>
    </dialog>,
    document.body,
  );
}
