import { TitleBar } from "@/components/ui/title-bar";
import { AddCategoryForm } from "@/features/categories";
import { t } from "i18next";
import { motion } from "motion/react";

export function NewCategory() {
  return (
    <>
      <motion.div
        initial={{ translateX: 300, opacity: 0 }}
        animate={{ translateX: 0, opacity: 1 }}
        exit={{ translateX: 300, opacity: 0 }}
        transition={{ type: "tween", duration: 0.2 }}
      >
        <TitleBar
          title={t("titles.newCategory", { ns: "categories" })}
          isSubPage
        />

        <main className="mx-auto max-w-150 px-1 py-3">
          <AddCategoryForm />
        </main>
      </motion.div>
    </>
  );
}
