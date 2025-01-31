const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // ห้าม email ซ้ำกัน
    },
    password: {
      type: String,
      required: false,
    },
    isVerified: {
      type: Boolean,
      default: false, // เพิ่มค่าเริ่มต้นเป็นยังไม่ยืนยัน
    },
    profileImage: {
      type: String,
      default: "https://example.com/default-profile.png", // URL ของภาพโปรไฟล์เริ่มต้น
    },
    googleId: {
      type: String, // ใช้เก็บ Google ID ในกรณีที่ผู้ใช้สมัครผ่าน Google
    },
    facebookId: {
      type: String, // ใช้เก็บ Facebook ID ในกรณีที่ผู้ใช้สมัครผ่าน Facebook
    },
    appleId: {
      type: String, // ใช้เก็บ Apple ID ในกรณีที่ผู้ใช้สมัครผ่าน Apple
    },
    createdAt: {
      type: Date,
      default: Date.now, // เวลาที่ผู้ใช้สมัครสมาชิก
    },
    updatedAt: {
      type: Date,
      default: Date.now, // เวลาที่ผู้ใช้แก้ไขข้อมูลล่าสุด
    },
    passwordResetToken: {
      type: String, // Token สำหรับการตั้งรหัสผ่านใหม่
    },
    passwordResetExpires: {
      type: Date, // เวลาที่ token หมดอายุ
    },
  },
  { timestamps: true } // เพิ่มเวลา createdAt และ updatedAt ให้อัตโนมัติ
);

const User = mongoose.model("User", userSchema);

module.exports = User;
