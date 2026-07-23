import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";

import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: "#0f172a",
            color: "#f1f5f9",
            border: "1px solid #1e293b",
            borderRadius: "12px",
            padding: "12px 16px",
            fontSize: "14px",
          },
          success: {
            iconTheme: { primary: "#6366f1", secondary: "#0f172a" },
          },
          error: {
            iconTheme: { primary: "#ef4444", secondary: "#0f172a" },
          },
        }}
      />
    </AuthProvider>
  </StrictMode>
);
