const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../schema/UserSchema");
const { sendEmail } = require("../Controllers/TestEmail");
const crypto = require("crypto"); // ใช้สำหรับสร้าง token ตั้งรหัสผ่านใหม่
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const axios = require("axios");

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
      loginType: "email",
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

//ฟังก์ชันสมัครสมาชิกโดยใช้เเค่เมล
const register2User = async (req, res) => {
  const { email, profileImage } = req.body; // เอา firstName และ lastName ออก

  try {
    // ตรวจสอบว่าอีเมลมีอยู่แล้วหรือไม่
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists!" });
    }

    // สร้างผู้ใช้ใหม่ (ไม่มี firstName และ lastName)
    const newUser = new User({
      email,
      profileImage: profileImage || undefined,
      isVerified: false,
      loginType: "email",
    });
    await newUser.save();

    // สร้าง Token สำหรับตั้งรหัสผ่าน
    const resetToken = crypto.randomBytes(32).toString("hex");
    newUser.passwordResetToken = resetToken;
    newUser.passwordResetExpires = Date.now() + 3600000; // 1 ชั่วโมง
    await newUser.save();

    // สร้างลิงก์ตั้งรหัสผ่าน
    if (!process.env.CLIENT_URL) {
      throw new Error("CLIENT_URL is not defined in environment variables.");
    }
    const resetLink = `${process.env.CLIENT_URL}/set-password/${resetToken}`;

    // ส่งอีเมลให้ผู้ใช้ตั้งรหัสผ่าน
    await sendEmail(
      email,
      "Set Your Password",
      `<p>Click the link below to set your password:</p>
       <a href="${resetLink}">Set Password</a>
       <p>This link will expire in 1 hour.</p>`
    );

    res.status(201).json({
      message:
        "Signup successful! Please check your email to set your password.",
      token: resetToken,
      resetLink, // สำหรับการ debug
    });
  } catch (error) {
    res.status(500).json({
      message: "Error registering user!",
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
        profileImage: user.profileImage,
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

// ฟังก์ชันส่งอีเมลอีกครั้ง
const resendEmail = async (req, res) => {
  try {
    // ดึง token จาก Cookies
    const token = req.cookies.token;
    if (!token) {
      return res.status(403).json({ message: "No token provided!" });
    }

    // ตรวจสอบ token และดึง userId
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    // ค้นหาผู้ใช้จาก userId
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // ตรวจสอบว่าผู้ใช้ยืนยันอีเมลแล้วหรือยัง
    if (user.isVerified) {
      return res.status(400).json({ message: "Email already verified." });
    }

    // สร้าง verifyToken ใหม่ (ใช้ JWT)
    const verifyToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    user.verifyToken = verifyToken;
    await user.save();

    // สร้างลิงก์ยืนยันอีเมล
    const verifyLink = `${process.env.CLIENT_URL}/verify-email/${verifyToken}`;

    // ใช้ `sendEmail` ที่เราสร้างไว้
    await sendEmail(
      user.email,
      "Verify Your Email",
      `
        <h1>Email Verification</h1>
        <p>Click the link below to verify your email:</p>
        <a href="${verifyLink}" target="_blank">Verify Email</a>
        <p>This link will expire in 1 hour.</p>
      `
    );

    return res
      .status(200)
      .json({ message: "Verification email sent successfully." });
  } catch (error) {
    console.error("Error sending email:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while sending the email." });
  }
};

//ฟังก์ชันยืนยันอีเมล
const verifyEmail = async (req, res) => {
  try {
    // ดึง token จาก Cookies
    const token = req.cookies.token;
    if (!token) {
      return res.status(403).json({ message: "No token provided!" });
    }

    // ตรวจสอบ token และดึง userId
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    // ค้นหาผู้ใช้จาก userId
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // อัปเดตค่า isVerified เป็น true
    user.isVerified = true;
    user.verifyToken = null; // ลบโทเค็นออกจากฐานข้อมูล
    await user.save();

    return res.status(200).json({ message: "Email verified successfully." });
  } catch (error) {
    console.error("Error verifying email:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while verifying the email." });
  }
};

// ฟังก์ชันล็อกอินด้วย Google
const googleLogin = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ message: "Token is required!" });
  }

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
        googleProfileImage: picture,
        loginType: "google",
        googleAccessToken: token, // ✅ เพิ่ม Google Access Token ที่ได้จาก OAuth
      });
    } else {
      user.googleAccessToken = token;
      user.googleProfileImage = picture;
      await user.save();
    }

    // สร้าง JWT Token
    const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // เก็บ token ไว้ใน cookies
    res.cookie("token", jwtToken, {
      httpOnly: true, // ป้องกัน JavaScript เข้าถึง
      secure: process.env.NODE_ENV === "production", // ใช้ HTTPS ใน production
      maxAge: 3600 * 1000, // หมดอายุใน 1 ชั่วโมง
      sameSite: "Strict", // ป้องกัน Cross-Site Request Forgery (CSRF)
    });

    console.log("Token sent in cookie:", jwtToken);

    res.status(200).json({
      message: "Google Login successful!",
      token: jwtToken,
      user: {
        fullName: user.fullName,
        email: user.email,
        profileImage: user.profileImage,
        isVerified: user.isVerified,
        googleProfileImage: user.googleProfileImage,
      },
    });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Google login failed!", error: error.message });
  }
};

