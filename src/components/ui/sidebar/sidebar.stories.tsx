import "@/index.css";
import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Sidebar } from "./sidebar";

const meta: Meta<typeof Sidebar> = {
  component: Sidebar,
};

export default meta;
type Story = StoryObj<typeof Sidebar>;

export const Default: Story = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    function handleToggleSidebar() {
      setIsSidebarOpen((prev) => !prev);
    }
    return (
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={handleToggleSidebar}>
        <div className="grid sm:grid-cols-[minmax(min-content,200px)_1fr]">
          <Sidebar.Panel>
            <div className="flex flex-col gap-2 px-2 py-12">
              <button onClick={handleToggleSidebar}>To somewhere</button>
              <button onClick={handleToggleSidebar}>To somewhere</button>
            </div>
          </Sidebar.Panel>

          <div>
            <div className="w-full px-2">
              <Sidebar.ToggleButton />
            </div>
            <div className="px-2 py-12">
              <h1>Content</h1>

              <p>The content next to the sidebar</p>
            </div>
          </div>
        </div>
      </Sidebar>
    );
  },
};
