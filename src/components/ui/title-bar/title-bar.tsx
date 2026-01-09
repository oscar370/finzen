import { GoBackButton } from "../go-back-button";
import { Sidebar } from "../sidebar";

type NavBarProps = {
  title: string;
  isSubPage?: boolean;
};

export function TitleBar({ title, isSubPage = false }: NavBarProps) {
  return (
    <nav className="grid h-12 w-full grid-cols-3 items-center gap-4 bg-transparent">
      <div className="ml-1">
        {isSubPage ? <GoBackButton /> : <Sidebar.ToggleButton />}
      </div>

      <span className="text-center"> {title} </span>
    </nav>
  );
}
