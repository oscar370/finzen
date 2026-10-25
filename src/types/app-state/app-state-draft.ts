import { m } from "@/paraglide/messages";
import * as v from "valibot";

export const vAppStateDraft = v.object({
  balance: v.number(m.errors_invalid_value()),
  currency: v.string(),
  regionalFormat: v.string(),
  isAppInit: v.boolean(),
});

export type AppStateDraft = v.InferOutput<typeof vAppStateDraft>;
