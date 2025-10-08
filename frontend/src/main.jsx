import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import UserContextChat from "./UserContextChat.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <StrictMode>
      <UserContextChat>
        <App />
        <ToastContainer
        position="top-left"
        hideProgressBar={true}
        autoClose={1000}
        theme="dark"
        toastStyle={{
          background: "#18181b",
          color: "#fafafa",
          borderRadius: "10px",
          fontWeight: "500",
          boxShadow: "0 4px 24px rgba(0,0,0,0.5)",
        }}
      />

      </UserContextChat>
    </StrictMode>
  </BrowserRouter>
);
