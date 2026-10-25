import { m } from "@/paraglide/messages";
import { AppError } from "./app-error";

export class AppStateNotFoundError extends AppError {
  constructor() {
    super(m.errors_app_state_not_found());
    this.name = "AppStateNotFoundError";
  }
}
