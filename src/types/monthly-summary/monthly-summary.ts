import * as v from "valibot";

export const vMonthlySummary = v.object({
  id: v.pipe(v.string(), v.regex(/^\d{4}-(0[1-9]|1[0-2])$/)),
  year: v.number(),
  month: v.number(),
  income: v.number(),
  expense: v.number(),
  adjustments: v.number(),
});

export type MonthlySummary = v.InferOutput<typeof vMonthlySummary>;
