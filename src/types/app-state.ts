import * as v from "valibot";

export const vAppStateDraft = v.object({
  balance: v.number(),
  currency: v.string(),
  isAppInit: v.boolean(),
});

export const vAppState = v.object({
  id: v.number(),
  lastBudgetsAddedAt: v.optional(v.date()),
  ...vAppStateDraft.entries,
});

export type AppState = v.InferOutput<typeof vAppState>;
