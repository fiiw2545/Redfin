const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../schema/UserSchema");
const { sendEmail } = require("../Controllers/TestEmail");
const crypto = require("crypto"); // ใช้สำหรับสร้าง token ตั้งรหัสผ่านใหม่
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ฟังก์ชันสมัครสมาชิกพร้อมยืนยันอีเมล
const registerUser = async (req, res) => {
  const { firstName, lastName, email, profileImage } = req.body;

  try {
    // Step 1: ตรวจสอบว่าอีเมลมีในระบบอยู่แล้วหรือไม่
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists!" });
    }

    // Step 2: สร้างผู้ใช้ใหม่
    const newUser = new User({
      firstName,
      lastName,
      email,
      profileImage: profileImage || undefined, // ใช้ค่าเริ่มต้นหากไม่มี profileImage
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
    if (!process.env.CLIENT_URL) {
      throw new Error("CLIENT_URL is not defined in environment variables.");
    }
    const resetLink = `${process.env.CLIENT_URL}/set-password/${resetToken}`;

    // Step 5: ส่งลิงก์ยืนยันอีเมล
    await sendEmail(
      email,
      "Set Your Password",
      `<h1>Welcome ${newUser.firstName}!</h1>
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
    user.isVerified = false; // เปลี่ยนสถานะเป็น Verified
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

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password!" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // เก็บ token ไว้ใน cookies
    res.cookie("token", token, {
      httpOnly: true, // ป้องกันการเข้าถึงจาก JavaScript
      secure: process.env.NODE_ENV === "production", // ใช้ HTTPS ใน production
      maxAge: 3600 * 1000, // เวลาหมดอายุ 1 ชั่วโมง
      sameSite: "Strict", // ป้องกันการใช้คุกกี้จาก cross-site request
    });
    console.log("Token sent in cookie:", token);

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

//ฟังก์ชันออกจากระบบ
const logoutUser = (req, res) => {
  // ลบ token ใน cookies โดยตั้งค่าใหม่ให้หมดอายุทันที
  res.cookie("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    expires: new Date(0), // หมดอายุทันที
  });

  res.status(200).json({ message: "Logout successful!" });
};

// ฟังก์ชันยืนยันอีเมล
const resendEmail = async (req, res) => {
  const { email } = req.body;

  // ตรวจสอบว่ามีอีเมลและอยู่ในรูปแบบที่ถูกต้อง
  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({ message: "A valid email is required." });
  }

  try {
    // ตรวจสอบว่า EMAIL_USER และ EMAIL_PASS ถูกตั้งค่าใน .env
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new Error("Email credentials are not configured properly.");
    }

    // สร้างตัวส่งอีเมลด้วย nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail", // ใช้ Gmail เป็นตัวอย่าง
      auth: {
        user: process.env.EMAIL_USER, // อีเมลที่ใช้ส่ง (จาก .env)
        pass: process.env.EMAIL_PASS, // รหัสผ่านแอป (จาก .env)
      },
    });

    // Step 4: สร้างลิงก์ตั้งรหัสผ่าน
    const verifyLink = `${process.env.CLIENT_URL}/set-password/${resetToken}`;

    // กำหนดเนื้อหาอีเมล
    await sendEmail(
      email,
      "Set Your Password",
      `<h1>Welcome ${newUser.firstName}!</h1>
       <p>Click the link below to set your password:</p>
       <a href="${verifyLink}">Set Password</a>
       <p>This link will expire in 1 hour.</p>`
    );

    // ส่งอีเมล
    await transporter.sendMail(mailOptions);

    return res
      .status(200)
      .json({ message: "Email has been resent successfully." });
  } catch (error) {
    console.error("Error sending email:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while sending the email." });
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
      // สร้างผู้ใช้ใหม่
      user = await User.create({
        email,
        firstName: firstName,
        lastName,
        profileImage: picture,
        isVerified: false, // ตั้งค่า isVerified เป็น true
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
    const resetUrl = `${process.env.CLIENT_URL}/resetpassword/${resetToken}`;

    // Step 5: ส่งลิงก์ยืนยันอีเมล
    await sendEmail(
      email,
      "Set Your Password",
      `<h1>Welcome ${user.firstName}!</h1>
       <p>Click the link below to set your password:</p>
       <a href="${resetUrl}">Set Password</a>
       <p>This link will expire in 1 hour.</p>`
    );

    // Step 6: ส่งข้อมูลการตอบกลับ
    res.status(201).json({
      message: "Password reset email has been sent. Please check your email.",
      token: resetToken,
      resetLink: resetUrl, // ส่งลิงก์สำหรับการทดสอบ
    });
  } catch (error) {
    res.status(500).json({
      message: "เกิดข้อผิดพลาดในการสมัครสมาชิก!",
      error: error.message,
    });
  }
};

//ฟังก์ชันดึงอีเมลจากToken
const getEmailFromToken = async (req, res) => {
  const { token } = req.params;

  try {
    // ค้นหา Token ในฐานข้อมูล
    const user = await User.findOne({ passwordResetToken: token });
    if (!user) {
      return res.status(404).json({ message: "Invalid or expired token" });
    }

    // ส่งอีเมลกลับไป
    res.status(200).json({ email: user.email });
  } catch (error) {
    console.error("Error fetching email:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

//ฟังก์ชันดึงข้อมูลแสดง
const getinformation = async (req, res) => {
  try {
    // ดึง Token จาก Cookie
    const token = req.cookies.token;

    if (!token) {
      console.error("Token is missing!"); // Debug
      return res.status(401).json({ message: "Token is required" });
    }

    // ตรวจสอบและถอดรหัส Token
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // ใช้ JWT Secret ใน .env

    if (!decoded || !decoded.id) {
      console.error("Invalid token or missing user ID in token"); // Debug
      return res.status(403).json({ message: "Invalid token" });
    }

    // ค้นหาข้อมูลผู้ใช้ในฐานข้อมูลโดยอิงจาก userId
    const user = await User.findById(decoded.id);

    if (!user) {
      console.error("User not found for ID:", decoded.id); // Debug
      return res.status(404).json({ message: "User not found" });
    }

    // ส่งข้อมูลผู้ใช้กลับไป
    res.status(200).json({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    });
  } catch (error) {
    console.error("Error in getInformation:", error); // Debug
    res.status(500).json({ message: "Internal server error!", error });
  }
};

const getUser = async (req, res) => {
  try {
    // ดึงโทเค็นจากคุกกี้
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // ตรวจสอบโทเค็น
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password"); // ดึงข้อมูลผู้ใช้จากฐานข้อมูล

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user); // ส่งข้อมูลผู้ใช้กลับไป
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ฟังก์ชันในการอัปเดตรูปภาพ
const updateProfilePicture = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(403).json({ message: "No token provided!" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    if (!req.file) {
      return res.status(400).json({ message: "Missing profileImage" });
    }

    const profileImage = req.file.buffer.toString("base64");

    const user = await User.findByIdAndUpdate(
      userId,
      { profileImage },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("Updated User Data:", user); // ✅ เพิ่ม Log

    return res.status(200).json({
      message: "Profile picture updated successfully",
      user,
    });
  } catch (error) {
    console.error("Error updating profile picture:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//ลบรูปภาพ
const removeProfilePicture = async (req, res) => {
  try {
    // ✅ ตรวจสอบว่า token มีใน cookies หรือไม่
    const token = req.cookies.token;
    if (!token) {
      return res.status(403).json({ message: "No token provided!" });
    }

    // ✅ ตรวจสอบ token และดึง userId จาก token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // ✅ อัปเดตฐานข้อมูล (ลบรูปภาพ)
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profileImage: null }, // ✅ ตั้งค่า profileImage เป็น `null`
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Profile picture removed successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error removing profile picture:", error);
    res.status(500).json({ message: "Error removing profile picture" });
  }
};

//อัพเดทข้อมูลของผู้ใช้
const updateProfile = async (req, res) => {
  try {
    // ✅ ตรวจสอบ token จาก cookies
    const token = req.cookies.token;
    if (!token) {
      return res.status(403).json({ message: "No token provided!" });
    }

    // ✅ ถอดรหัส token เพื่อดึง userId
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // ✅ ดึงข้อมูลจาก body ของ request
    const { firstName, lastName, email } = req.body;

    // ✅ ตรวจสอบว่ามีข้อมูลอะไรที่ต้องอัปเดตบ้าง
    const updateData = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (email) updateData.email = email;

    // ✅ อัปเดตข้อมูลผู้ใช้ในฐานข้อมูล
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser, // ✅ ส่งข้อมูลที่อัปเดตแล้วกลับไป
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Error updating profile" });
  }
};

// ส่งออกโมดูล
module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  resendEmail,
  setPassword,
  googleLogin,
  forgotPassword,
  getEmailFromToken,
  getinformation,
  getUser,
  updateProfilePicture,
  removeProfilePicture,
  updateProfile,
};
