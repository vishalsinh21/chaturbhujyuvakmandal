import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";  // <-- IMPORTANT: you should import from react-router-dom
import "./index.css";
import routermain from "./components/routes/Routes";
import { Toaster } from "react-hot-toast";  // <-- Move Toaster here

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <>
      <RouterProvider router={routermain} />
      <Toaster position="top-center" reverseOrder={false} />
    </>
  </StrictMode>
);