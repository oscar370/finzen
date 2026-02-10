import { Carousel } from "@/components/ui/carousel";
import { ListBox } from "@/components/ui/list-box";
import { AddAccountForm } from "@/features/accounts";
import { CurrencySelect } from "@/features/currency";
import { LanguageSelect } from "@/features/settings";
import { setFirstSession, useAppStore } from "@/stores/use-app-store";
import { useTranslation } from "react-i18next";
import { Navigate, useNavigate } from "react-router-dom";

export default function Welcome() {
  const isFirstSession = useAppStore((state) => state.isFirstSession);

  if (!isFirstSession) {
    return <Navigate to={"/home"} replace />;
  }

  return (
    <div className="flex h-dvh w-full items-center justify-center">
      <main className="h-full w-full px-1">
        <Carousel
          slides={[
            <SelectLanguageSlide />,
            <CurrencySlide />,
            <AddAccountSlide />,
          ]}
        />
      </main>
    </div>
  );
}

function SelectLanguageSlide() {
  const { t } = useTranslation("languages");

  return (
    <div className="mx-auto flex h-full max-w-150 flex-col items-center justify-center">
      <h2 className="text-xl font-bold">{t("welcome.title")}</h2>

      <p className="text-center"> {t("welcome.description")} </p>

      <ListBox>
        <LanguageSelect />
      </ListBox>
    </div>
  );
}

function CurrencySlide() {
  const { t } = useTranslation("currency");

  return (
    <div className="mx-auto flex h-full max-w-150 flex-col items-center justify-center">
      <h2 className="text-xl font-bold">{t("welcome.title")}</h2>

      <ListBox>
        <CurrencySelect />
      </ListBox>
    </div>
  );
}

function AddAccountSlide() {
  const { t } = useTranslation("accounts");
  const navigate = useNavigate();

  function handleSuccess() {
    navigate("/home", { replace: true });
    setFirstSession(false);
  }

  return (
    <div className="mx-auto flex h-full max-w-150 flex-col items-center justify-center">
      <h2 className="text-xl font-bold">{t("welcome.title")}</h2>

      <AddAccountForm onSuccess={handleSuccess} />
    </div>
  );
}
