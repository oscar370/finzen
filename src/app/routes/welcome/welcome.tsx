import { Carousel } from "@/components/ui/carousel";
import { ListBox } from "@/components/ui/list-box";
import { AddAccountForm } from "@/features/accounts";
import { CurrencySelect } from "@/features/currency";
import { setFirstSession } from "@/stores/use-app-store";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export function Welcome() {
  return (
    <div className="flex h-dvh w-full items-center justify-center">
      <main className="h-full w-full px-1">
        <Carousel slides={[<CurrencySlide />, <AddAccountSlide />]} />
      </main>
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
  const { t } = useTranslation("currency");
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
