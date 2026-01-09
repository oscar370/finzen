import { AnimatePresence } from "motion/react";
import { Outlet } from "react-router-dom";

export function AnimatedLayout() {
  return (
    <AnimatePresence mode="wait">
      <Outlet />
    </AnimatePresence>
  );
}
