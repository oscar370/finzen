import { Toaster } from "../ui/toaster";

export function MainLayout({ children }: React.PropsWithChildren) {
  return (
    <>
      {children}
      <Toaster />
    </>
  );
}
