import * as v from "valibot";

export const vGoogleDriveBackupMetadata = v.object({
  id: v.string(),
  modifiedTime: v.pipe(v.string(), v.toDate()),
});

export const vGoogleDriveUploadResponse = v.object({
  id: v.string(),
});

export type GoogleDriveBackupMetadata = v.InferOutput<typeof vGoogleDriveBackupMetadata>;
