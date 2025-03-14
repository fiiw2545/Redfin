import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie"; // ใช้ดึง token จาก cookies
import { useGlobalEvent } from "../context/GlobalEventContext";
import Navbar from "../components/Navbar/Navbar";

const ChangePasswordPage = () => {
  const { windowSize } = useGlobalEvent();
  const isMobileView = windowSize.width < 980;
  // State สำหรับข้อมูลฟอร์ม
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  // ✅ ฟังก์ชันสำหรับดึงอีเมลจาก backend
  useEffect(() => {
    const fetchEmail = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/users/email",
          {
            withCredentials: true, // ✅ ให้ Axios ส่ง Cookies ไปด้วย
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
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/change-password",
        { oldPassword, newPassword, confirmPassword },
        { withCredentials: true }
      );

      setMessage(response.data.message);
      setTimeout(() => navigate("/account"), 2000); // ✅ เปลี่ยนหน้าหลังจากเปลี่ยนรหัสผ่านสำเร็จ
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong");
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
          <h1 style={styles.title}>Change Your Password</h1>
          <p style={styles.subtitle}>
            Update the password for: <br />
            <strong>{email || "Loading..."}</strong>
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

          <form onSubmit={handleSubmit} style={styles.form}>
            {message && <p style={{ color: "red" }}>{message}</p>}

            <label htmlFor="old-password" style={styles.label}>
              Old Password:
            </label>
            <input
              id="old-password"
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              style={styles.input}
            />

            <label htmlFor="new-password" style={styles.label}>
              New Password:
            </label>
            <input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              style={styles.input}
            />

            <label htmlFor="re-enter-new-password" style={styles.label}>
              Re-enter New Password:
            </label>
            <input
              id="re-enter-new-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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

export default ChangePasswordPage;
