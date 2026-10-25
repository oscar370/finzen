import { NumberInput } from "@/components/form/number-input";
import { Select } from "@/components/form/select";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { notifyError } from "@/lib/errors/notify-error";
import { currentYearMonth } from "@/lib/utils/current-year-month";
import { getCurrencies } from "@/lib/i18n/get-currencies";
import { getRegionalFormats } from "@/lib/i18n/get-regional-formats";
import { m } from "@/paraglide/messages";
import { updateAppState } from "@/services/settings/update-app-state";
import {
  vAppStateDraft,
  type AppStateDraft,
} from "@/types/app-state/app-state-draft";
import { Field, Form, useForm } from "@formisch/react";
import { useNavigate } from "@tanstack/react-router";
import { useTransition } from "react";

type WelcomeFormProps = {
  state: AppStateDraft;
};

export function WelcomeForm({ state }: WelcomeFormProps) {
  const [isPending, startTransition] = useTransition();
  const navigate = useNavigate();
  const currencies = getCurrencies();
  const regionalFormats = getRegionalFormats();
  const welcomeForm = useForm({
    schema: vAppStateDraft,
    initialInput: state,
  });

  function handleInitApp(values: AppStateDraft) {
    startTransition(async () => {
      try {
        await updateAppState({
          ...values,
          isAppInit: true,
        });
      } catch (error) {
        notifyError(error);
        return;
      }

      navigate({
        to: "/app",
        search: { yearMonth: currentYearMonth() },
        replace: true,
      });
    });
  }

  return (
    <Form of={welcomeForm} onSubmit={handleInitApp} className="mb-6 w-full">
      <FieldGroup>
        <Field of={welcomeForm} path={["balance"]}>
          {(field) => (
            <NumberInput
              {...field.props}
              label={m.welcome_initial_balance()}
              value={field.input}
              errors={field.errors}
              onChange={field.onChange}
            />
          )}
        </Field>

        <Field of={welcomeForm} path={["currency"]}>
          {(field) => (
            <Select
              {...field.props}
              label={m.currency()}
              value={field.input}
              errors={field.errors}
              onChange={field.onChange}
              items={currencies}
            />
          )}
        </Field>

        <Field of={welcomeForm} path={["regionalFormat"]}>
          {(field) => (
            <Select
              {...field.props}
              label={m.format()}
              value={field.input}
              errors={field.errors}
              onChange={field.onChange}
              items={regionalFormats}
            />
          )}
        </Field>

        <Button type="submit" disabled={isPending}>
          {isPending ? <Spinner /> : m.continue()}
        </Button>
      </FieldGroup>
    </Form>
  );
}
