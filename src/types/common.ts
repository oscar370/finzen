import { z } from "zod";

export const SyncStatusSchema = z.enum(["pending", "synced", "conflict"]);
export const ArchiveStatusSchema = z.union([z.literal(0), z.literal(1)]);
