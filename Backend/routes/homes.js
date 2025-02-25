const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Home = require('../models/Home');
const auth = require('../middleware/auth');

// กำหนดการจัดเก็บไฟล์
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = 'uploads/homes';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // จำกัดขนาดไฟล์ 5MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('ไฟล์ที่อัปโหลดต้องเป็นรูปภาพเท่านั้น'));
    }
  }
});

// อัปโหลดรูปภาพ
router.post('/upload', auth, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'ไม่พบไฟล์รูปภาพ' });
    }
    const imageUrl = `/uploads/homes/${req.file.filename}`;
    res.json({ imageUrl });
  } catch (error) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ' });
  }
});

// เพิ่มข้อมูลบ้าน
router.post('/', auth, async (req, res) => {
  try {
    const newHome = new Home({
      ...req.body,
      user: req.user.id // เพิ่ม user ID จาก auth middleware
    });
    
    await newHome.save();
    res.status(201).json(newHome);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ดึงข้อมูลบ้านทั้งหมด
router.get('/', async (req, res) => {
  try {
    const homes = await Home.find().populate('user', 'firstName lastName');
    res.json(homes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ดึงข้อมูลบ้านตาม ID
router.get('/:id', async (req, res) => {
  try {
    const home = await Home.findById(req.params.id).populate('user', 'firstName lastName');
    if (!home) {
      return res.status(404).json({ message: 'ไม่พบข้อมูลบ้าน' });
    }
    res.json(home);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 