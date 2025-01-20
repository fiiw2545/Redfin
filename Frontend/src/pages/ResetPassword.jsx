import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const ResetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useParams(); // รับ token จาก URL
  const navigate = useNavigate();

  // ฟังก์ชันในการส่งคำขอตั้งรหัสผ่านใหม่
  const handleSubmit = async (e) => {
    e.preventDefault();

    // ตรวจสอบว่ารหัสผ่านทั้งสองตรงกันหรือไม่
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setIsLoading(true);
    try {
      // ส่งคำขอ POST ไปยัง API สำหรับการตั้งรหัสผ่าน
      const response = await axios.post(
        `/api/users/reset-password/${token}`, // URL API ที่ต้องการส่งคำขอไป
        { password } // ส่งรหัสผ่านใน request body
      );

      // ถ้าคำขอสำเร็จ
      if (response.status === 200) {
        setSuccessMessage("Password set successfully!");
        setTimeout(() => {
          navigate("/login"); // นำทางไปหน้า Login หลังจาก 3 วินาที
        }, 3000);
      }
    } catch (err) {
      // ถ้ามีข้อผิดพลาด
      setError(
        err.response?.data?.message ||
          "There was an error setting your password!"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2>Reset Password</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Setting password..." : "Set Password"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ResetPasswordPage;
