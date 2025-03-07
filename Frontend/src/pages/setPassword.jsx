import React, { useState, useEffect } from "react";
import { useGlobalEvent } from "../context/GlobalEventContext";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar/Navbar";

const SetPasswordPage = () => {
  const { windowSize } = useGlobalEvent();
  const isMobileView = windowSize.width < 980;

  const { token } = useParams(); // ดึง token จาก URL
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("Loading..."); // เพิ่ม state สำหรับอีเมล

  // ฟังก์ชันสำหรับดึงอีเมลจาก backend
  useEffect(() => {
    const fetchEmail = async () => {
      if (!token) {
        console.error("Token is missing or undefined.");
        setEmail("Unknown User");
        return;
      }

      console.log("Token:", token);
      try {
        const response = await axios.get(
          `http://localhost:5000/api/users/email/${token}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // ใช้ token เป็น Bearer token
            },
          }
        );
        setEmail(response.data.email || "Unknown User");
      } catch (error) {
        console.error(
          "Error fetching email:",
          error.response?.data || error.message
        );
        setEmail("Unknown User");
      }
    };

    fetchEmail();
  }, [token]); // useEffect จะทำงานเมื่อ token เปลี่ยนค่า

  // ตรวจสอบความถูกต้องของ Password
  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!#$&*?])[A-Za-z\d!#$&*?]{8,}$/;
    return passwordRegex.test(password);
  };

  // ฟังก์ชัน Reset Password
  const resetPassword = async () => {
    if (!validatePassword(newPassword)) {
      setMessage("Password does not meet requirements!");
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }

    try {
      const apiUrl = `http://localhost:5000/api/users/reset-password/${token}`;
      const response = await axios.post(apiUrl, { newPassword });
      setMessage(response.data.message || "Password reset successful!");
    } catch (error) {
      console.error("Error response:", error.response);
      setMessage(error.response?.data?.message || "Error resetting password.");
    }
  };

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
          <h1 style={styles.title}>Set Your Password</h1>
          {message && (
            <p
              style={{
                color: message.includes("successful") ? "green" : "red",
              }}
            >
              {message}
            </p>
          )}
          <p>
            Update the password for <strong>{email}</strong>
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
            <input
              type="password"
              placeholder="New Password"
              style={styles.input}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              style={styles.input}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              type="button"
              style={styles.submitButton}
              onClick={resetPassword}
            >
              Set Password
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
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
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
  },
};

export default SetPasswordPage;
