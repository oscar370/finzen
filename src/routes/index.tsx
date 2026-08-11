import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Home,
  beforeLoad: async () => {
    throw redirect({ to: "/app" });
  },
});

function Home() {
  return null;
}
