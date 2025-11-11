import "./index.css";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";

// 🌙 Load saved theme before rendering app
const savedTheme = localStorage.getItem("ecotrack-theme");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
  document.documentElement.classList.add("dark");
} else {
  document.documentElement.classList.remove("dark");
}

// ✅ Ensure body uses Tailwind background + text colors
document.body.classList.add("bg-background", "text-foreground");

// Render the app
createRoot(document.getElementById("root")!).render(<App />);
