import { DateInput } from "@/components/form/date-input";
import { NumberInput } from "@/components/form/number-input";
import { Select } from "@/components/form/select";
import { Textarea } from "@/components/form/textarea";
import { TextInput } from "@/components/form/text-input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { notifyError } from "@/lib/errors/notify-error";
import { translate } from "@/lib/i18n/translate";
import { m } from "@/paraglide/messages";
import { addTransaction } from "@/services/transactions/add-transaction";
import { updateTransaction } from "@/services/transactions/update-transaction";
import type { Category } from "@/types/categories/category";
import type { Transaction } from "@/types/transactions/transaction";
import {
  vTransactionDraft,
  type TransactionDraft,
} from "@/types/transactions/transaction-draft";
import { Field, Form, useForm } from "@formisch/react";
import { useTransition } from "react";

type TransactionFormProps = {
  categories: Category[];
  type: "income" | "expense";
  transaction?: Transaction | null;
  onDone: () => void;
};

function toDraft(transaction: Transaction): TransactionDraft {
  return {
    name: transaction.name,
    amount: transaction.amount,
    date: transaction.date,
    kind: transaction.kind,
    categoryId: transaction.categoryId,
    note: transaction.note,
  };
}

export function TransactionForm({
  categories,
  type,
  transaction,
  onDone,
}: TransactionFormProps) {
  const [isPending, startTransition] = useTransition();
  const form = useForm({
    schema: vTransactionDraft,
    initialInput: transaction
      ? toDraft(transaction)
      : {
          name: "",
          amount: 1,
          date: new Date(),
          kind: type,
          categoryId: categories[0]?.id ?? 0,
          note: "",
        },
  });

  function handleSubmit(values: TransactionDraft) {
    startTransition(async () => {
      try {
        if (transaction) {
          await updateTransaction(transaction.id, values);
          toast.add({
            description: m.successes_updated_transaction(),
            type: "success",
          });
        } else {
          await addTransaction(values);
          toast.add({
            description: m.successes_new_transaction(),
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

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? <Spinner /> : m.save()}
      </Button>
    </Form>
  );
}
