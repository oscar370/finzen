import { m } from "@/paraglide/messages";
import { AppError } from "./app-error";

export class BackupFailedError extends AppError {
  constructor() {
    super(m.errors_backup_failed());
    this.name = "BackupFailedError";
  }
}
