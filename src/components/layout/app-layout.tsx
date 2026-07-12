import { m } from "#/paraglide/messages";
import { Link } from "@tanstack/react-router";
import { Banknote, House, Settings, Tags, TrendingDown, TrendingUp } from "lucide-react";
import * as React from "react";

const SIDEBAR_ITEMS = [
  { label: m["sidebar.buttons.home"](), to: "/app", icon: House },
  { label: m["sidebar.buttons.incomes"](), to: "/app/incomes", icon: TrendingUp },
  {
    label: m["sidebar.buttons.expenses"](),
    to: "/app/expenses",
    icon: TrendingDown,
  },
  { label: m["sidebar.buttons.categories"](), to: "/app/categories", icon: Tags },
  { label: m["sidebar.buttons.budgets"](), to: "/app/budgets", icon: Banknote },
  { label: m["sidebar.buttons.settings"](), to: "/app/settings", icon: Settings },
];

export function AppLayout({ children }: React.PropsWithChildren) {
  return (
    <div className="drawer md:drawer-open">
      <input id="app-sidebar" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col items-center">{children}</div>
      <div className="drawer-side">
        <label htmlFor="app-sidebar" aria-label="close sidebar" className="drawer-overlay"></label>
        <ul className="menu bg-base-200 min-h-full w-60 gap-1 p-4">
          {SIDEBAR_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  activeOptions={{ exact: true }}
                  activeProps={{ className: "menu-active" }}
                >
                  <Icon />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
