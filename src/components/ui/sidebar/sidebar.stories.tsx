import type { Meta, StoryObj } from "@storybook/react-vite";
import { Home, User } from "lucide-react";
import { useState } from "react";
import { ActionRow } from "../action-row";
import { HeaderBar } from "../header-bar";
import { ListBox } from "../list-box";
import { SplitView } from "../split-view";
import { Sidebar } from "./sidebar";

const meta = {
  component: Sidebar,
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof Sidebar>;

export const SidebarStory: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    function toggleSidebar() {
      setIsOpen((prev) => !prev);
    }

    return (
      <>
        <SplitView>
          <Sidebar open={isOpen} onToggle={toggleSidebar}>
            <Sidebar.Panel>
              <ListBox as="nav">
                <ActionRow
                  title="Home"
                  as="a"
                  href="/"
                  isActive
                  icon={<Home />}
                  onClick={(e) => {
                    // Prevent default is only used to avoid breaking the Storybook presentation
                    e?.preventDefault();
                    toggleSidebar();
                  }}
                />

                <ActionRow
                  title="User"
                  as="a"
                  href="user"
                  icon={<User />}
                  onClick={(e) => {
                    e?.preventDefault();
                    toggleSidebar();
                  }}
                />
              </ListBox>
            </Sidebar.Panel>

            <main className="px-4">
              <HeaderBar title="Home" />
              <h1>Content</h1>
            </main>
          </Sidebar>
        </SplitView>
      </>
    );
  },
};
