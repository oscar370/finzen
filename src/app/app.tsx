import { AnimatedRoutes } from "@/components/ui/animated-routes";
import { ModalManager } from "@/components/ui/modal-manager";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { BrowserRouter, Route } from "react-router-dom";
import AppRoutes from "./routes/app-routes";
import Landing from "./routes/landing/landing";

function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.lang = i18n.language;
    dayjs.locale(i18n.language);
  }, [i18n.language]);

  return (
    <>
      <BrowserRouter>
        <AnimatedRoutes>
          <Route index Component={Landing} />

          <Route path="/*" Component={AppRoutes} />
        </AnimatedRoutes>
      </BrowserRouter>

      <Toaster
        toastOptions={{ className: "bg-(--dialog-bg)! text-(--text)!" }}
      />
      <ModalManager />
    </>
  );
}

export default App;
