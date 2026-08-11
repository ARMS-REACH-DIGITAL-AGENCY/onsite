import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "./productionPolish.css";
import "./footerAndDrawerFix.css";
import { installOnsiteEnhancements } from "./onsiteEnhancements";
import { applyOfficialOnsiteTheme } from "./corporateTheme";
import { applyExecutionFixes } from "./executionFixes";

createRoot(document.getElementById("root")!).render(<App />);

window.requestAnimationFrame(() => {
  installOnsiteEnhancements();

  document.getElementById("onsite-mobile-compatibility-css")?.remove();
  const mobileCss = document.createElement("link");
  mobileCss.id = "onsite-mobile-compatibility-css";
  mobileCss.rel = "stylesheet";
  mobileCss.href = "/mobileCompatibility.css?v=20260726-final3";
  document.head.appendChild(mobileCss);

  document.getElementById("onsite-corporate-theme-css")?.remove();
  const corporateTheme = document.createElement("link");
  corporateTheme.id = "onsite-corporate-theme-css";
  corporateTheme.rel = "stylesheet";
  corporateTheme.href = "/corporateTheme.css?v=20260811-exec3";
  document.head.appendChild(corporateTheme);

  document.getElementById("onsite-execution-fixes-css")?.remove();
  const executionFixes = document.createElement("link");
  executionFixes.id = "onsite-execution-fixes-css";
  executionFixes.rel = "stylesheet";
  executionFixes.href = "/executionFixes.css?v=20260811-exec3";
  document.head.appendChild(executionFixes);

  applyOfficialOnsiteTheme();
  applyExecutionFixes();
});
