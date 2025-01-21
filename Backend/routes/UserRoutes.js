const express = require("express");

const {
  registerUser,
  loginUser,
  verifyEmail,
  setPassword,
  googleLogin,
  forgotPassword,
} = require("../Controllers/UserControllers"); // Import Controllers
const { UserMiddleware } = require("../Middleware/UserMiddleware");

const router = express.Router();

router.post("/register", registerUser); // Route สำหรับ Register
router.post("/login", loginUser); // Route สำหรับ Login
router.get("/verify-email/:token", verifyEmail); // เส้นทางยืนยันอีเมล
router.post("/reset-password/:token", setPassword); // เส้นทางรีเซ็ตรหัสผ่าน
router.post("/google-login", googleLogin); //เส้นทางสำหรับล็อคอินด้วยGoogle
router.post("/forgot-password/:token", forgotPassword); // เส้นทางรีเซ็ตรหัสผ่าน

module.exports = router;
