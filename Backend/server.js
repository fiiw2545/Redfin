const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const userRoutes = require("./routes/UserRoutes");

// โหลดค่าตัวแปรจาก .env
dotenv.config();

// เชื่อมต่อฐานข้อมูล MongoDB
connectDB();

// สร้างแอป Express
const app = express();

// Middleware
app.use(express.json()); // แปลง JSON จาก request body
app.use(cors()); // อนุญาตการเชื่อมต่อข้ามโดเมน (CORS)

// Routes
app.use("/api/users", userRoutes);

// หากเส้นทางไม่ตรงกับที่กำหนดไว้
app.use((req, res, next) => {
  res.status(404).json({ message: "API route not found!" });
});

// Middleware สำหรับจัดการข้อผิดพลาด
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal server error!" });
});

// Port และเริ่มเซิร์ฟเวอร์
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
