const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: false,
    },
    lastName: {
      type: String,
      required: false,
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
    googleProfileImage: {
      type: String, // URL ของภาพโปรไฟล์จาก Google
    },
    useGooglePhoto: Boolean,
    loginType: { type: String, enum: ["email", "google"], required: true },
    isRemoved: { type: Boolean, default: false },
    hasSeenBanner: {
      type: Boolean,
      default: false, // ค่าเริ่มต้นคือ false หมายความว่ายังไม่เคยดูแบนเนอร์
    },
    googleId: {
      type: String, // ใช้เก็บ Google ID ในกรณีที่ผู้ใช้สมัครผ่าน Google
    },
    googleAccessToken: {
      type: String, // ✅ เพิ่มฟิลด์เก็บ Google Access Token
    },
    facebookId: {
      type: String, // ใช้เก็บ Facebook ID ในกรณีที่ผู้ใช้สมัครผ่าน Facebook
    },
    appleId: {
      type: String, // ใช้เก็บ Apple ID ในกรณีที่ผู้ใช้สมัครผ่าน Apple
    },
    phoneNumber: {
      type: String,
      required: false, // สามารถกำหนดว่าไม่จำเป็นต้องกรอกเบอร์โทรศัพท์
      unique: true, // ถ้าต้องการให้เบอร์โทรศัพท์ไม่ซ้ำกัน
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
    otpCode: {
      type: String, // เก็บรหัส OTP 6 หลัก
    },
    otpExpires: {
      type: Date, // เวลาหมดอายุของ OTP
    },
  },
  { timestamps: true } // เพิ่มเวลา createdAt และ updatedAt ให้อัตโนมัติ
);

const User = mongoose.model("User", userSchema);

module.exports = User;
