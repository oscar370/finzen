import { useSidebar } from "../hooks/use-sidebar";

export function SidebarToggleButton() {
  const { toggleSidebar } = useSidebar();

  return (
    <button
      className="w-fit px-3 py-2 text-center sm:hidden"
      onClick={toggleSidebar}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="16px"
        viewBox="0 0 16 16"
        width="16px"
      >
        <path
          d="m 9.292969 13.707031 l -5 -5 c -0.390625 -0.390625 -0.390625 -1.023437 0 -1.414062 l 5 -5 c 0.390625 -0.390625 1.023437 -0.390625 1.414062 0 s 0.390625 1.023437 0 1.414062 l -4.292969 4.292969 l 4.292969 4.292969 c 0.390625 0.390625 0.390625 1.023437 0 1.414062 s -1.023437 0.390625 -1.414062 0 z m 0 0"
          fill="currentColor"
          fillRule="evenodd"
        />
      </svg>
    </button>
  );
}
