const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const {
  getAllHomes,
  getHomeById,
  createHome,
  updateHome,
  deleteHome,
  getImageHome,
  searchHomes,
} = require("../Controllers/HomeControllers");

const router = express.Router();

// กำหนดการจัดเก็บไฟล์
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = "uploads/homes";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // จำกัดขนาดไฟล์ 5MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("ไฟล์ที่อัปโหลดต้องเป็นรูปภาพเท่านั้น"));
    }
  },
});

// อัปโหลดรูปภาพ
router.post("/upload", upload.single("image"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "ไม่พบไฟล์รูปภาพ" });
    }
    const imageUrl = `/uploads/homes/${req.file.filename}`;
    res.json({ imageUrl });
  } catch (error) {
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ" });
  }
});

// CRUD operations สำหรับบ้าน
router.get("/", getAllHomes); // สำหรับดึงข้อมูลทั้งหมด
router.get("/search", searchHomes); // สำหรับค้นหาบ้านตามเงื่อนไข
router.get("/:id", getHomeById); // สำหรับดึงข้อมูลบ้านตาม ID
router.post("/", createHome);
router.put("/:id", updateHome);
router.delete("/:id", deleteHome);
router.get("/:id/images", getImageHome);

module.exports = router;
