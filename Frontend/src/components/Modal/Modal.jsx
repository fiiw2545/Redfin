import React, { useState, useEffect } from "react";
import "./Modal.css";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";

const Modal = ({ isOpen, onClose }) => {
  const [stepHistory, setStepHistory] = useState([1]); // History of modal steps
  const [email, setEmail] = useState(""); // User email
  const [password, setPassword] = useState("");
  const [userHasPassword, setUserHasPassword] = useState(true); // State to check if user has a password
  const [otp, setOtp] = useState(""); // เก็บค่าที่ผู้ใช้กรอก

  if (!isOpen) return null;

  const currentStep = stepHistory[stepHistory.length - 1];

  // ฟังก์ชันเปลี่ยนไปการ์ดใหม่ พร้อมเก็บเลขหน้าก่อนหน้า
  const changeStep = (newStep) => {
    setStepHistory([...stepHistory, newStep]);
  };

  const handleBack = () => {
    if (stepHistory.length > 1) {
      setStepHistory(stepHistory.slice(0, -1));
    }
  };

  const resetModal = () => {
    setStepHistory([1]);
    setEmail("");
    setUserHasPassword(false);
  };

  //เช็คอีเมลในฐานข้อมูล
  const handleEmailSubmit = async () => {
    if (!email) return alert("Please enter your email");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/users/check-email",
        { email }
      );
      console.log("Check Email Response:", res.data);

      if (res.data.exists) {
        setUserHasPassword(res.data.hasPassword);
        if (res.data.hasPassword) {
          changeStep(4); // ไปหน้าให้ใส่รหัสผ่าน
        } else {
          changeStep(2); // ไปหน้าใช้โค้ดยืนยัน
        }
      } else {
        // ถ้าไม่มีบัญชี -> สมัครสมาชิกโดยใช้ register API
        const registerRes = await axios.post(
          "http://localhost:5000/api/users/register2",
          { email }
        );

        console.log("Register Response:", registerRes.data);

        if (registerRes.status === 201) {
          alert(
            "Signup successful! Please check your email to set your password."
          );
          resetModal();
          onClose();
        }
      }
    } catch (error) {
      console.error("Error checking email:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  //ส่งOTP
  const handleOTPLogin = async () => {
    if (!email) {
      alert("Please enter your email first.");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/users/sendOTP", { email });
      alert(`OTP sent to ${email}! Please check your inbox.`);
    } catch (error) {
      console.error("Error sending OTP:", error);
      alert("Failed to send OTP. Please try again.");
    }
  };

  //ยืนยันOTPเพื่อเข้าระบบ
  const handleOTPSubmit = async () => {
    if (!otp) {
      alert("Please enter the OTP.");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/users/verifyOTP",
        { email, otp },
        { withCredentials: true } // ส่งและรับ Cookie
      );

      alert("OTP verified! Login successful.");
      window.location.href = "/"; // รีเฟรชเพื่อเข้าสู่ระบบ
    } catch (error) {
      console.error("Error verifying OTP:", error);
      alert("Invalid or expired OTP. Please try again.");
    }
  };

  //เข้าสู่ระบบด้วยพาสเวิร์ด
  const handlePasswordLogin = async () => {
    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/users/passwordLogin",
        {
          email,
          password,
        }
      );

      alert("Login successful!");
      localStorage.setItem("authToken", res.data.token); // เก็บ token ที่ได้จาก server
      window.location.href = "/"; // รีเฟรชหน้าเพื่อเข้าสู่ระบบ
    } catch (error) {
      console.error("Error logging in:", error);
      alert("Invalid email or password. Please try again.");
    }
  };

  //ลืมรหัสผ่าน
  const resetPassword = async () => {
    try {
      if (!email) {
        alert("Please enter your email address.");
        return;
      }

      const response = await axios.post(
        "http://localhost:5000/api/users/forgot-password",
        { email }
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

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSetPassword = () => changeStep(3);
  const handleForgotPassword = () => changeStep(5);

  const handleSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/users/google-login",
        { token: credentialResponse.credential }
      );

      if (res.status === 200) {
        localStorage.setItem("authToken", res.data.token);
        localStorage.setItem(
          "user",
          JSON.stringify({
            name: res.data.user.fullName,
            email: res.data.user.email,
            profileImage: res.data.user.profileImage || null,
          })
        );

        onClose();
        window.location.href = "/";
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
    alert("Google Sign-In Failed. Please try again.");
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button
          className="modal-close"
          onClick={() => {
            resetModal();
            onClose();
          }}
        >
          ×
        </button>

        {currentStep === 1 && ( //หน้าใส่Email
          <>
            <h2>Join or Sign In</h2>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleEmailSubmit();
                }
              }}
            />
            <button className="email-button" onClick={handleEmailSubmit}>
              Continue with Email
            </button>
            <div className="separator">
              <span>or</span>
            </div>
            <GoogleLogin
              onSuccess={handleSuccess}
              onError={handleError}
              useOneTap
              text="continue_with"
              size="large"
            />
            <p>
              By signing in you agree to Redfin's <a href="#">Terms of Use</a>{" "}
              and <a href="#">Privacy Policy</a>.
            </p>
          </>
        )}

        {currentStep === 2 && ( //เข้าด้วยOTP
          <>
            <h2>Sign in</h2>
            <p>
              We emailed you a temporary sign-in code. Please check your inbox.
            </p>
            <label htmlFor="six-digit-code">6-digit code</label>
            <input
              type="text"
              id="six-digit-code"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleOTPSubmit();
                }
              }}
            />
            <button className="email-button" onClick={handleOTPSubmit}>
              Continue
            </button>
            {!userHasPassword && (
              <button className="white-button" onClick={handleSetPassword}>
                Set a password instead
              </button>
            )}
            <button className="back-button" onClick={handleBack}>
              Back
            </button>
            <p>
              By signing in you agree to Redfin's <a href="#">Terms of Use</a>{" "}
              and <a href="#">Privacy Policy</a>.
            </p>
          </>
        )}

        {currentStep === 3 && (
          <>
            <h2>Welcome back</h2>
            <p>
              We will send you an email to set your password and sign into your
              account.
            </p>
            <button className="email-button">Set a password</button>
            <button className="white-button" onClick={() => changeStep(2)}>
              Sign in with a temporary code
            </button>
            <button className="back-button" onClick={handleBack}>
              Back
            </button>
            <p>
              By signing in you agree to Redfin's <a href="#">Terms of Use</a>{" "}
              and <a href="#">Privacy Policy</a>.
            </p>
          </>
        )}

        {currentStep === 4 && ( //เข้าด้วยรหัสผ่าน
          <>
            <h2>Sign In</h2>
            <input type="email" value={email} readOnly placeholder="Email" />
            <input
              id="password-input"
              type="password"
              placeholder="Password"
              value={password}
              onChange={handlePasswordChange}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handlePasswordLogin();
                }
              }}
            />

            <button className="forgot-password" onClick={handleForgotPassword}>
              Forgot Password?
            </button>
            <button className="email-button" onClick={handlePasswordLogin}>
              Continue with Email
            </button>
            <button
              className="white-button"
              onClick={async () => {
                await handleOTPLogin();
                changeStep(2);
              }}
            >
              Sign in with a temporary code
            </button>

            <button className="back-button" onClick={handleBack}>
              Back
            </button>
            <p>
              By signing in you agree to Redfin's <a href="#">Terms of Use</a>{" "}
              and <a href="#">Privacy Policy</a>.
            </p>
          </>
        )}

        {currentStep === 5 && ( //ลืมรหัสผ่าน
          <>
            <h2>Forgot Password?</h2>
            <p>
              We will send you an email to set your password and sign into your
              account.
            </p>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  resetPassword();
                }
              }}
            />
            <button className="email-button" onClick={resetPassword}>
              Reset Password
            </button>
            <button className="white-button" onClick={() => changeStep(2)}>
              Sign in with a temporary code
            </button>
            <button className="back-button" onClick={handleBack}>
              Back
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Modal;
