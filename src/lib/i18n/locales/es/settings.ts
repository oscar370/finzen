export const esSettings = {
  titles: {
    app: "Configuración de la aplicación",
    archived: "Archivados",
    backup: "Respaldo",
  },
  fields: {
    language: {
      label: "Idioma",
      options: {
        english: "English",
        spanish: "Español",
      },
    },
    autoBackup: "Respaldo automático",
    enableBackup: "Habilitar",
    backupInterval: "Intervalo de respaldo",
  },
  buttons: {
    transactions: "Transacciones archivadas",
    accounts: "Cuentas archivadas",
    categories: "Categorías archivadas",
    import: "Importar respaldo",
    manualBackup: "Descargar respaldo",
    forceSync: "Forzar sincronización",
    lastBackup: "Último respaldo",
    backupFolder: "Cambiar carpeta de respaldo",
  },
  restoreModal: {
    title: "Restaurar respaldo",
    message:
      "Restaurar el respaldo sobrescribirá los datos. ¿Estás seguro de que deseas continuar?",
    button: "Confirmar",
  },
  errors: {
    restore: "No se pudo restaurar el respaldo",
    manualBackup: "No se pudo descargar o generar el respaldo",
    forceSync: "No se pudo forzar la sincronización",
    backupFolder: "No se pudo cambiar la carpeta de respaldo",
  },
  success: {
    restore: "La restauración del respaldo se completó correctamente",
    manualBackup: "La descarga del respaldo se completó correctamente",
    forceSync: "La sincronización forzada se completó correctamente",
    backupFolder: "La carpeta de respaldo se cambió correctamente",
  },
};
