import { NavigationPage } from "@/components/ui/navigation-page";
import { AddAccountForm } from "@/features/accounts";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export default function NewAccount() {
  const navigate = useNavigate();
  const { t } = useTranslation("accounts");

  function handleSuccess() {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
      return;
    }

    navigate("..", { replace: true });
  }

  return (
    <NavigationPage title={t("titles.new")} isSubPage>
      <AddAccountForm onSuccess={handleSuccess} />
    </NavigationPage>
  );
}
