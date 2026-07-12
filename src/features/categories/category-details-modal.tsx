import { TextInput } from "#/components/ui/form";
import { m } from "#/paraglide/messages";
import { updateCategory } from "#/services/categories";
import type { Category } from "#/types/categories";
import { vCategory } from "#/types/categories";
import type { SubmitHandler } from "@formisch/react";
import { Field, Form, reset, useForm } from "@formisch/react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";
import { DeleteCategoryModal } from "./delete-category-modal";
import { IconSelector } from "./icon-selector";

type CategoryDetailsModalProps = {
  category: Category | null;
  onClose: () => void;
};

export function CategoryDetailsModal({ category, onClose }: CategoryDetailsModalProps) {
  const [isPending, setIsPending] = useState(false);
  const modalRef = useRef<HTMLDialogElement | null>(null);

  const form = useForm({
    schema: vCategory,
  });

  useEffect(() => {
    if (category) {
      reset(form, { initialInput: category });
      modalRef.current?.showModal();
    } else {
      modalRef.current?.close();
      reset(form);
    }
  }, [category, form]);

  const submitForm: SubmitHandler<typeof vCategory> = async (values) => {
    try {
      setIsPending(true);
      await updateCategory(values);
      toast.success(m["successes.new_category"]());
      modalRef.current?.close();
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
      <div className="modal-box overflow-visible duration-150">
        <div className="flex justify-between">
          <h2 className="text-lg font-bold">{m["categories.details"]()}</h2>

          <DeleteCategoryModal categoryId={category?.id} onDelete={handleDelete} />
        </div>

        <Form className="space-y-2" of={form} onSubmit={submitForm}>
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

            <Field of={form} path={["icon"]}>
              {(field) => (
                <IconSelector label={m.icon()} value={field.input} onChange={field.onChange} />
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
