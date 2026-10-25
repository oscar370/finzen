import * as v from "valibot";
import { vCategoryDraft } from "./category-draft";

export const vCategory = v.object({
  id: v.number(),
  isDeleted: v.union([v.literal(1), v.literal(0)]),
  ...vCategoryDraft.entries,
});

export type Category = v.InferOutput<typeof vCategory>;
