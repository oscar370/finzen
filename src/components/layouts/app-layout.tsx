import { useAppStore } from "@/stores/use-app-store";
import { t } from "i18next";
import {
  Banknote,
  ChartColumnBig,
  Home,
  Settings,
  Tags,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { ActionRow } from "../ui/action-row";
import { ListBox } from "../ui/list-box";
import { Sidebar } from "../ui/sidebar";
import { SplitView } from "../ui/split-view";

const SIDEBAR_BUTTONS = [
  { label: "sections.home", to: "/home", icon: Home },
  { label: "sections.analytics", to: "/analytics", icon: ChartColumnBig },
  { label: "sections.accounts", to: "/accounts", icon: Wallet },
  { label: "sections.incomes", to: "/incomes", icon: TrendingUp },
  { label: "sections.expenses", to: "/expenses", icon: TrendingDown },
  { label: "sections.categories", to: "/categories", icon: Tags },
  { label: "sections.budgets", to: "/budgets", icon: Banknote },
  { label: "sections.settings", to: "/settings", icon: Settings },
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

  return (
    <>
      <Sidebar open={isSidebarOpen} onToggle={handleToggleSidebar}>
        <SplitView>
          <Sidebar.Panel>
            <ListBox as="nav">
              {SIDEBAR_BUTTONS.map(({ label, to, icon: Icon }) => (
                <ActionRow
                  key={to}
                  title={t(label, { ns: "common" })}
                  as={Link}
                  isActive={location.pathname === to ? true : undefined}
                  onClick={handleToggleSidebar}
                  icon={<Icon />}
                  accent="text-(--text)"
                  to={to}
                />
              ))}
            </ListBox>
          </Sidebar.Panel>

          <div className="overflow-x-hidden">
            <Outlet />
          </div>
        </SplitView>
      </Sidebar>
    </>
  );
}