//ดึงรูปภาพgoogle
const getUserProfileGoogle = async (req, res) => {
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

    // ✅ ดึงข้อมูลผู้ใช้จากฐานข้อมูล
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    const googleProfileImage = user.googleProfileImage;
    console.log("Google Profile Image:", googleProfileImage);

    res.status(200).json({
      email: user.email,
      fullName: `${user.firstName} ${user.lastName}`,
      profileImage: user.profileImage,
      googleProfileImage, // ✅ ส่ง googleProfileImage กลับไป
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
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

//ฟังก์ชันดึงอีเมลจากTokenใหม่
const getEmailFromCookie = async (req, res) => {
  try {
    const token = req.cookies.token; // ✅ ดึง Token จาก Cookies (ไม่ต้องใช้ `req.params`)
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ email: user.email });
  } catch (error) {
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
      profileImage: user.profileImage,
      googleProfileImage: user.googleProfileImage,
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

    const googleProfileImage = req.body.googleProfileImage;
    let profileImage = req.file ? req.file.buffer.toString("base64") : null;

    // ✅ ถ้าใช้ Google Photo, ให้ profileImage เป็น null
    if (req.body.profileImage === "null") {
      profileImage = null;
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { profileImage, googleProfileImage },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

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

//เปลี่ยนรหัสผ่านโดยมีรหัสผ่านเก่าให้ยืนยัน
const changePassword = async (req, res) => {
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

    // ✅ รับค่าจาก body
    const { oldPassword, newPassword, confirmPassword } = req.body;

    // ✅ ตรวจสอบว่ามีค่า newPassword กับ confirmPassword
    if (!newPassword || !confirmPassword) {
      return res.status(400).json({ message: "Please provide all fields" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // ✅ ค้นหาผู้ใช้จากฐานข้อมูล
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ ตรวจสอบรหัสผ่านเก่า
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    // ✅ เข้ารหัสรหัสผ่านใหม่
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

//ฟังก์ชันเช็คอีเมลในฐานข้อมูล
const checkEmail = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user) {
      return res
        .status(200)
        .json({ exists: true, hasPassword: !!user.password });
    } else {
      return res.status(200).json({ exists: false });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

//ส่งOTP
const sendOTP = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Email not found!" });
    }

    // สร้างรหัส OTP 6 หลัก
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiration = Date.now() + 10 * 60 * 1000; // หมดอายุใน 10 นาที

    // บันทึก OTP ลงฐานข้อมูล
    user.otpCode = otp;
    user.otpExpires = otpExpiration;
    await user.save();

    // ส่งอีเมล OTP
    await sendEmail(email, "Your OTP Code", `<p>Your OTP: <b>${otp}</b></p>`);

    res.json({ message: "OTP sent successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error sending OTP", error: error.message });
  }
};

//ยืนยันOTP
const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || user.otpCode !== otp || Date.now() > user.otpExpires) {
      return res.status(400).json({ message: "Invalid or expired OTP!" });
    }

    // OTP ถูกต้อง → ให้เข้าสู่ระบบได้
    user.otpCode = null; // ล้างค่า OTP
    user.otpExpires = null;
    await user.save();

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

    res.json({ message: "OTP verified! Login successful." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error verifying OTP", error: error.message });
  }
};

//หน้าหลักเข้าสู่ระบบด้วยรหัสผ่าน
const passwordLogin = async (req, res) => {
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
        profileImage: user.profileImage,
      },
    });
    return;
  } catch (error) {
    res.status(500).json({ message: "Error logging in!" });
  }
};

