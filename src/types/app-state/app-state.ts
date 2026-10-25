import * as v from "valibot";
import { vAppStateDraft } from "./app-state-draft";

export const vAppState = v.object({
  id: v.number(),
  lastBudgetsAddedAt: v.optional(v.date()),
  backedAt: v.optional(v.date()),
  backupId: v.optional(v.string()),
  cloudProvider: v.optional(v.union([v.literal("google")])),
  ...vAppStateDraft.entries,
});

export type AppState = v.InferOutput<typeof vAppState>;
