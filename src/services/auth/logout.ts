import { authClient } from "@/lib/auth-client";
import { stopBackup } from "../backup/stop-backup";

export async function logout() {
  await stopBackup();
  await authClient.signOut();
}
