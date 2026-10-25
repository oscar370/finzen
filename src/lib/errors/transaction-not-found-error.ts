import { m } from "@/paraglide/messages";
import { AppError } from "./app-error";

export class TransactionNotFoundError extends AppError {
  constructor() {
    super(m.errors_transaction_not_found());
    this.name = "TransactionNotFoundError";
  }
}
