const express = require("express");

const {
  registerUser,
  loginUser,
  logoutUser,
  resendEmail,
  setPassword,
  googleLogin,
  forgotPassword,
  getEmailFromToken,
  getinformation,
} = require("../Controllers/UserControllers"); // Import Controllers
const { authenticateToken } = require("../Middleware/UserMiddleware");

const router = express.Router();

router.post("/register", registerUser); // Route สำหรับ Register
router.post("/login", loginUser); // Route สำหรับ Login
router.post("/logout", logoutUser); // Route สำหรับ Login
router.get("/information", authenticateToken, getinformation);
router.post("/resend-email", resendEmail); // เส้นทางยืนยันอีเมล
router.post("/reset-password/:token", setPassword); // เส้นทางสร้างรหัสผ่าน
router.post("/google-login", googleLogin); //เส้นทางสำหรับล็อคอินด้วยGoogle
router.post("/forgot-password", forgotPassword); // เส้นทางรีเซ็ตรหัสผ่าน
router.get("/email/:token", getEmailFromToken); // เส้นทางดึงอีเมล

module.exports = router;
