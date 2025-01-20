// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Buy from "./pages/buy";
import Agent from "./pages/agent";
import LoginPage from "./pages/login";
import Housesforsale from "./pages/Houseforsale";
import SetPasswordPage from "./pages/setPassword";
import ResetPasswordPage from "./pages/ResetPassword";
import "./App.css";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/buy" element={<Buy />} />
        <Route path="/Agent" element={<Agent />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/houses-for-sale" element={<Housesforsale />} />
        <Route path="/set-password/:token" element={<SetPasswordPage />} />
        <Route path="/resetpassword" element={<ResetPasswordPage />} />
      </Routes>
    </Router>
  );
};

export default App;
