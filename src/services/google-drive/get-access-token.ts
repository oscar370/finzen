import { authClient } from "@/lib/auth-client";
import { NotAuthenticatedError } from "@/lib/errors/not-authenticated-error";
import { logout } from "../auth/logout";

export async function getAccessToken() {
  const { data, error } = await authClient.getAccessToken({
    useAccountCookie: true,
  });

  if (error || !data.accessToken) {
    try {
      await logout();
    } catch {
      // Ignore logout failures; the user still needs to authenticate again.
    }

    throw new NotAuthenticatedError();
  }

  return data.accessToken;
}
