import { m } from "@/paraglide/messages";
import * as v from "valibot";

export const vTransactionDraft = v.object({
  name: v.pipe(
    v.string(),
    v.trim(),
    v.minLength(1, m.errors_min_length({ v: 1 })),
    v.maxLength(50, m.errors_max_length({ v: 50 }))
  ),
  amount: v.pipe(
    v.number(m.errors_invalid_value()),
    v.minValue(1, m.errors_min_value({ v: 1 }))
  ),
  date: v.date(),
  kind: v.union([v.literal("expense"), v.literal("income")]),
  note: v.pipe(v.string(), v.trim()),
  categoryId: v.number(),
});

export type TransactionDraft = v.InferOutput<typeof vTransactionDraft>;
