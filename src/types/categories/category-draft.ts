import { m } from "@/paraglide/messages";
import * as v from "valibot";

export const vCategoryDraft = v.object({
  name: v.pipe(
    v.string(),
    v.trim(),
    v.minLength(1, m.errors_min_length({ v: 1 })),
    v.maxLength(50, m.errors_max_length({ v: 50 }))
  ),
  icon: v.string(),
});

export type CategoryDraft = v.InferOutput<typeof vCategoryDraft>;
