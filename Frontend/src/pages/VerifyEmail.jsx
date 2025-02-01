import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("Verifying...");

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        // ส่งคำขอไปที่ Backend เพื่อทำการ verify โดย cookie จะถูกแนบอัตโนมัติ
        const response = await axios.post(
          "http://localhost:5000/api/users/verify-email",
          {}, // ไม่มีข้อมูลเพิ่มเติมที่ต้องส่งใน body
          { withCredentials: true }
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
  }, [navigate]);

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h2>{message}</h2>
    </div>
  );
};

export default VerifyEmail;
