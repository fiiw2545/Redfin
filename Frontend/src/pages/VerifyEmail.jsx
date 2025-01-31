import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios"; // ใช้ axios โดยตรง

const VerifyEmail = () => {
  const navigate = useNavigate();
  const { token } = useParams(); // ดึง token จาก URL
  const [message, setMessage] = useState("Verifying...");

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        // ส่งคำขอไปที่ Backend สำหรับการยืนยันอีเมล
        const response = await axios.post(
          `http://localhost:5000/api/users/verify-email/${token}`, // ส่ง token จาก URL ที่อยู่ใน params
          {},
          { withCredentials: true } // ส่ง Cookies ไปพร้อมกับคำขอ
        );

        if (response.status === 200) {
          setMessage("✅ Email verified successfully! Redirecting...");
          setTimeout(() => navigate("/login"), 3000);
        }
      } catch (error) {
        setMessage("❌ Verification failed. Please try again.");
      }
    };

    verifyEmail();
  }, [navigate, token]);

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h2>{message}</h2>
    </div>
  );
};

export default VerifyEmail;
