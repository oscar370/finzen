import { SidebarTrigger } from "./ui/sidebar";

export function PageContainer({ children }: React.PropsWithChildren) {
  return <div className="flex min-h-dvh w-full flex-col">{children}</div>;
}

export function PageContainerHeader({ children }: React.PropsWithChildren) {
  return (
    <nav className="mb-4 grid h-8 w-full grid-cols-3 items-center px-2">
      <SidebarTrigger />
      {children}
    </nav>
  );
}

export function PageContainerTittle({ children }: React.PropsWithChildren) {
  return <h1 className="col-start-2 text-center font-bold">{children}</h1>;
}

export function PageContainerActions({ children }: React.PropsWithChildren) {
  return <div className="col-start-3 place-self-end">{children}</div>;
}

export function PageContainerContent({ children }: React.PropsWithChildren) {
  return (
    <main className="mx-auto w-full max-w-150 flex-1 space-y-4 px-1 md:px-0">
      {children}
    </main>
  );
}
