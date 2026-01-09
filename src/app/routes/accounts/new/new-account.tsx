import { TitleBar } from "@/components/ui/title-bar";
import { AddAccountForm } from "@/features/accounts";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";

export function NewAccount() {
  const navigate = useNavigate();

  function handleSuccess() {
    navigate(-1);
  }

  return (
    <motion.div
      initial={{ translateX: 300, opacity: 0 }}
      animate={{ translateX: 0, opacity: 1 }}
      exit={{ translateX: 300, opacity: 0 }}
      transition={{ type: "tween", duration: 0.2 }}
    >
      <TitleBar title="New account" isSubPage />

      <main className="mx-auto max-w-150 px-1 py-3">
        <AddAccountForm onSuccess={handleSuccess}>
          <h2> New </h2>
        </AddAccountForm>
      </main>
    </motion.div>
  );
}
