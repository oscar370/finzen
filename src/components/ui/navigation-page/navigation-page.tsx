import { motion, usePresenceData } from "motion/react";
import { HeaderBar } from "../header-bar";

type NavigationPageProps = {
  title: string;
  isSubPage?: boolean;
  children: React.ReactNode;
};

export function NavigationPage({
  title,
  isSubPage = false,
  children,
}: NavigationPageProps) {
  const isPop = usePresenceData() as boolean;
  const xInitialDirection = isPop ? "0%" : "100%";
  const xExitDirection = isPop ? "100%" : "0%";

  return (
    <div className="h-full w-full overflow-hidden">
      <motion.div
        variants={{
          initial: {
            x: xInitialDirection,
          },
          animate: {
            x: "0%",
          },
          exit: {
            x: xExitDirection,
          },
        }}
        initial={isSubPage ? "initial" : false}
        animate={isSubPage ? "animate" : false}
        exit={isSubPage ? "exit" : undefined}
        transition={{
          type: "tween",
          ease: "easeOut",
          duration: 0.25,
        }}
      >
        <HeaderBar title={title} isSubPage={isSubPage} />

        <main className="mx-auto max-w-150 px-1 pb-1">{children}</main>
      </motion.div>
    </div>
  );
}
