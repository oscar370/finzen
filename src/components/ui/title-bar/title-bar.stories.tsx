import "@/index.css";
import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Sidebar } from "../sidebar";
import { TitleBar } from "./title-bar";

const meta: Meta<typeof TitleBar> = {
  component: TitleBar,
};

export default meta;
type Story = StoryObj<typeof TitleBar>;

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
            <TitleBar title="Place" />

            <div className="mx-auto max-w-150 px-1">
              <p>Content</p>
            </div>
          </div>
        </div>
      </Sidebar>
    );
  },
};
