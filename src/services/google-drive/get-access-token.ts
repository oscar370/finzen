import { authClient } from "@/lib/auth-client";
import { NotAuthenticatedError } from "@/lib/errors/not-authenticated-error";

export async function getAccessToken() {
  const { data } = await authClient.getAccessToken({
    useAccountCookie: true,
  });

  if (!data?.accessToken) throw new NotAuthenticatedError();

  return data.accessToken;
}
