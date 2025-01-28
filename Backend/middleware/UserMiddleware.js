const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  try {
    console.log("Cookies:", req.cookies); // ดูว่า Cookies มีค่า token หรือไม่
    const token = req.cookies.token; // ดึง Token จาก Cookies
    if (!token) {
      return res.status(401).json({ message: "Token is missing!" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET); // ตรวจสอบ token
    req.user = decoded; // แนบข้อมูลผู้ใช้ใน Request
    next();
  } catch (error) {
    console.error("Token verification failed:", error.message); // แสดงข้อความ error
    res.status(403).json({ message: "Invalid or expired token!" });
  }
};

module.exports = { authenticateToken };
