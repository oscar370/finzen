import { motion } from "motion/react";
import { useIsMobile } from "../hooks/use-is-mobile";
import { useSidebar } from "../hooks/use-sidebar";

type SidebarPanel = {
  children: React.ReactNode;
};

export function SidebarPanel({ children }: SidebarPanel) {
  const { isOpen } = useSidebar();
  const { isMobile } = useIsMobile();

  return (
    <motion.nav
      className="fixed min-h-dvh w-full bg-[color-mix(in_srgb,var(--background),var(--text)_15%)] sm:static!"
      initial={false}
      animate={isMobile && !isOpen ? "close" : "open"}
      variants={{
        open: { x: 0 },
        close: { x: "-100%" },
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      inert={isMobile && !isOpen ? true : undefined}
    >
      {children}
    </motion.nav>
  );
}
