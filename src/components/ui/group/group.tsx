import { GroupContext } from "./context/group-context";

type GroupProps = {
  title?: string;
  description?: string;
  button?: React.ReactNode;
  children: React.ReactNode;
};

export function Group({ title, description, button, children }: GroupProps) {
  return (
    <div>
      {(title || button) && (
        <div
          className={`flex items-center justify-between ${
            !description && "mb-2"
          }`}
        >
          {title && <h2 className="cursor-default">{title}</h2>}

          {button && button}
        </div>
      )}
      {description && (
        <p className="mb-2 text-sm text-(--text)/80">{description}</p>
      )}
      <GroupContext value={true}>
        <div className="w-full space-y-px rounded-xl p-0 shadow-sm">
          {children}
        </div>
      </GroupContext>
    </div>
  );
}