//ลบบัญชี
const deleteAccount = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res
        .status(401)
        .json({ message: "No token provided. Access denied." });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Invalid or expired token." });
      }

      // ใช้ decoded.id หรือ decoded._id ตามที่คุณใช้ในการ sign token
      const userId = decoded.id; // หรือ decoded._id
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      await User.findByIdAndDelete(userId);
      res.clearCookie("token");
      res.status(200).json({ message: "Account deleted successfully" });
    });
  } catch (error) {
    console.error("Error deleting account:", error);
    res
      .status(500)
      .json({ message: "Error deleting account", error: error.message });
  }
};

// ตรวจสอบประเภทการล็อกอิน
const checkLoginType = async (req, res) => {
  try {
    // 🔍 ดึง Token จาก Cookie
    const token = req.cookies?.token;
    console.log("Token from Cookie:", token);

    if (!token) {
      return res
        .status(401)
        .json({ message: "Access denied, no token provided." });
    }

    let decoded;
    try {
      // 🔍 ตรวจสอบความถูกต้องของ Token
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded Token:", decoded);
    } catch (err) {
      return res.status(403).json({ message: "Invalid or expired token." });
    }

    // 🔍 ดึงข้อมูล User จาก Database
    const user = await User.findById(decoded.id).select("loginType");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 🔥 ส่งประเภทการล็อกอินกลับไป
    res.json({ loginType: user.loginType });
  } catch (error) {
    console.error("Error checking login type:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//เช็คว่าVerifyไหม
const checkVerify = async (req, res) => {
  try {
    // 🔍 ดึง Token จาก Cookie
    const token = req.cookies?.token;
    console.log("Token from Cookie:", token);

    if (!token) {
      return res
        .status(401)
        .json({ message: "Access denied, no token provided." });
    }

    let decoded;
    try {
      // 🔍 ตรวจสอบความถูกต้องของ Token
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded Token:", decoded);
    } catch (err) {
      return res.status(403).json({ message: "Invalid or expired token." });
    }

    // 🔍 ค้นหาผู้ใช้ในฐานข้อมูลตาม `decoded.id`
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // ✅ ส่งค่า `isVerified` กลับไป
    return res.json({ isVerified: user.isVerified });
  } catch (error) {
    console.error("Error checking verification:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// ส่งออกโมดูล
module.exports = {
  registerUser,
  register2User,
  loginUser,
  logoutUser,
  resendEmail,
  setPassword,
  changePassword,
  verifyEmail,
  googleLogin,
  forgotPassword,
  getEmailFromToken,
  getEmailFromCookie,
  getinformation,
  getUser,
  updateProfilePicture,
  removeProfilePicture,
  updateProfile,
  checkEmail,
  sendOTP,
  verifyOTP,
  passwordLogin,
  deleteAccount,
  checkLoginType,
  getUserProfileGoogle,
  checkVerify,
};
