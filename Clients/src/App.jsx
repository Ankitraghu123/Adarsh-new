// src/App.js
import React, { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import MyModal from "./Components/global/MyModal";
import { useModal } from "./Components/global/ModalContext";

const App = () => {
  const { openModal } = useModal();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.altKey && e.key.toLowerCase() === "a") {
        e.preventDefault();
        openModal();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [openModal]);

  return (
    <BrowserRouter>
      <AppRoutes />
      <MyModal />
    </BrowserRouter>
  );
};

export default App;
