import { setFirstSession } from "@/stores/use-app-store.ts";
import { t } from "i18next";
import { useNavigate } from "react-router-dom";
import { AddAccountForm } from "./add-account-form.tsx.tsx";

export function FirstAccount() {
  const navigate = useNavigate();

  function handleSuccess() {
    setFirstSession(false);
    navigate("/home");
  }

  return (
    <AddAccountForm onSuccess={handleSuccess}>
      <h2 className="text-center text-xl font-bold">
        {t("welcome.title", { ns: "accounts" })}
      </h2>
    </AddAccountForm>
  );
}
