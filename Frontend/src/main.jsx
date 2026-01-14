import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import { GoogleOAuthProvider } from "@react-oauth/google";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider
      clientId={
        import.meta.env.VITE_GOOGLE_CLIENT_ID ||
        "1003064918225-jhan7l8fu1s41vq4pt2ptugtulpggbc1.apps.googleusercontent.com"
      }
    >
      <App />
    </GoogleOAuthProvider>
  </StrictMode>
);
