import { db } from "@/lib/dexie";
import type { Category, CategoryDraft } from "@/types/categories";
import { useLiveQuery } from "dexie-react-hooks";

export const UNCATEGORIZED_ID = "uncategorized";

const DEFAULT_CATEGORIES: Partial<Category>[] = [
  {
    name: "labels.system",
    icon: "bolt",
    id: "system",
    color: "#6B7280",
  },
  {
    name: "labels.food",
    icon: "utensils",
    color: "#F59E0B",
  },
  {
    name: "labels.transport",
    icon: "car",
    color: "#3B82F6",
  },
  {
    name: "labels.housing",
    icon: "home",
    color: "#10B981",
  },
  {
    name: "labels.entertainment",
    icon: "gamepad",
    color: "#8B5CF6",
  },
  {
    name: "labels.health",
    icon: "heart",
    color: "#EF4444",
  },
  {
    name: "labels.shopping",
    icon: "shoppingBag",
    color: "#EC4899",
  },
  {
    name: "labels.salary",
    icon: "wallet",
    color: "#22C55E",
  },
  {
    name: "labels.investments",
    icon: "trendingUp",
    color: "#0EA5E9",
  },
  {
    name: "labels.gifts",
    icon: "gift",
    color: "#F97316",
  },
  {
    name: "labels.others",
    icon: "helpCircle",
    id: UNCATEGORIZED_ID,
    color: "#9CA3AF",
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
    color: cat.color!,
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

export function useAvailableCategories(
  year: number,
  month: number,
  selectedKind: "income" | "expense",
  excludeId?: string,
) {
  return (
    useLiveQuery(async () => {
      const [allCategories, currentBudgets] = await Promise.all([
        db.categories
          .where("archive")
          .equals(0)
          .filter((c) => c.id !== "system")
          .toArray(),
        db.budget
          .where("[year+month]")
          .equals([year, month])
          .filter((b) => b.deleted === 0 && b.kind === selectedKind)
          .toArray(),
      ]);

      const usedIds = new Set(currentBudgets.map((b) => b.categoryId));

      return allCategories.filter((cat) => {
        if (excludeId && cat.id === excludeId) return true;

        return !usedIds.has(cat.id);
      });
    }, [year, month, selectedKind, excludeId]) ?? []
  );
}

export function useArchivedCategories() {
  return (
    useLiveQuery(() =>
      db.categories.where("archive").equals(1).sortBy("name"),
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

export async function updateCategory(data: Category) {
  const now = Date.now();

  try {
    await db.transaction(
      "rw",
      [db.categories, db.budget, db.transactions],
      async () => {
        const oldCategory = await db.categories.get(data.id);

        if (!oldCategory) throw new Error("Category not found");

        const hasIconChanged = oldCategory.icon !== data.icon;
        const hasNameChanged = oldCategory.name !== data.name;

        await db.categories.put({
          ...data,
          updatedAt: now,
          syncStatus: "pending",
        });

        if (hasIconChanged || hasNameChanged) {
          await db.budget.where("categoryId").equals(data.id).modify({
            categoryName: data.name,
            categoryIcon: data.icon,
            updatedAt: now,
            syncStatus: "pending",
          });
        }

        if (hasIconChanged) {
          await db.transactions.where("categoryId").equals(data.id).modify({
            categoryIcon: data.icon,
            updatedAt: now,
            syncStatus: "pending",
          });
        }
      },
    );

    return { ok: true };
  } catch (error) {
    console.error("Error updating category and cascading changes:", error);
    return { ok: false };
  }
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

export async function unarchiveCategory(id: string) {
  if (id === UNCATEGORIZED_ID) return;

  return await db
    .transaction("rw", [db.categories], async () => {
      const category = await db.categories.get(id);
      if (!category) throw new Error("Category not found");

      await db.categories.update(id, {
        archive: 0,
        updatedAt: Date.now(),
        syncStatus: "pending",
      });

      return { ok: true };
    })
    .catch((error) => {
      console.error("Error unarchiving category:", error);
      return { ok: false };
    });
}
