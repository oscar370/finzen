import { useAppStore } from "@/stores/use-app-store";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function Landing() {
  const isFirstSession = useAppStore((state) => state.isFirstSession);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isFirstSession) navigate("/home");
  }, [isFirstSession, navigate]);

  return <div>Landing</div>;
}
