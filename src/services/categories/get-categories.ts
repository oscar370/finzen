import { db } from "@/lib/dexie/db";

export function getCategories() {
  return db.categories.where("isDeleted").equals(0).sortBy("name");
}
