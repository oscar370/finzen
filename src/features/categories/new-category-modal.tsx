import { TextInput } from "#/components/ui/form";
import { m } from "#/paraglide/messages";
import { addCategory } from "#/services/categories";
import { vDraftCategory } from "#/types/categories";
import type { SubmitHandler } from "@formisch/react";
import { Field, Form, reset, useForm } from "@formisch/react";
import { Plus } from "lucide-react";
import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";
import { IconSelector } from "./icon-selector";

export function NewCategoryModal() {
  const modalRef = useRef<HTMLDialogElement | null>(null);
  const [isPending, setIsPending] = useState(false);

  const form = useForm({
    schema: vDraftCategory,
    initialInput: {
      name: "",
      icon: "home",
    },
  });

  const submitForm: SubmitHandler<typeof vDraftCategory> = async (values) => {
    try {
      setIsPending(true);
      await addCategory(values);
      toast.success(m["successes.new_category"]());
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
      <div className="tooltip tooltip-left" data-tip={m.new_category()}>
        <button
          className="btn btn-square btn-sm btn-ghost"
          aria-label={m.new_category()}
          onClick={() => modalRef.current?.showModal()}
        >
          <Plus className="size-4" />
        </button>
      </div>

      {createPortal(
        <dialog className="modal duration-150" ref={modalRef}>
          <div className="modal-box overflow-visible duration-150">
            <h2 className="text-lg font-bold">{m.new_category()}</h2>

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
