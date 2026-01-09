import { Button } from "@/components/ui/button";
import { t } from "i18next";
import { useNavigate } from "react-router-dom";

export function AllAccountsButton() {
  const navigate = useNavigate();

  return (
    <Button
      variant="flat"
      className="flex items-center justify-center gap-0.5 text-sm"
      onClick={() => navigate("/accounts")}
    >
      <span> {t("list.navigation", { ns: "accounts" })} </span>

      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="16px"
        viewBox="0 0 16 16"
        width="16px"
      >
        <path
          d="m 7.707031 12.707031 l 4 -4 c 0.390625 -0.390625 0.390625 -1.023437 0 -1.414062 l -4 -4 c -0.390625 -0.390625 -1.023437 -0.390625 -1.414062 0 s -0.390625 1.023437 0 1.414062 l 3.292969 3.292969 l -3.292969 3.292969 c -0.390625 0.390625 -0.390625 1.023437 0 1.414062 s 1.023437 0.390625 1.414062 0 z m 0 0"
          fill="currentColor"
          fillRule="evenodd"
        />
      </svg>
    </Button>
  );
}
