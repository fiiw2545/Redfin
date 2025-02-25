const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const Home = require("../schema/HomeSchema");
// ✅ API เพิ่มบ้านใหม่
// ตั้งค่าที่เก็บไฟล์ (เก็บไว้ในโฟลเดอร์ uploads/)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // เก็บไฟล์ไว้ที่โฟลเดอร์นี้
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // ตั้งชื่อไฟล์ให้ไม่ซ้ำ
  },
});

// ตั้งค่า Multer
const upload = multer({ storage: storage });

// ✅ API อัปโหลดรูปภาพ
router.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  res.json({ imageUrl: `/uploads/${req.file.filename}` }); // ส่ง URL ไฟล์กลับไป
});

// ✅ API เพิ่มบ้าน (รองรับอัปโหลดรูป)
router.post("/", async (req, res) => {
  try {
    const newHome = new Home(req.body);
    const savedHome = await newHome.save();
    res.status(201).json(savedHome);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
