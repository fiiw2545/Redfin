import React, { useState } from "react";
import { useGlobalEvent } from "../context/GlobalEventContext";

import Navbar from "../components/Navbar/Navbar";

const ChagePasswordPage = () => {
  const { windowSize } = useGlobalEvent();

  const isMobileView = windowSize.width < 980;

  return (
    <div style={styles.global}>
      <Navbar />
      <div style={styles.PageBody}>
        <div
          style={{
            ...styles.Card,
            padding: isMobileView ? "24px 32px" : "32px 32px",
          }}
        >
          <h1 style={styles.title}>Change Your Password</h1>
          <p style={styles.subtitle}>
            Update the password for:
            <br />
            {/* <strong>{mail || 'Loading...'}</strong> */}
            <strong>mail</strong>
          </p>

          <div style={styles.requirements}>
            <p>Password must include:</p>
            <ul style={styles.list}>
              <li>8 or more characters</li>
              <li>At least 1 letter</li>
              <li>At least 1 number</li>
              <li>At least 1 symbol (!#$&*?, etc.)</li>
            </ul>
          </div>
          <form style={styles.form}>
            <label htmlFor="old-password" style={styles.label}>
              Old Password:
            </label>
            <input
              id="old-password"
              type="password"
              // value={oldPassword}
              style={styles.input}
            />
            <label htmlFor="new-password" style={styles.label}>
              New Password:
            </label>
            <input
              id="new-password"
              type="password"
              // value={newPassword}
              style={styles.input}
            />
            <label htmlFor="re-enter-new-password" style={styles.label}>
              Re-enter New Password:
            </label>
            <input
              id="re-enter-new-password"
              type="password"
              // value={newPassword}
              style={styles.input}
            />
            <button type="submit" style={styles.submitButton}>
              Change Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const styles = {
  global: {
    fontFamily:
      '"Libre Franklin", -apple-system, BlinkMacSystemFont, Roboto, "Droid Sans", Helvetica, Arial, sans-serif',
    margin: 0,
    padding: 0,
    boxSizing: "border-box",
  },

  PageBody: {
    backgroundImage:
      "url(https://images.hdqwalls.com/download/sunset-at-st-mary-lake-glacier-national-park-5k-l3-1600x900.jpg)",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  },
  Card: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    maxWidth: "350px",
    width: "90%",
    textAlign: "center",
    boxSizing: "border-box",
  },
  label: {
    display: "block",
    fontSize: "14px",
    textAlign: "left",
    color: "#333333",
  },
  requirements: {
    textAlign: "left",
    fontSize: "14px",
    marginBottom: "20px",
  },
  list: {
    paddingLeft: "20px",
    lineHeight: "1.8",
  },
  title: {
    fontSize: "24px",
    fontWeight: "600",
    marginBottom: "10px",
    textAlign: "left",
  },
  subtitle: {
    fontSize: "16px",
    marginBottom: "20px",
    textAlign: "left",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },
  formGroup: {
    marginBottom: "10px",
  },
  input: {
    width: "100%",
    padding: "10px",
    fontSize: "14px",
    border: "1px solid #ccc",
    borderRadius: "2px",
  },
  submitButton: {
    backgroundColor: "#D32F2F",
    color: "#ffffff",
    padding: "10px",
    fontSize: "16px",
    border: "none",
    borderRadius: "2px",
    cursor: "pointer",
    fontWeight: "600",
    fontFamily:
      '"Libre Franklin", -apple-system, BlinkMacSystemFont, Roboto, "Droid Sans", Helvetica, Arial, sans-serif',
    marginTop: "20px",
  },
};

export default ChagePasswordPage;
