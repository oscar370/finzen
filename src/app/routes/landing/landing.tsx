import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function Landing() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/welcome");
  });

  return (
    <>
      <h1>Hi</h1>
    </>
  );
}
