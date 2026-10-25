import { GoogleIcon } from "@/components/icons/google-icon";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { authClient } from "@/lib/auth-client";
import { notifyError } from "@/lib/errors/notify-error";
import { m } from "@/paraglide/messages";
import { useTransition } from "react";

export function GoogleDriveButton() {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      try {
        await authClient.signIn.social({
          provider: "google",
          scopes: ["https://www.googleapis.com/auth/drive.appdata"],
          callbackURL: "/sync?redirect=/app",
        });
      } catch (error) {
        notifyError(error);
      }
    });
  }

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            variant="secondary"
            size="icon"
            aria-label={m.login_google()}
            disabled={isPending}
            onClick={handleClick}
          />
        }
      >
        {isPending ? <Spinner /> : <GoogleIcon />}
      </TooltipTrigger>
      <TooltipContent>
        <p>{m.login_google()}</p>
      </TooltipContent>
    </Tooltip>
  );
}
