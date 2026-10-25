import { currentYearMonth } from "@/lib/utils/current-year-month";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    throw redirect({
      to: "/app",
      search: { yearMonth: currentYearMonth() },
    });
  },
});
