import { createContext } from "react";

type TSidebarContext = {
  isOpen: boolean;
  toggleSidebar: () => void;
};

export const SidebarContext = createContext<TSidebarContext | null>(null);
