import { DEFAULT_CATEGORIES } from "../constants/default-categories";
import { db } from "./db";

export async function seedCategories() {
  const count = await db.categories.count();
  if (count > 0) return;

  await db.categories.bulkAdd(DEFAULT_CATEGORIES);
}
