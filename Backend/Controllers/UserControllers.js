const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../schema/UserSchema");
const { sendEmail } = require("../Controllers/TestEmail");
const crypto = require("crypto"); // ใช้สำหรับสร้าง token ตั้งรหัสผ่านใหม่
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ฟังก์ชันสมัครสมาชิกพร้อมยืนยันอีเมล
const registerUser = async (req, res) => {
  const { fullName, lastName, email } = req.body;

  try {
    // Step 1: ตรวจสอบว่าอีเมลมีในระบบอยู่แล้วหรือไม่
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists!" });
    }

    // Step 2: สร้างผู้ใช้ใหม่
    const newUser = new User({
      fullName,
      lastName,
      email,
      isVerified: false,
    });
    await newUser.save();

    // Step 3: สร้าง token สำหรับการตั้งรหัสผ่าน
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiration = Date.now() + 3600000; // 1 ชั่วโมง

    // บันทึก token และ expiration ในฐานข้อมูล
    newUser.passwordResetToken = resetToken;
    newUser.passwordResetExpires = resetTokenExpiration;
    await newUser.save();

    // Step 4: สร้างลิงก์ตั้งรหัสผ่าน
    const resetLink = `${process.env.CLIENT_URL}/set-password/${resetToken}`;

    // Step 5: ส่งลิงก์ยืนยันอีเมล
    await sendEmail(
      email,
      "Set Your Password",
      `<h1>Welcome ${fullName}!</h1>
       <p>Click the link below to set your password:</p>
       <a href="${resetLink}">Set Password</a>
       <p>This link will expire in 1 hour.</p>`
    );

    // Step 6: ส่งข้อมูลการตอบกลับ
    res.status(201).json({
      message: "สมัครสมาชิกสำเร็จ! กรุณาตรวจสอบอีเมลของคุณ.",
      token: resetToken,
      resetLink, // ส่งลิงก์สำหรับการทดสอบ
    });
  } catch (error) {
    res.status(500).json({
      message: "เกิดข้อผิดพลาดในการสมัครสมาชิก!",
      error: error.message,
    });
  }
};

// ฟังก์ชันตั้งรหัสผ่าน
const setPassword = async (req, res) => {
  const token = req.params.token || req.body.token;
  const { newPassword } = req.body; // รับ newPassword จาก body
  console.log("Request params:", req.params);
  console.log("Request body:", req.body);

  try {
    // ค้นหา user ที่ตรงกับ token และ tokenExpire ยังไม่หมดอายุ
    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() }, // Token ยังไม่หมดอายุ
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // แฮชรหัสผ่านใหม่
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // อัปเดตรหัสผ่านและล้าง token
    user.password = hashedPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.isVerified = true; // เปลี่ยนสถานะเป็น Verified
    await user.save();

    res.json({ message: "Password reset successful!" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ฟังก์ชันเข้าสู่ระบบ
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password!" });
    }

    if (!user.isVerified) {
      return res
        .status(401)
        .json({ message: "Please verify your email before logging in!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password!" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({
      message: "Login successful!",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
      },
    });
    return;
  } catch (error) {
    res.status(500).json({ message: "Error logging in!" });
  }
};

// ฟังก์ชันยืนยันอีเมล
const verifyEmail = async (req, res) => {
  const { token } = req.params;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    user.isVerified = true;
    await user.save();

    res.status(200).json({ message: "Email verified successfully!" });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Invalid or expired token!", error: error.message });
  }
};

// ฟังก์ชันล็อกอินด้วย Google
const googleLogin = async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    console.log("Token Received:", token);
    console.log("GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID);

    const { email, name, picture } = ticket.getPayload();

    // แยก firstName และ lastName จาก name (fullName)
    const [firstName, ...lastNameParts] = name.split(" ");
    const lastName = lastNameParts.join(" ") || "Unknown"; // ตั้งค่า default เป็น "Unknown" หากไม่มี lastName

    let user = await User.findOne({ email });

    if (!user) {
      // สร้างผู้ใช้ใหม่ พร้อมตั้ง isVerified เป็น true
      user = await User.create({
        email,
        firstName: firstName,
        lastName,
        profileImage: picture,
        isVerified: true, // ตั้งค่า isVerified เป็น true
      });
    } else {
      // หากผู้ใช้อยู่แล้ว ให้มั่นใจว่า isVerified เป็น true
      user.isVerified = true;
      await user.save(); // บันทึกการเปลี่ยนแปลง
    }

    const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({
      message: "Google Login successful!",
      token: jwtToken,
      user: {
        fullName: user.fullName,
        email: user.email,
        profileImage: user.profileImage,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Google login failed!", error: error.message });
  }
};

//ฟังก์ชันลืมรหัสผ่าน
const forgotPassword = async (req, res) => {
  const { email } = req.body; // รับ email จาก body

  try {
    // ตรวจสอบว่าอีเมลนี้มีอยู่ในฐานข้อมูลหรือไม่
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Email not found" });
    }

    // สร้าง Token สำหรับ Reset Password
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpires = Date.now() + 3600000; // Token หมดอายุใน 1 ชั่วโมง

    // บันทึก Token และเวลาหมดอายุในฐานข้อมูล
    user.passwordResetToken = resetToken;
    user.passwordResetExpires = resetTokenExpires;
    await user.save();

    // กำหนด URL สำหรับ Reset Password
    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

    // ตั้งค่า Nodemailer สำหรับส่งอีเมล
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // ผู้ส่งอีเมล (จาก .env)
        pass: process.env.EMAIL_PASS, // รหัสผ่านอีเมล (จาก .env)
      },
    });

    // กำหนดเนื้อหาอีเมล
    const mailOptions = {
      from: "no-reply@yourdomain.com",
      to: email,
      subject: "Reset Your Password",
      html: `
        <p>Hi ${user.name || "User"},</p>
        <p>You requested a password reset. Click the link below to reset your password:</p>
        <a href="${resetUrl}">Reset Password</a>
        <p>If you didn't request this, please ignore this email.</p>
      `,
    };

    // ส่งอีเมล
    await transporter.sendMail(mailOptions);

    res.json({ message: "Password reset email has been sent!" });
  } catch (error) {
    console.error("Error in forgotPassword:", error);

    // กรณีเกิดข้อผิดพลาดในการส่งอีเมล
    if (error.response) {
      return res.status(500).json({
        message:
          "Failed to send email. Please check the email server configuration.",
        error: error.response,
      });
    }

    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ส่งออกโมดูล
module.exports = {
  registerUser,
  loginUser,
  verifyEmail,
  setPassword,
  googleLogin,
  forgotPassword,
};
