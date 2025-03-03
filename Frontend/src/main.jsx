import React from "react";
import ReactDOM from "react-dom/client"; // ✅ ใช้ createRoot แทน
import Navbar from "./components/Navbar/Navbar";
import GlobalEventProvider from "./context/GlobalEventContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root")); // ✅ ใช้ createRoot

root.render(
  <React.StrictMode>
    <GlobalEventProvider>
      <GoogleOAuthProvider clientId="1054484762553-vi888hr1qncq3v3ofrradfrff67t71dl.apps.googleusercontent.com">
        <App />
      </GoogleOAuthProvider>
    </GlobalEventProvider>
  </React.StrictMode>
);
