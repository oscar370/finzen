import toast from "react-hot-toast";
import { type BaseIssue, type BaseSchema, safeParse } from "valibot";

export function validate<
  T extends BaseSchema<unknown, unknown, BaseIssue<unknown>>,
>(schema: T, data: unknown) {
  const result = safeParse(schema, data);

  if (!result.success) {
    result.issues.forEach((issue) => {
      toast.error(issue.message);
    });

    return null;
  }

  return result.output;
}
