import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./app/app.tsx";
import "./index.css";
import "./lib/i18n";

dayjs.extend(localizedFormat);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
