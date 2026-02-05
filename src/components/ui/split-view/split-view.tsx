import { useIsMobile } from "../../../hooks/use-is-mobile";

type SplitViewProps = {
  children: React.ReactNode;
};

export function SplitView({ children }: SplitViewProps) {
  const isMobile = useIsMobile();

  return (
    <div
      className={`${!isMobile ? "grid grid-cols-[minmax(min-content,200px)_1fr]" : undefined}`}
    >
      {children}
    </div>
  );
}
