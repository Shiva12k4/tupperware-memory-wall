import { StrictMode, location } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";

import { useEffect } from "react";

if (window.location.href.includes("ensrise.xyz")) {
  window.location.replace("https://memory-wall.tupperwarebrands.com.my");
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
