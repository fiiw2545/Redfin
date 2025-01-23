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

  // ฟังก์ชันตรวจสอบความปลอดภัยของรหัสผ่าน
  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!#$&*?])[A-Za-z\d!#$&*?]{8,}$/;
    return passwordRegex.test(password);
  };

  // ฟังก์ชันจัดการเมื่อส่งฟอร์ม
  const handleSubmit = async (e) => {
    e.preventDefault(); // ป้องกันการ reload หน้าเว็บ

    // ตรวจสอบความปลอดภัยของรหัสผ่าน
    if (!validatePassword(password)) {
      setError(
        "Password must be at least 8 characters long, include a number, a special character, and a letter."
      );
      return;
    }

    // ตรวจสอบว่ารหัสผ่านทั้งสองตรงกัน
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setError(""); // ล้างข้อความ error ก่อนหน้า
    setIsLoading(true);

    try {
      const apiUrl = `http://localhost:5000/api/users/reset-password/${token}`;
      const response = await axios.post(apiUrl, { newPassword: password });

      // ถ้าสำเร็จ
      setSuccessMessage(response.data.message || "Password reset successful!");
      setTimeout(() => navigate("/login"), 3000); // นำทางไปหน้า login หลัง 3 วินาที
    } catch (error) {
      setError(error.response?.data?.message || "Error resetting password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto", textAlign: "center" }}>
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
            placeholder="Enter new password"
            required
          />
        </div>
        <div>
          <label>Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
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
