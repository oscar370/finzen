import { m } from "@/paraglide/messages";
import { AppError } from "./app-error";

export class TransactionsAssociatedCategoryError extends AppError {
  constructor() {
    super(m.errors_transactions_associated_category());
    this.name = "TransactionsAssociatedCategoryError";
  }
}
