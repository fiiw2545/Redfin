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
import Test from "./pages/test";
import "./App.css";

import Favorites from "./pages/favorites";
import SavedSearches from "./pages/savedSearches";
import OpenHouseSchedule from "./pages/openHouseSchedule";
import Appointment from "./pages/appointments";
import YourAgent from "./pages/yourAgent";
import Offers from "./pages/offers";
import Reviews from "./pages/reviews";
import OwnerDashboard from "./pages/ownerDashboard";
import NotificationSettings from "./pages/notificationSettings";
import AccountSettings from "./pages/accountSettings";
import ChagePasswordPage from "./pages/changepassword";

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
        <Route path="/resetpassword/:token" element={<ResetPasswordPage />} />

        <Route path="/test" element={<Test />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/saved-searches" element={<SavedSearches />} />
        <Route path="/open-house-schedule" element={<OpenHouseSchedule />} />
        <Route path="/appointments" element={<Appointment />} />
        <Route path="/your-agent" element={<YourAgent />} />
        <Route path="/offers" element={<Offers />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/owner-dashboard" element={<OwnerDashboard />} />
        <Route
          path="/notification-settings"
          element={<NotificationSettings />}
        />
        <Route path="/account-settings" element={<AccountSettings />} />
        <Route path="/changepassword" element={<ChagePasswordPage />} />
      </Routes>
    </Router>
  );
};

export default App;
