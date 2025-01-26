const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  try {
    console.log("Cookies received:", req.cookies); // Debug
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Token is missing!" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET); // ตรวจสอบ token
    console.log("Decoded token:", decoded); // Debug
    req.user = decoded; // แนบข้อมูลผู้ใช้ใน Request
    next();
  } catch (error) {
    console.error("Token verification failed:", error.message); // Debug
    res.status(403).json({ message: "Invalid or expired token!" });
  }
};

module.exports = { authenticateToken };
