import { db } from "@/lib/dexie/db";
import {
  vCategoryDraft,
  type CategoryDraft,
} from "@/types/categories/category-draft";
import { parse } from "valibot";
import { scheduleBackupSync } from "../backup/schedule-sync";

export async function addCategory(categoryDraft: CategoryDraft) {
  const category = parse(vCategoryDraft, categoryDraft);
  const id = await db.categories.add({ ...category, isDeleted: 0 });

  scheduleBackupSync();

  return id;
}
