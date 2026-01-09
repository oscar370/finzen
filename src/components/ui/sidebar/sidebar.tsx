import { SidebarPanel } from "./components/sidebar-panel";
import { SidebarToggleButton } from "./components/sidebar-toggle-button";
import { SidebarContext } from "./context/sidebar-context";

type SidebarProps = {
  children: React.ReactNode;
  isOpen: boolean;
  toggleSidebar: () => void;
};

export function Sidebar({ children, isOpen, toggleSidebar }: SidebarProps) {
  return (
    <SidebarContext value={{ isOpen, toggleSidebar }}>
      {children}
    </SidebarContext>
  );
}

Sidebar.Panel = SidebarPanel;
Sidebar.ToggleButton = SidebarToggleButton;
