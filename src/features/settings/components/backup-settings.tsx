import {
  executeForceSync,
  getBackupLocationInfo,
  handleManualBackup,
  handleManualRestore,
  isFileSystemApiSupported,
  setupFileSystemHandle,
} from "@/api/backup";
import { ActionRow } from "@/components/ui/action-row";
import { ButtonRow } from "@/components/ui/button-row";
import { EntryRow } from "@/components/ui/entry-row";
import { ExpanderRow } from "@/components/ui/expander-row";
import { ListBox } from "@/components/ui/list-box";
import { modal } from "@/components/ui/modal-manager";
import { SwitchRow } from "@/components/ui/switch-row";
import { wikiBackupsRoutes } from "@/data/wiki-backups-routes";
import {
  setBackupInterval,
  toggleAutoBackup,
  useAppStore,
} from "@/stores/use-app-store";
import dayjs from "dayjs";
import {
  ArchiveRestore,
  ChevronRight,
  Download,
  Folder,
  FolderSync,
  Info,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

export function BackupSettings() {
  const isAutoBackupEnabled = useAppStore((state) => state.isAutoBackupEnabled);
  const backupInterval = useAppStore((state) => state.backupInterval);
  const { t, i18n } = useTranslation("settings");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [lastBackup, setLastBackup] = useState<string | undefined>("");

  function handleIntervalChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { value } = e.currentTarget;
    setBackupInterval(+value <= 5 ? 5 : +value);
  }

  function handleOpenRestoreModal() {
    modal.open(
      t("restoreModal.title"),

      <>
        <p className="text-center font-bold"> {t("restoreModal.message")} </p>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleRestore}
          accept=".json"
          className="hidden"
        />

        <ListBox>
          <ButtonRow
            variant="suggested"
            onClick={() => fileInputRef.current?.click()}
          >
            {t("restoreModal.button")}
          </ButtonRow>
        </ListBox>
      </>,
    );
  }

  async function handleRestore(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const result = await handleManualRestore(file);

    if (!result?.ok) {
      toast.error(t("errors.restore"));
      return;
    }

    if (fileInputRef.current) fileInputRef.current.value = "";
    modal.close();
    toast.success(t("success.restore"));
  }

  async function handleSaveBackup() {
    const result = await handleManualBackup();

    if (!result?.ok) {
      toast.error(t("errors.manualBackup"));
      return;
    }

    toast.success(t("success.manualBackup"));
  }

  async function handleForceSync() {
    const result = await executeForceSync();

    if (!result?.ok) {
      toast.error(t("errors.forceSync"));
      return;
    }

    toast.success(t("success.forceSync"));
  }

  async function handleChangeBackupFolder() {
    const result = await setupFileSystemHandle();

    if (!result?.ok) {
      toast.error(t("errors.backupFolder"));
      return;
    }

    const result2 = await executeForceSync();

    if (!result2?.ok) {
      toast.error(t("errors.forceSync"));
      return;
    }

    toast.success(t("success.backupFolder"));
  }

  useEffect(() => {
    getBackupLocationInfo().then((v) =>
      setLastBackup(dayjs(v?.lastBackupAt).format("LLL")),
    );
  }, []);

  function handleOpenWiki() {
    window.open(
      wikiBackupsRoutes[i18n.language as keyof typeof wikiBackupsRoutes],
    );
  }

  return (
    <ListBox title={t("titles.backup")}>
      {isFileSystemApiSupported() ? (
        <ExpanderRow title={t("fields.autoBackup")}>
          <SwitchRow
            title={t("fields.enableBackup")}
            checked={isAutoBackupEnabled}
            onChange={toggleAutoBackup}
          />

          {isAutoBackupEnabled && (
            <>
              <EntryRow
                title={t("fields.backupInterval")}
                value={backupInterval}
                disabledIcon
                type="number"
                onChange={handleIntervalChange}
              />

              <ActionRow title={t("buttons.lastBackup")}>
                <span className="text-(--dim-fg)">{lastBackup}</span>
              </ActionRow>
              <ButtonRow onClick={handleChangeBackupFolder}>
                <Folder />
                <span>{t("buttons.backupFolder")}</span>
              </ButtonRow>

              <ButtonRow onClick={handleForceSync}>
                <FolderSync />
                <span>{t("buttons.forceSync")}</span>
              </ButtonRow>
            </>
          )}
        </ExpanderRow>
      ) : (
        <ActionRow
          icon={<Info />}
          title={t("buttons.autoBackupFallback.title")}
          subtitle={t("buttons.autoBackupFallback.subtitle")}
          accent="text-(--text)"
          as="button"
          role="link"
          onClick={handleOpenWiki}
        >
          <ChevronRight />
        </ActionRow>
      )}

      <ButtonRow onClick={handleSaveBackup}>
        <Download />

        <span>{t("buttons.manualBackup")}</span>
      </ButtonRow>

      <ButtonRow onClick={handleOpenRestoreModal}>
        <ArchiveRestore />

        <span>{t("buttons.import")}</span>
      </ButtonRow>
    </ListBox>
  );
}
