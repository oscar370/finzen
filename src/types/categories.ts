export type Category = {
  id: string;
  name: string;
  icon: string;
  updatedAt: number;
  archive: 0 | 1;
  syncStatus: "pending" | "synced" | "conflict";
};

export type CategoryDraft = Pick<Category, "name" | "icon">;
