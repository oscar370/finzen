export const enSettings = {
  titles: {
    app: "App settings",
    archived: "Archived",
    backup: "Backup",
  },
  fields: {
    language: {
      label: "Language",
      options: {
        english: "English",
        spanish: "Español",
      },
    },
    autoBackup: "Auto backup",
    enableBackup: "Enable",
    backupInterval: "Backup interval",
  },
  buttons: {
    transactions: "Archived transactions",
    accounts: "Archived accounts",
    categories: "Archived categories",
    import: "Import backup",
    manualBackup: "Download backup",
    forceSync: "Force sync",
    lastBackup: "Last backup",
    backupFolder: "Change backup folder",
  },
  restoreModal: {
    title: "Restore backup",
    message:
      "Restoring the backup will overwrite the data. Are you sure you want to continue?",
    button: "Confirm",
  },
  errors: {
    restore: "Failed to restore backup",
    manualBackup: "Failed to download or generate backup",
    forceSync: "Failed to force synchronization",
    backupFolder: "Failed to change backup folder",
  },
  success: {
    restore: "The restoration of the backup was successfully completed",
    manualBackup: "The backup download was successfully completed",
    forceSync: "Forced synchronization successfully completed",
    backupFolder: "The backup folder was successfully changed",
  },
};
