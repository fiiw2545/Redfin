import React, { useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import "./styles/test.css";
import NavbarUser from "../components/NavbarUser/NavbarUser";
const OwnerDashboard = () => {
  return (
    <>
      <Navbar />
      <NavbarUser />
    </>
  );
};

export default OwnerDashboard;
