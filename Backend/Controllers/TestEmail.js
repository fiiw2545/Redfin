const nodemailer = require("nodemailer");
require("dotenv").config(); // โหลดไฟล์ .env

// สร้างตัวจัดการ Nodemailer
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", // หรือ SMTP ของบริการอื่น
  port: 465, // ใช้พอร์ต 465 สำหรับ SSL
  secure: true, // ใช้ SSL
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ฟังก์ชันสำหรับส่งอีเมล
const sendEmail = async (to, subject, htmlContent) => {
  console.log("Sending email to:", to); // แสดงที่อยู่อีเมล
  console.log("Email content:", htmlContent); // แสดงเนื้อหาของอีเมล

  try {
    const mailOptions = {
      from: process.env.EMAIL_USER, // อีเมลผู้ส่ง
      to: to, // ที่อยู่อีเมลผู้รับ
      subject: subject, // หัวข้อของอีเมล
      html: htmlContent, // เนื้อหาของอีเมล
    };

    await transporter.sendMail(mailOptions); // ส่งอีเมล
    console.log("Email sent successfully!");
  } catch (error) {
    console.error("Error sending email:", error); // ถ้ามีข้อผิดพลาดจะพิมพ์ใน console
  }
};

// ฟังก์ชันสำหรับทดสอบการเชื่อมต่อ SMTP
const verifySMTP = () => {
  transporter.verify((error, success) => {
    if (error) {
      console.error("SMTP verification failed:", error); // ถ้ามีข้อผิดพลาด
    } else {
      console.log("SMTP server is ready to send emails"); // ถ้าเชื่อมต่อสำเร็จ
    }
  });
};

// ส่งออกฟังก์ชันและตัวจัดการ transporter
module.exports = { sendEmail, verifySMTP };
