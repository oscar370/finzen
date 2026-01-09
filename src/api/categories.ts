import { db } from "@/lib/dexie";
import type { Category, CategoryDraft } from "@/types/categories";
import { useLiveQuery } from "dexie-react-hooks";

export const UNCATEGORIZED_ID = "uncategorized";

const DEFAULT_CATEGORIES: Partial<Category>[] = [
  {
    name: "labels.system",
    icon: "bolt",
    id: "system",
  },
  {
    name: "labels.food",
    icon: "utensils",
  },
  {
    name: "labels.transport",
    icon: "car",
  },
  {
    name: "labels.housing",
    icon: "home",
  },
  {
    name: "labels.entertainment",
    icon: "gamepad",
  },
  {
    name: "labels.health",
    icon: "heart",
  },
  {
    name: "labels.shopping",
    icon: "shoppingBag",
  },
  {
    name: "labels.salary",
    icon: "wallet",
  },
  {
    name: "labels.investments",
    icon: "trendingUp",
  },
  {
    name: "labels.gifts",
    icon: "gift",
  },
  {
    name: "labels.others",
    icon: "helpCircle",
    id: UNCATEGORIZED_ID,
  },
];

export async function seedCategories() {
  const now = Date.now();

  const count = await db.categories.count();
  if (count > 0) return;

  const categoriesToInsert: Category[] = DEFAULT_CATEGORIES.map((cat) => ({
    id: cat.id || crypto.randomUUID(),
    name: cat.name!,
    icon: cat.icon!,
    archive: 0,
    updatedAt: now,
    syncStatus: "pending",
  }));

  await db.categories.bulkAdd(categoriesToInsert);
}

export async function addCategory(draft: CategoryDraft) {
  const id = crypto.randomUUID();
  const now = Date.now();

  try {
    await db.categories.add({
      ...draft,
      id,
      updatedAt: now,
      archive: 0,
      syncStatus: "pending",
    });

    return { ok: true };
  } catch (error) {
    console.error(error);
    return { ok: false };
  }
}

export function useCategories() {
  return (
    useLiveQuery(() =>
      db.categories.where("archive").equals(0).sortBy("name"),
    ) ?? []
  );
}

export function useCategoryById(id: string) {
  return useLiveQuery(async () => {
    return await db.categories.where("id").equals(id).first();
  }, [id]);
}

export function useExpensesByCategory(from: number, to: number) {
  return useLiveQuery(async () => {
    const transactions = await db.transactions
      .where("date")
      .between(from, to)
      .and((t) => t.kind === "expense" && t.archive === 0)
      .toArray();

    const categories = await db.categories.toArray();
    const catMap = new Map(categories.map((c) => [c.id, c]));

    const totals = transactions.reduce(
      (acc, curr) => {
        const catId = curr.categoryId || UNCATEGORIZED_ID;
        acc[catId] = (acc[catId] || 0) + curr.amount;
        return acc;
      },
      {} as Record<string, number>,
    );

    return Object.entries(totals)
      .map(([id, amount]) => ({
        id,
        amount,
        name: catMap.get(id)?.name ?? "Unknown",
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [from, to]);
}

export async function archiveCategory(id: string) {
  if (id === UNCATEGORIZED_ID) return;

  return await db
    .transaction("rw", [db.categories, db.transactions], async () => {
      await db.transactions
        .where("categoryId")
        .equals(id)
        .modify({ categoryId: UNCATEGORIZED_ID });

      await db.categories.update(id, {
        archive: 1,
        updatedAt: Date.now(),
        syncStatus: "pending",
      });
      return { ok: true };
    })
    .catch((error) => {
      console.error(error);
      return { ok: false };
    });
}

export async function updateCategory(data: Category) {
  const now = Date.now();

  try {
    await db.categories.update(data.id, {
      ...data,
      updatedAt: now,
      syncStatus: "pending",
    });

    return { ok: true };
  } catch (error) {
    console.error("Error updating category:", error);
    return { ok: false };
  }
}
