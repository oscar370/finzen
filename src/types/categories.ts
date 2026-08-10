import { m } from "#/paraglide/messages";
import * as v from "valibot";

export const vDraftCategory = v.object({
  name: v.pipe(
    v.string(),
    v.trim(),
    v.minLength(1, m["errors.min_length"]({ v: 1 })),
    v.maxLength(50, m["errors.max_length"]({ v: 50 })),
  ),
  icon: v.string(),
  deletedAt: v.optional(v.date()),
});

export const vCategory = v.object({
  id: v.number(),
  isDeleted: v.union([v.literal(1), v.literal(0)]),
  ...vDraftCategory.entries,
});

export type CategoryDraft = v.InferOutput<typeof vDraftCategory>;
export type Category = v.InferOutput<typeof vCategory>;
