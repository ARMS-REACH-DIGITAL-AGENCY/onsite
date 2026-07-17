import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "./productionPolish.css";
import { installOnsiteEnhancements } from "./onsiteEnhancements";

const mobileCss = document.createElement("link");
mobileCss.rel = "stylesheet";
mobileCss.href = "/mobileCompatibility.css?v=20260716-final";
document.head.appendChild(mobileCss);

createRoot(document.getElementById("root")!).render(<App />);

window.requestAnimationFrame(() => installOnsiteEnhancements());
