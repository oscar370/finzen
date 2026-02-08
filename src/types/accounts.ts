import { z } from "zod";
import { ArchiveStatusSchema, SyncStatusSchema } from "./common";

export const AccountSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(["cash", "debit", "credit", "investment"]),
  balance: z.number(),
  initialBalance: z.number(),
  archive: ArchiveStatusSchema,
  updatedAt: z.number(),
  syncStatus: SyncStatusSchema,
});

export type Account = z.infer<typeof AccountSchema>;

export type DraftAccount = Pick<Account, "name" | "type" | "initialBalance">;
