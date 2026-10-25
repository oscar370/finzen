import { m } from "@/paraglide/messages";
import { AppError } from "./app-error";

export class CategoryNotFoundError extends AppError {
  constructor() {
    super(m.errors_category_not_found());
    this.name = "CategoryNotFoundError";
  }
}
