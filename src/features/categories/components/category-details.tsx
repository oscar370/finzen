import { archiveCategory, UNCATEGORIZED_ID } from "@/api/categories";
import { ArchiveButton } from "@/components/ui/archive-button";
import { CloseButton } from "@/components/ui/close-button";
import { DescriptionRow } from "@/components/ui/description-row";
import { Group } from "@/components/ui/group";
import { Modal } from "@/components/ui/modal";
import { categoriesIcons } from "@/data/categories-icons";
import type { Category } from "@/types/categories";
import { t } from "i18next";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

type CategoryDetailsProps = {
  data: Category;
};

export function CategoryDetails({ data }: CategoryDetailsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const Icon = categoriesIcons[data.icon];

  function handleCloseModal() {
    setIsOpen(false);
  }

  async function handleArchive() {
    const result = await archiveCategory(data.id);

    if (!result?.ok) {
      toast.error(t("errors.archive", { ns: "categories" }));
      return;
    }

    toast.success(t("success.archive", { ns: "categories" }));
    navigate("/categories");
  }

  return (
    <>
      <Group
        title={t("titles.details", { ns: "categories" })}
        button={
          data.id !== UNCATEGORIZED_ID && (
            <ArchiveButton onClick={() => setIsOpen(true)}>
              {t("buttons.archive", { ns: "categories" })}
            </ArchiveButton>
          )
        }
      >
        <DescriptionRow label={t("fields.name", { ns: "categories" })}>
          {t(data.name, { ns: "categories" })}
        </DescriptionRow>
        <DescriptionRow label={t("fields.icon", { ns: "categories" })}>
          <Icon />
        </DescriptionRow>
      </Group>

      <Modal open={isOpen} onClose={handleCloseModal}>
        <div className="max-w-150 px-4 py-6">
          <h2 className="text-2xl"> Archive transaction? </h2>
          <p className="text-justify">
            It will no longer affect statistics and will disappear from all
            views.
          </p>

          <div className="mt-6 flex gap-4">
            <CloseButton onClick={handleCloseModal}> Cancel </CloseButton>
            <ArchiveButton onClick={handleArchive}> Archive </ArchiveButton>
          </div>
        </div>
      </Modal>
    </>
  );
}
