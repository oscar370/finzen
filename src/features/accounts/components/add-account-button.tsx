import { Button } from "@/components/ui/button";
import { t } from "i18next";
import { useNavigate } from "react-router-dom";

export function AddAccountButton() {
  const navigate = useNavigate();

  return (
    <Button
      className="flex items-center justify-center gap-0.5 font-bold"
      onClick={() => navigate("/accounts/new")}
    >
      <svg
        className="-translate-y-3"
        xmlns="http://www.w3.org/2000/svg"
        height="16px"
        viewBox="0 0 16 16"
        width="16px"
      >
        <path
          d="m 7 3 v 4 h -4 v 2 h 4 v 4 h 2 v -4 h 4 v -2 h -4 v -4 z m 0 0"
          fill="currentColor"
        />
      </svg>

      <span> {t("buttons.add", { ns: "accounts" })} </span>
    </Button>
  );
}
