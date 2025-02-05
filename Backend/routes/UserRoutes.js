const express = require("express");
const multer = require("multer"); // นำเข้า multer เพียงครั้งเดียว

// ตั้งค่าการเก็บไฟล์ในหน่วยความจำ (memory storage)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const {
  registerUser,
  register2User,
  loginUser,
  logoutUser,
  resendEmail,
  setPassword,
  changePassword,
  verifyEmail,
  sendOTP,
  verifyOTP,
  passwordLogin,
  googleLogin,
  forgotPassword,
  getEmailFromToken,
  getEmailFromCookie,
  getinformation,
  getUser,
  checkEmail,
  updateProfilePicture,
  removeProfilePicture,
  updateProfile,
} = require("../Controllers/UserControllers"); // Import Controllers
const { authenticateToken } = require("../middleware/UserMiddleware");

const router = express.Router();

router.post("/register", registerUser); // Route สำหรับ Register
router.post("/register2", register2User); // Route สำหรับ Register
router.post("/login", loginUser); // Route สำหรับ Login
router.post("/logout", logoutUser); // Route สำหรับ Logout
router.get("/information", authenticateToken, getinformation); //ดึงข้อมูลผู้ใช้
router.post("/resend-email", resendEmail); // เส้นทางส่งอีเมลยืนยัน
router.post("/sendOTP", sendOTP); //เส้นทางยืนยันอีเมล
router.post("/verifyOTP", verifyOTP); //เส้นทางยืนยันอีเมล
router.post("/verify-email", verifyEmail); //เส้นทางยืนยันอีเมล
router.post("/passwordLogin", passwordLogin); //เส้นทางยืนยันอีเมล
router.post("/reset-password/:token", setPassword); // เส้นทางสร้างรหัสผ่าน
router.post("/change-password", changePassword); // เส้นทางเปลี่ยนรหัสผ่าน
router.post("/google-login", googleLogin); //เส้นทางสำหรับล็อคอินด้วยGoogle
router.post("/forgot-password", forgotPassword); // เส้นทางรีเซ็ตรหัสผ่าน
router.get("/email/:token", getEmailFromToken); // เส้นทางดึงอีเมล
router.get("/email", getEmailFromCookie); // เส้นทางดึงอีเมล
router.post("/check-email", checkEmail); //เช็คอีเมลในฐานข้อมูล
router.post(
  "/update-profile-picture",
  upload.single("profileImage"), // ใช้มิดเดิลแวร์นี้เพื่อจัดการกับการอัปโหลดไฟล์
  updateProfilePicture
); // Route สำหรับอัปเดตรูปภาพ
router.put("/update-profile-picture", removeProfilePicture); //ลบรูปภาพ
router.put("/update-profile", updateProfile); //อัพเดทในฐานข้อมูล

module.exports = router;
