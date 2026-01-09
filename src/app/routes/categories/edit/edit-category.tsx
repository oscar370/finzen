import { useCategoryById } from "@/api/categories";
import { TitleBar } from "@/components/ui/title-bar";
import { EditCategoryForm } from "@/features/categories";
import { t } from "i18next";
import { motion } from "motion/react";
import { useParams } from "react-router-dom";

export function EditCategory() {
  const { id } = useParams();
  const category = useCategoryById(id!);

  if (category)
    return (
      <>
        <motion.div
          initial={{ translateX: 300, opacity: 0 }}
          animate={{ translateX: 0, opacity: 1 }}
          exit={{ translateX: 300, opacity: 0 }}
          transition={{ type: "tween", duration: 0.2 }}
        >
          <TitleBar title={t(category.name, { ns: "categories" })} isSubPage />

          <main className="mx-auto max-w-150 px-1 py-3">
            <EditCategoryForm data={category} />
          </main>
        </motion.div>
      </>
    );
}
