import { PanelLeft } from "lucide-react";

type PageContainerProps = {
  title: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
};

export function PageContainer({ title, actions, children }: PageContainerProps) {
  return (
    <div className="w-full">
      <header className="grid h-10 w-full grid-cols-[minmax(50px,1fr)_max-content_minmax(50px,1fr)] items-center gap-2 px-1">
        <label
          htmlFor="app-sidebar"
          className="btn drawer-button btn-square btn-ghost btn-sm md:hidden"
        >
          <PanelLeft className="size-4" />
        </label>

        <h1 className="col-start-2 text-center font-bold">{title}</h1>

        {actions && <div className="flex justify-end">{actions}</div>}
      </header>

      <main className="mx-auto w-full max-w-150 space-y-4 px-1 py-4">{children}</main>
    </div>
  );
}
