import { Toaster } from "../ui/toast";
import { TooltipProvider } from "../ui/tooltip";
import { ThemeProvider } from "./theme-provider";

export function Providers({ children }: React.PropsWithChildren) {
  return (
    <ThemeProvider defaultTheme="system" storageKey="theme">
      <TooltipProvider>
        <Toaster>{children}</Toaster>
      </TooltipProvider>
    </ThemeProvider>
  );
}
