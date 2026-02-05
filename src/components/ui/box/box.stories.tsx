import type { Meta, StoryObj } from "@storybook/react-vite";
import { Archive, Pencil } from "lucide-react";
import { Button } from "../button";
import { Box } from "./box";

const meta = {
  component: Box,
} satisfies Meta<typeof Box>;

export default meta;
type Story = StoryObj<typeof Box>;

export const BoxStory: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Box>
        <Button>
          <Archive />
        </Button>
        <Button>
          <Pencil />
        </Button>
      </Box>

      <Box linked>
        <Button>
          <Archive />
        </Button>
        <Button>
          <Pencil />
        </Button>
      </Box>

      <Box align="vertical" linked>
        <Button>
          <Archive />
        </Button>
        <Button>
          <Pencil />
        </Button>
      </Box>
    </div>
  ),
};
