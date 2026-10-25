import { db } from "@/lib/dexie/db";
import {
  vCategoryDraft,
  type CategoryDraft,
} from "@/types/categories/category-draft";
import { parse } from "valibot";

export async function addCategory(categoryDraft: CategoryDraft) {
  const category = parse(vCategoryDraft, categoryDraft);
  return db.categories.add({ ...category, isDeleted: 0 });
}
