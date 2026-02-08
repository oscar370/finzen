import z from "zod";
import { ArchiveStatusSchema, SyncStatusSchema } from "./common";

export const CategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  icon: z.string(),
  color: z.string(),
  updatedAt: z.number(),
  archive: ArchiveStatusSchema,
  syncStatus: SyncStatusSchema,
});

export type Category = z.infer<typeof CategorySchema>;

export type CategoryDraft = Pick<Category, "name" | "icon" | "color">;
