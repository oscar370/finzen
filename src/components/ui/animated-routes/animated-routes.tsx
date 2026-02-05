import { AnimatePresence } from "motion/react";
import { Routes, useLocation, useNavigationType } from "react-router-dom";

type AnimatedRoutesProps = {
  children: React.ReactNode;
};

export function AnimatedRoutes({ children }: AnimatedRoutesProps) {
  const location = useLocation();
  const navType = useNavigationType();
  const isPop = navType === "POP" || navType === "REPLACE";

  return (
    <AnimatePresence mode="wait" custom={isPop}>
      <Routes location={location} key={location.pathname}>
        {children}
      </Routes>
    </AnimatePresence>
  );
}
