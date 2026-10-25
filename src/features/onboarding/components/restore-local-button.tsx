import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { notifyError } from "@/lib/errors/notify-error";
import { currentYearMonth } from "@/lib/utils/current-year-month";
import { m } from "@/paraglide/messages";
import { importLocalBackup } from "@/services/backup/import-local-backup";
import { useNavigate } from "@tanstack/react-router";
import { FileIcon } from "lucide-react";
import { useRef, useTransition } from "react";

export function RestoreLocalButton() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();
  const navigate = useNavigate();

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const input = event.currentTarget;
    const file = input.files?.[0];
    if (!file) return;

    startTransition(async () => {
      try {
        await importLocalBackup(file);
        toast.add({
          description: m.successes_backup_restored(),
          type: "success",
        });
        await navigate({
          to: "/app",
          search: { yearMonth: currentYearMonth() },
          replace: true,
        });
      } catch (error) {
        notifyError(error);
      } finally {
        input.value = "";
      }
    });
  }

  return (
    <>
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              aria-label={m.restore_local_backup()}
              variant="secondary"
              size="icon"
              disabled={isPending}
              onClick={() => inputRef.current?.click()}
            />
          }
        >
          {isPending ? <Spinner /> : <FileIcon />}
        </TooltipTrigger>
        <TooltipContent>
          <p>{m.restore_local_backup()}</p>
        </TooltipContent>
      </Tooltip>

      <input
        ref={inputRef}
        type="file"
        accept="application/json,.json"
        className="hidden"
        onChange={handleFileChange}
      />
    </>
  );
}
