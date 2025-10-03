import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import UserContextChat from "./UserContextChat.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <StrictMode>
      <UserContextChat>
        <App />
      </UserContextChat>
    </StrictMode>
  </BrowserRouter>
);
