import { db } from "@/lib/dexie/db";

export function getMonthlySummary(yearMonth: string) {
  return db.monthly_summaries.get(yearMonth);
}
