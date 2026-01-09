import { useAppStore } from "@/stores/use-app-store";
import { t } from "i18next";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { Outlet, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Sidebar } from "../ui/sidebar";

const SIDEBAR_BUTTONS = [
  { label: "sections.home", to: "/home" },
  { label: "sections.accounts", to: "/accounts" },
  { label: "sections.incomes", to: "/incomes" },
  { label: "sections.expenses", to: "/expenses" },
  { label: "sections.categories", to: "/categories" },
];

export function AppLayout() {
  const isFirstSession = useAppStore((state) => state.isFirstSession);
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (isFirstSession) navigate("/welcome");
  }, [isFirstSession, navigate]);

  function handleToggleSidebar() {
    setSidebarOpen((prev) => !prev);
  }

  function handleGoTo(url: string) {
    handleToggleSidebar();
    navigate(url);
  }

  return (
    <>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={handleToggleSidebar}>
        <div className="grid sm:grid-cols-[minmax(min-content,200px)_1fr]">
          <Sidebar.Panel>
            <div className="space-y-1 px-1 py-12">
              {SIDEBAR_BUTTONS.map(({ label, to }) => (
                <Button
                  key={to}
                  variant="nav"
                  data-active={location.pathname === to ? true : undefined}
                  onClick={() => handleGoTo(to)}
                >
                  {t(label, { ns: "common" })}
                </Button>
              ))}
            </div>
          </Sidebar.Panel>

          <div className="overflow-x-hidden">
            <Outlet />
          </div>
        </div>
      </Sidebar>

      <Toaster
        toastOptions={{
          className:
            "bg-[color-mix(in_srgb,var(--background),var(--text)_15%)]!  text-(--text)!",
        }}
      />
    </>
  );
}
