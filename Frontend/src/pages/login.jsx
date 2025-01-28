import React, { useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import { useNavigate } from "react-router-dom";

import googleIcon from "../img/google-icon.png";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";

import { useGlobalEvent } from "../context/GlobalEventContext";

const LoginPage = () => {
  const { windowSize } = useGlobalEvent();
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();
  const [activeCard, setActiveCard] = useState("signIn");

  //Google
  const handleSuccess = async (response) => {
    try {
      // ส่ง Token ไป Backend เพื่อทำ Authentication
      const res = await axios.post(
        "http://localhost:5000/api/users/google-login",
        {
          token: response.credential, // ส่ง Google Token ไป Backend
        }
      );

      if (res.status === 200) {
        // เก็บข้อมูลที่ได้จาก Backend ลง localStorage
        localStorage.setItem("authToken", res.data.token);
        localStorage.setItem(
          "user",
          JSON.stringify({
            name: res.data.user.name,
            email: res.data.user.email,
            profileImage: res.data.user.profileImage || null,
          })
        );

        // Redirect ไปหน้า /
        navigate("/");
      }
    } catch (error) {
      console.error(
        "Google Login Error:",
        error.response?.data || error.message
      );
      alert("Failed to sign in with Google. Please try again.");
    }
  };

  const handleError = () => {
    console.error("Google Sign-In Failed");
  };

  // State สำหรับ Sign-Up
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  //สำหรับ Login
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  //ส่งข้อมูลการสมัครให้backend
  const handleSignUpSubmit = async (e) => {
    e.preventDefault();

    try {
      // Connect to backend for sign-up
      const response = await axios.post(
        "http://localhost:5000/api/users/register",
        formData
      );
      alert(response.data.message); // Display success message
    } catch (error) {
      alert(error.response?.data?.message || "An error occurred!"); // Display error message
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    console.log("Login Submit Triggered");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/login",
        loginData,
        { withCredentials: true }
      );

      if (response.status === 200) {
        alert(`Login successful!`);

        navigate("/"); // ไปยังหน้า HomePage หรือหน้าอื่น ๆ
        return;
      }
    } catch (error) {
      console.error("Error caught in catch block:", error);

      if (axios.isAxiosError(error)) {
        console.error("Axios Error Details:", error.response);
        alert(error.response?.data?.message || "An error occurred!");
      } else {
        console.error("Unexpected Error Details:", error);
        alert("Unexpected error. Please try again later!");
      }
    }
  };

  // ลืมรหัสผ่าน
  const handleResetPassword = async (e) => {
    e.preventDefault();
    const email = e.target.email.value; // รับ email จาก input

    try {
      // เรียก API โดยไม่ต้องใช้ token ใน URL
      const response = await axios.post(
        `http://localhost:5000/api/users/forgot-password`, // แก้ไขเส้นทางไม่ใส่ :token
        { email } // ส่งอีเมลใน body
      );

      if (response.status === 200) {
        alert("A password reset email has been sent!");
      } else {
        alert(response.data.message || "Failed to send reset email.");
      }
    } catch (error) {
      console.error("Error:", error);
      if (error.response && error.response.data) {
        alert(error.response.data.message || "Failed to send reset email.");
      } else {
        alert("Something went wrong. Please try again.");
      }
    }
  };

  const toggleSignUp = () => {
    setIsSignUp(!isSignUp);
  };

  const isMobileView = windowSize.width < 980;

  const handleSwitchCard = (card) => {
    setActiveCard(card); // เปลี่ยนการ์ดที่ต้องการแสดง
  };

  return (
    <div style={styles.global}>
      <Navbar />
      <div style={styles.PageBody}>
        <div
          style={{
            ...styles.LoginCard,
            padding: isMobileView ? "24px 32px" : "32px 64px",
          }}
        >
          {activeCard === "signIn" && (
            // การ์ด Sign in
            <>
              <h1 style={styles.title}>Sign in</h1>
              <p style={styles.subtitle}>
                Need an account?{" "}
                <a
                  href="#"
                  style={styles.link}
                  onClick={(e) => {
                    e.preventDefault();
                    handleSwitchCard("signUp"); // สลับไปที่การสมัครสมาชิก
                  }}
                >
                  Join Redfin
                </a>
              </p>

              <div style={styles.socialButtons}>
                <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
              </div>

              <form style={styles.form} onSubmit={handleLoginSubmit}>
                <div style={styles.formGroup}>
                  <label htmlFor="email" style={styles.label}>
                    Email Address:
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    style={styles.input}
                    value={loginData.email} // เพิ่มการกำหนด value
                    onChange={(e) =>
                      setLoginData({ ...loginData, email: e.target.value })
                    }
                    required
                  />
                </div>
                <a
                  href="#"
                  style={styles.forgotLink}
                  onClick={(e) => {
                    e.preventDefault();
                    handleSwitchCard("forgotPassword"); // สลับไปที่การ์ด Forgot Password
                  }}
                >
                  Forgot?
                </a>
                <div style={styles.formGroup}>
                  <label htmlFor="password" style={styles.label}>
                    Password:
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    style={styles.input}
                    value={loginData.password} // เพิ่มการกำหนด value
                    onChange={(e) =>
                      setLoginData({ ...loginData, password: e.target.value })
                    }
                    required
                  />
                </div>
                <button type="submit" style={styles.submitButton}>
                  Sign In
                </button>
              </form>
              <p style={styles.terms}>
                By signing in you agree to Redfin's{" "}
                <a href="/terms" style={styles.link}>
                  Terms
                </a>{" "}
                and{" "}
                <a href="/privacy" style={styles.link}>
                  Privacy
                </a>
                .
              </p>
            </>
          )}
          {activeCard === "signUp" && (
            // Sign-up Card
            <>
              <h1 style={styles.title}>Join Redfin</h1>
              <p style={styles.subtitle}>
                Have an account?{" "}
                <a
                  href="#"
                  style={styles.link}
                  onClick={(e) => {
                    e.preventDefault();
                    handleSwitchCard("signIn"); // สลับกลับไปที่การเข้าสู่ระบบ
                  }}
                >
                  Sign in
                </a>
              </p>

              <div style={styles.socialButtons}>
                <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
              </div>

              <form style={styles.form} onSubmit={handleSignUpSubmit}>
                <div style={styles.formGroup}>
                  <label htmlFor="firstName" style={styles.label}>
                    FirstName:
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    style={styles.input}
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div style={styles.formGroup}>
                  <label htmlFor="lastName" style={styles.label}>
                    Last Name:
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    style={styles.input}
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div style={styles.formGroup}>
                  <label htmlFor="email" style={styles.label}>
                    Email Address:
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    style={styles.input}
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <button type="submit" style={styles.submitButton}>
                  Join Redfin
                </button>
              </form>
              <p style={styles.terms}>
                By signing up you agree to Redfin's{" "}
                <a href="/terms" style={styles.link}>
                  Terms
                </a>{" "}
                and{" "}
                <a href="/privacy" style={styles.link}>
                  Privacy
                </a>
                .
              </p>
            </>
          )}

          {activeCard === "forgotPassword" && (
            // การ์ดลืมรหัสผ่าน
            <>
              <h1 style={styles.title}>Forgot Password</h1>
              <p style={styles.subtitle}>
                Need an account?{" "}
                <a
                  href="#"
                  style={styles.link}
                  onClick={(e) => {
                    e.preventDefault();
                    handleSwitchCard("signIn");
                  }}
                >
                  Join Redfin
                </a>
              </p>

              {/* ปุ่มโซเชียล */}
              <div style={styles.socialButtons}>
                <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
              </div>

              <form style={styles.form} onSubmit={handleResetPassword}>
                <div style={styles.formGroup}>
                  <label htmlFor="email" style={styles.label}>
                    Email Address:
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    style={styles.input}
                    required
                  />
                </div>
                <p style={styles.subtitleforgot}>
                  {" "}
                  <a
                    href="#"
                    style={styles.link}
                    onClick={(e) => {
                      e.preventDefault();
                      handleSwitchCard("signIn");
                    }}
                  >
                    Have a password?
                  </a>
                </p>
                <button type="submit" style={styles.submitButton}>
                  Reset Password
                </button>
              </form>

              <p style={styles.terms}>
                By signing up you agree to Redfin's{" "}
                <a href="/terms" style={styles.link}>
                  Terms
                </a>{" "}
                and{" "}
                <a href="/privacy" style={styles.link}>
                  Privacy
                </a>
                .
              </p>
            </>
          )}
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
  LoginCard: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    maxWidth: "500px",
    width: "90%",
    textAlign: "center",
    boxSizing: "border-box",
  },
  title: {
    fontSize: "36px",
    fontWeight: "600",
    marginBottom: "10px",
    textAlign: "left",
  },
  subtitle: {
    fontSize: "16px",
    marginBottom: "20px",
    textAlign: "left",
  },
  subtitleforgot: {
    fontSize: "14px",
    marginBottom: "10px",
    textAlign: "left",
  },
  link: {
    color: "#1080A2",
    textDecoration: "none",
  },
  socialButtons: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginBottom: "20px",
  },
  socialButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "2px",
    cursor: "pointer",
    backgroundColor: "#fff",
    fontSize: "16px",
    gap: "20px",
    color: "#585858",
    fontWeight: "600",
    fontFamily:
      '"Libre Franklin", -apple-system, BlinkMacSystemFont, Roboto, "Droid Sans", Helvetica, Arial, sans-serif',
  },
  icon: {
    width: "20px",
    marginRight: "10px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  formGroup: {
    marginBottom: "10px",
  },
  label: {
    display: "block",
    fontSize: "14px",
    marginBottom: "5px",
    textAlign: "left",
    color: "#333333",
  },
  input: {
    width: "100%",
    padding: "10px",
    fontSize: "14px",
    border: "1px solid #ccc",
    borderRadius: "2px",
  },
  forgotLink: {
    alignSelf: "flex-start",
    fontSize: "14px",
    color: "#1080A2",
    textDecoration: "none",
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
  },
  terms: {
    fontSize: "12px",
    color: "#333333",
    marginTop: "20px",
    textAlign: "left",
  },
};

export default LoginPage;
