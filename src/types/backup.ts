import z from "zod";
import { AccountSchema } from "./accounts";
import { BudgetSchema } from "./budgets";
import { CategorySchema } from "./categories";
import { TransactionSchema } from "./transactions";

export const BackupPayloadSchema = z.object({
  metadata: z.object({
    version: z.number(),
    createdAt: z.number(),
    appVersion: z.string(),
  }),
  data: z.object({
    accounts: z.array(AccountSchema),
    categories: z.array(CategorySchema),
    transactions: z.array(TransactionSchema),
    budgets: z.array(BudgetSchema),
  }),
});

export type BackupPayload = z.infer<typeof BackupPayloadSchema>;

export type BackUpTable = {
  id: "backup_config";
  fileHandle?: FileSystemFileHandle | null;
  lastBackupAt?: number;
};
