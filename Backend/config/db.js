const mongoose = require("mongoose");

// ฟังก์ชันเชื่อมต่อฐานข้อมูล
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully!");
  } catch (error) {
    console.error("MongoDB connection failed!", error);
    process.exit(1); // ออกจากโปรแกรมทันทีเมื่อเชื่อมต่อไม่สำเร็จ
  }
};

module.exports = connectDB;
