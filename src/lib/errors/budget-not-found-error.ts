import { m } from "@/paraglide/messages";
import { AppError } from "./app-error";

export class BudgetNotFoundError extends AppError {
  constructor() {
    super(m.errors_budget_not_found());
    this.name = "BudgetNotFoundError";
  }
}
