import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { installOnsiteEnhancements } from "./onsiteEnhancements";

createRoot(document.getElementById("root")!).render(<App />);

window.requestAnimationFrame(() => installOnsiteEnhancements());
