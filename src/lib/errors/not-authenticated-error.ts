import { m } from "@/paraglide/messages";
import { AppError } from "./app-error";

export class NotAuthenticatedError extends AppError {
  constructor() {
    super(m.errors_not_authenticated());
    this.name = "NotAuthenticatedError";
  }
}
