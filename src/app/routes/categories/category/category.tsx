import { useCategoryById } from "@/api/categories";
import { Button } from "@/components/ui/button";
import { TitleBar } from "@/components/ui/title-bar";
import { CategoryDetails } from "@/features/categories";
import { t } from "i18next";
import { motion } from "motion/react";
import { useNavigate, useParams } from "react-router-dom";

export function Category() {
  const { id } = useParams();
  const category = useCategoryById(id!);
  const navigate = useNavigate();

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

          <main className="mx-auto max-w-150 space-y-3 px-1 py-3">
            <CategoryDetails data={category} />

            <div
              className="flex justify-center"
              onClick={() => navigate(`/categories/edit/${id}`)}
            >
              <Button>{t("buttons.edit", { ns: "categories" })}</Button>
            </div>
          </main>
        </motion.div>
      </>
    );
}
