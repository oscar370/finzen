import { m } from "#/paraglide/messages";
import * as v from "valibot";

export const vDraftTransaction = v.object({
  name: v.pipe(
    v.string(),
    v.trim(),
    v.minLength(1, m["errors.min_length"]({ v: 1 })),
    v.maxLength(50, m["errors.max_length"]({ v: 50 })),
  ),
  amount: v.pipe(v.number(), v.minValue(1, m["errors.min_value"]({ v: 1 }))),
  date: v.date(),
  kind: v.union([v.literal("expense"), v.literal("income")]),
  note: v.pipe(v.string(), v.trim()),
  categoryId: v.number(),
});

export const vTransaction = v.object({
  id: v.number(),
  categoryIcon: v.string(),
  categoryName: v.string(),
  yearMonth: v.pipe(v.string(), v.regex(/^\d{4}-(0[1-9]|1[0-2])$/)),
  ...vDraftTransaction.entries,
});

export type DraftTransaction = v.InferOutput<typeof vDraftTransaction>;
export type Transaction = v.InferOutput<typeof vTransaction>;
