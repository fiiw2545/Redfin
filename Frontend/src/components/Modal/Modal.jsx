import React from "react";
import "./Modal.css";
import googleIcon from "../../img/google-icon.png";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";

const Modal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  // ฟังก์ชันจัดการเมื่อ Google Login สำเร็จ
  const handleSuccess = async (credentialResponse) => {
    try {
      // ส่ง Token ไปยัง Backend
      const res = await axios.post(
        "http://localhost:5000/api/users/google-login",
        {
          token: credentialResponse.credential,
        }
      );

      if (res.status === 200) {
        // เก็บข้อมูลใน localStorage
        localStorage.setItem("authToken", res.data.token);
        localStorage.setItem(
          "user",
          JSON.stringify({
            name: res.data.user.fullName,
            email: res.data.user.email,
            profileImage: res.data.user.profileImage || null,
          })
        );

        // ปิด Modal
        onClose();

        // Redirect ไปหน้าอื่น (ถ้าจำเป็น)
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

  // ฟังก์ชันจัดการเมื่อ Google Login ล้มเหลว
  const handleError = () => {
    console.error("Google Sign-In Failed");
    alert("Google Sign-In Failed. Please try again.");
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          ×
        </button>
        <h2>Join or Sign In</h2>

        {/* ช่องกรอก Email */}
        <input type="email" placeholder="Email" />
        <button className="email-button">Continue with Email</button>

        {/* ตัวแบ่งระหว่างตัวเลือก */}
        <div className="separator">
          <span>or</span>
        </div>

        {/* ปุ่มโซเชียล */}
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={handleError}
          useOneTap // ตัวเลือก One Tap Login
          text="continue_with"
          size="large"
        />

        {/* ลิงก์ยินยอม */}
        <p>
          By signing in you agree to Redfin's <a href="#">Terms of Use</a> and{" "}
          <a href="#">Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
};

export default Modal;
