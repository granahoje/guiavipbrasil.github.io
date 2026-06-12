import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const redirectUrl = sessionStorage.getItem("redirect");

if (redirectUrl) {
  sessionStorage.removeItem("redirect");

  try {
    const originalUrl = new URL(redirectUrl);
    const restoredPath = `${originalUrl.pathname}${originalUrl.search}${originalUrl.hash}`;

    if (restoredPath && restoredPath !== window.location.pathname) {
      window.history.replaceState(null, "", restoredPath);
    }
  } catch (error) {
    console.warn("Não foi possível restaurar a rota original:", error);
  }
}

createRoot(document.getElementById("root")!).render(<App />);
