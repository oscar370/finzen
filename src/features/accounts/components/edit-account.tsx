import { updateAccount } from "@/api/accounts";
import { Button } from "@/components/ui/button";
import { DescriptionRow } from "@/components/ui/description-row";
import { Error } from "@/components/ui/error";
import { Group } from "@/components/ui/group";
import { Input } from "@/components/ui/input";
import { useAppStore } from "@/stores/use-app-store";
import { type Account } from "@/types/accounts";
import { formatCurrency } from "@/utils/format-currency";
import { t } from "i18next";
import { useForm, type FieldErrors } from "react-hook-form";
import toast from "react-hot-toast";
import { AccountsSelect } from "./accounts-select";

type EditAccountProps = {
  data: Account;
};

export function EditAccount({ data }: EditAccountProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Account>({
    defaultValues: data,
  });
  const currency = useAppStore((state) => state.currency);
  const balance = formatCurrency(currency, data.balance);

  async function handleSaveEdit(data: Account) {
    const response = await updateAccount(data);

    if (!response.ok) {
      toast.error(t("account.add", { ns: "errors" }));
      return;
    }

    toast.success(t("success.changesSaved", { ns: "messages" }));
  }

  function onInvalid(errors: FieldErrors) {
    if (process.env.NODE_ENV === "development") {
      console.error("Validation error: ", errors);
    }
  }

  return (
    <form
      className="space-y-3"
      onSubmit={handleSubmit(handleSaveEdit, onInvalid)}
    >
      <Group button={<ArchiveButton />}>
        <Input
          name="name"
          register={register}
          rules={{ required: t("errors.required", { ns: "common" }) }}
        >
          {t("form.fields.name.label", { ns: "accounts" })}
          {errors.name?.message && <Error> {errors.name.message} </Error>}
        </Input>

        <AccountsSelect name="type" register={register} />

        <DescriptionRow
          label={t("form.fields.balance.label", { ns: "accounts" })}
        >
          {balance}
        </DescriptionRow>
      </Group>

      <div className="flex items-center justify-center">
        <Button type="submit">
          {t("buttons.saveChanges", { ns: "common" })}
        </Button>
      </div>
    </form>
  );
}

function ArchiveButton() {
  return (
    <Button
      className="flex items-center justify-center gap-2"
      variant="destructiveSmall"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="16px"
        viewBox="0 0 16 16"
        width="16px"
      >
        <path
          d="m 2 1 c -1.109375 0 -2 0.890625 -2 2 v 2 c 0 0.75 0.40625 1.398438 1.015625 1.742188 c -0.011719 0.085937 -0.015625 0.171874 -0.015625 0.257812 v 7 c 0 1.109375 0.890625 2 2 2 h 10 c 1.109375 0 2 -0.890625 2 -2 v -7 c 0 -0.085938 -0.003906 -0.171875 -0.015625 -0.257812 c 0.609375 -0.34375 1.015625 -0.992188 1.015625 -1.742188 v -2 c 0 -1.109375 -0.890625 -2 -2 -2 z m 0 2 h 12 v 2 h -12 z m 1 4 h 10 v 7 h -10 z m 0 0"
          fill="currentColor"
        />
        <path d="m 6 8 h 4 v 1 h -4 z m 0 0" fill="currentColor" />
      </svg>

      <span> {t("buttons.archive", { ns: "accounts" })} </span>
    </Button>
  );
}
