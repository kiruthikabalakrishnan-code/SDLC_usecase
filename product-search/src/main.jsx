import React from "react";
import { createRoot } from "react-dom/client";
import ProductSearchApp from "./ProductSearchApp.jsx";
import "./styles.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ProductSearchApp />
  </React.StrictMode>,
);
