import { ChevronLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { Sidebar } from "../sidebar";

type HeaderBarProps = {
  title: string;
  isSubPage?: boolean;
};

export function HeaderBar({ title, isSubPage }: HeaderBarProps) {
  return (
    <header>
      <nav>
        <ul className="grid h-full min-h-8 w-full grid-cols-3 items-center justify-center">
          <li className="flex items-center">
            {isSubPage ? <BackButton /> : <Sidebar.ToggleButton />}
          </li>

          <li className="col-end-3 flex items-center justify-center leading-0">
            <h1> {title} </h1>
          </li>
        </ul>
      </nav>
    </header>
  );
}

function BackButton() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation("arias");

  function handleBack() {
    if (location.state?.backTo) {
      navigate(location.state.backTo, { replace: true });
      return;
    }

    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
      return;
    }

    if (location.state?.fallback) {
      navigate(location.state.fallback, { replace: true });
      return;
    }

    navigate("..", { replace: true });
  }

  return (
    <button
      aria-label={t("header-bar.back-button")}
      title={t("header-bar.back-button")}
      className="cursor-pointer"
      onClick={handleBack}
    >
      <ChevronLeft />
    </button>
  );
}
