import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { notifyError } from "@/lib/errors/notify-error";
import { m } from "@/paraglide/messages";
import { syncBackup } from "@/services/backup/sync-backup";
import { addRecurringBudgets } from "@/services/budgets/add-recurring-budgets";
import { getAppState } from "@/services/settings/get-app-state";
import {
  createFileRoute,
  Link,
  Outlet,
  redirect,
  useLocation,
} from "@tanstack/react-router";
import {
  Banknote,
  Home,
  Settings,
  Tags,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useEffect, useRef } from "react";

export const Route = createFileRoute("/app/_layout")({
  component: RouteComponent,
  ssr: false,
  beforeLoad: async () => {
    const appState = await getAppState();

    if (!appState.isAppInit) {
      throw redirect({ to: "/welcome", replace: true });
    }
  },
});

const ITEMS = [
  { label: m.home(), to: "/app", icon: Home },
  { label: m.incomes(), to: "/app/incomes", icon: TrendingUp },
  { label: m.expenses(), to: "/app/expenses", icon: TrendingDown },
  { label: m.budgets(), to: "/app/budgets", icon: Banknote },
  { label: m.categories(), to: "/app/categories", icon: Tags },
  { label: m.settings(), to: "/app/settings", icon: Settings },
];

function RouteComponent() {
  const location = useLocation();
  const recurringChecked = useRef(false);

  useEffect(() => {
    if (recurringChecked.current) return;
    recurringChecked.current = true;
    void addRecurringBudgets().catch(notifyError);
  }, []);

  useEffect(() => {
    void syncBackup().catch(notifyError);
    const interval = setInterval(
      () => void syncBackup().catch(notifyError),
      300_000
    );
    return () => clearInterval(interval);
  }, []);

  return (
    <SidebarProvider>
      <Sidebar className="border-none" collapsible="icon">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {ITEMS.map((item) => (
                  <SidebarMenuItem key={item.to}>
                    <SidebarMenuButton
                      render={<Link to={item.to} />}
                      isActive={
                        item.to === "/app"
                          ? location.pathname === "/app"
                          : location.pathname.startsWith(item.to)
                      }
                    >
                      <item.icon />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      <SidebarInset>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}
