import React from "react";
import { Link, useLocation } from "react-router-dom";

const NavbarUser = () => {
  const location = useLocation(); // ใช้สำหรับดึง URL ปัจจุบัน

  const pages = [
    { id: "favorites", label: "Favorites", path: "/favorites" },
    { id: "saved-searches", label: "Saved Searches", path: "/saved-searches" },
    {
      id: "open-house-schedule",
      label: "Open House Schedule",
      path: "/open-house-schedule",
    },
    { id: "appointments", label: "Appointments", path: "/appointments" },
    { id: "your-agent", label: "Your Agent", path: "/your-agent" },
    { id: "offers", label: "Offers", path: "/offers" },
    { id: "reviews", label: "Reviews", path: "/reviews" },
    {
      id: "owner-dashboard",
      label: "Owner Dashboard",
      path: "/owner-dashboard",
    },
    {
      id: "notification-settings",
      label: "Notification Settings",
      path: "/notification-settings",
    },
    {
      id: "account-settings",
      label: "Account Settings",
      path: "/account-settings",
    },
  ];

  return (
    <div style={styles.container}>
      {pages.map((page) => (
        <Link
          to={page.path}
          key={page.id}
          style={{
            ...styles.pageItem,
            ...(location.pathname === page.path ? styles.pageItemActive : {}),
          }}
        >
          {page.label}
          {location.pathname === page.path && (
            <div style={styles.activeIndicator}></div>
          )}
        </Link>
      ))}
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    gap: "30px",
    backgroundColor: "#fff",
    padding: "15px 25px",
    boxShadow: "0px 2px 2px rgba(0, 0, 0, 0.1)",
    position: "relative",
  },
  pageItem: {
    fontSize: "14px",
    color: "#585858",
    cursor: "pointer",
    position: "relative",
    fontWeight: "normal",
    textDecoration: "none",
  },
  pageItemActive: {
    fontWeight: "bold",
  },
  activeIndicator: {
    position: "absolute",
    bottom: "-16px",
    left: "0",
    width: "100%",
    height: "2.5px",
    backgroundColor: "black",
  },
};

export default NavbarUser;
