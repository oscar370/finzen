import { archiveCategory, unarchiveCategory } from "@/api/categories";
import { ActionRow } from "@/components/ui/action-row";
import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { ButtonRow } from "@/components/ui/button-row";
import { ListBox } from "@/components/ui/list-box";
import { modal } from "@/components/ui/modal-manager";
import { categoriesIcons } from "@/data/categories-icons";
import type { Category } from "@/types/categories";
import { Archive, ArchiveRestore, Pencil } from "lucide-react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

type CategoryDetailsProps = {
  category: Category;
};

export function CategoryDetails({ category }: CategoryDetailsProps) {
  const { t } = useTranslation("categories");
  const navigate = useNavigate();
  const Icon = categoriesIcons[category.icon];

  async function handleArchive() {
    const result = await archiveCategory(category.id);

    if (!result?.ok) {
      toast.error(t("errors.archive"));
      return;
    }

    modal.close();
    toast.success(t("success.archive"));

    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
      return;
    }

    navigate("..", { replace: true });
  }

  function handleOpenArchiveModal() {
    modal.open(
      t("modal.title"),
      <>
        <p className="text-center font-bold"> {t("modal.message")} </p>

        <ListBox>
          <ButtonRow variant="destructive" onClick={handleArchive}>
            {t("modal.button")}
          </ButtonRow>
        </ListBox>
      </>,
    );
  }

  async function handleUnarchive() {
    const result = await unarchiveCategory(category.id);

    if (!result?.ok) {
      toast.error(t("errors.unarchive"));
      return;
    }

    modal.close();
    toast.success(t("success.unarchive"));

    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
      return;
    }

    navigate("..", { replace: true });
  }

  function handleOpenUnarchiveModal() {
    modal.open(
      t("modalUnarchive.title"),
      <>
        <p className="text-center font-bold"> {t("modalUnarchive.message")} </p>

        <ListBox>
          <ButtonRow variant="suggested" onClick={handleUnarchive}>
            {t("modalUnarchive.button")}
          </ButtonRow>
        </ListBox>
      </>,
    );
  }

  return (
    <ListBox
      title={t("titles.details")}
      headerButton={
        <Box linked>
          {category.archive === 1 ? (
            <Button
              aria-label={t("buttons.unarchive")}
              onClick={handleOpenUnarchiveModal}
            >
              <ArchiveRestore />
            </Button>
          ) : (
            <>
              <Button
                aria-label={t("buttons.edit")}
                role="link"
                onClick={() => navigate(`/categories/edit/${category.id}`)}
              >
                <Pencil size={18} />
              </Button>

              <Button
                aria-label={t("buttons.archive")}
                variant="destructive"
                onClick={handleOpenArchiveModal}
              >
                <Archive size={18} />
              </Button>
            </>
          )}
        </Box>
      }
    >
      <ActionRow
        title={t("fields.name")}
        subtitle={t(category.name)}
        property
      />

      <ActionRow
        title={t("fields.icon")}
        subtitle={<Icon aria-hidden="false" aria-label={category.icon} />}
        property
      />

      <ActionRow
        title={t("fields.color")}
        subtitle={
          <div
            className={`mb-1 aspect-square max-w-10 rounded-sm`}
            style={{ backgroundColor: category.color }}
          ></div>
        }
        property
      />
    </ListBox>
  );
}
