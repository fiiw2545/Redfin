import React from "react";
import Navbar from "../components/Navbar/Navbar";
import NavbarUser from "../components/NavbarUser/NavbarUser";
import googleIcon from "../img/google-icon.png";
import Footer from "../components/Footer/Footer";
import { GoogleLogin } from "@react-oauth/google";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Cookies from "js-cookie";

const AccountSettings = () => {
  const [userEmail, setUserEmail] = useState(""); // ตัวแปรสำหรับเก็บอีเมลผู้ใช้
  const [selectedValue, setSelectedValue] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null); // ตัวแปรสำหรับเก็บข้อมูลผู้ใช้
  const [showGoogleLogin, setShowGoogleLogin] = useState(false); //เพื่อควบคุมการแสดงปุ่ม GoogleLogin

  //`http://localhost:5000/api/users/information/${email}`
  // ฟังก์ชันดึงข้อมูลผู้ใช้
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/users/information/${email}`,
          { withCredentials: true }
        );

        setUserData(response.data); // เก็บข้อมูลผู้ใช้ใน state
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [email]);

  // ส่งอีเมลยืนยันอีกครั้ง
  const handleResendEmail = async (e) => {
    e.preventDefault(); // ป้องกันการโหลดหน้าใหม่

    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/resend-email",
        {},
        { withCredentials: true } // ✅ ส่ง cookies ไปด้วย
      );

      if (response.status === 200) {
        alert("Verification email has been sent successfully!");
      } else {
        alert("Failed to resend email. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert(
        error.response?.data?.message ||
          "An error occurred while resending the email."
      );
    }
  };

  // อัปเดทรูปภาพในฐานข้อมูล
  const handleUpdateProfilePicture = async (imageFile) => {
    try {
      const formData = new FormData();
      formData.append("profileImage", imageFile);

      const response = await axios.post(
        "http://localhost:5000/api/users/update-profile-picture",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      console.log("API Response:", response.data);

      if (response.status === 200 && response.data.user) {
        setUserData((prev) => ({
          ...prev,
          profileImage: `data:image/jpeg;base64,${response.data.user.profileImage}`,
        }));

        // ✅ ล้าง Preview หลังจากอัปโหลดสำเร็จ
        setPreviewImage(null);

        alert("Profile picture updated successfully!");
      } else {
        alert("Failed to update profile picture.");
      }
    } catch (error) {
      console.error("Error updating profile picture:", error);
      alert("An error occurred while updating the profile picture.");
    }
  };

  // เปลี่ยนรูปภาพ
  const handleChangePhoto = (e) => {
    const file = e.target.files[0];

    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("File size should not exceed 2MB");
        return;
      }
      if (!file.type.startsWith("image/")) {
        alert("Please upload a valid image file");
        return;
      }

      // ✅ สร้าง Preview Image
      const previewURL = URL.createObjectURL(file);
      setPreviewImage(previewURL);

      handleUpdateProfilePicture(file);
    }
  };

  // ลบรูปภาพ
  const handleRemovePhoto = async () => {
    try {
      const response = await axios.put(
        "http://localhost:5000/api/users/update-profile-picture",
        { profileImage: null }, // ✅ ส่งค่า null เพื่อให้ Backend ลบรูป
        { withCredentials: true }
      );

      console.log("Remove Photo Response:", response.data);

      if (response.status === 200 && response.data.user) {
        setUserData((prev) => ({
          ...prev,
          profileImage: null, // ✅ ตั้งค่า null ให้ state
        }));
        alert("Profile picture removed successfully!");
      } else {
        alert("Failed to remove profile picture.");
      }
    } catch (error) {
      console.error("Error removing profile picture:", error);
      alert("An error occurred while removing the profile picture.");
    }
  };

  //อัพเดทข้อมูล
  const handleSaveUpdates = async (e) => {
    e.preventDefault();

    const updatedData = {
      firstName: document.getElementById("firstNameInput").value,
      lastName: document.getElementById("lastNameInput").value,
      email: document.getElementById("emailInput").value,
    };

    try {
      const response = await axios.put(
        "http://localhost:5000/api/users/update-profile", // ✅ ตรวจสอบว่า Backend รองรับ endpoint นี้
        updatedData,
        { withCredentials: true }
      );

      console.log("Profile Update Response:", response.data);

      if (response.status === 200 && response.data.user) {
        setUserData((prev) => ({ ...prev, ...response.data.user }));
        alert("Profile updated successfully!");
      } else {
        alert("Failed to update profile. Please try again.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("An error occurred while updating the profile.");
    }
  };

  // ฟังก์ชันสำหรับการคลิกที่ลิงก์ "Use Google Photo"
  useEffect(() => {
    // โหลด Google API client library
    const script = document.createElement("script");
    script.src = "https://apis.google.com/js/api.js";
    script.async = true;
    script.onload = initGoogleAuth;
    document.body.appendChild(script);

    function initGoogleAuth() {
      window.gapi.load("auth2", () => {
        window.gapi.auth2.init({
          client_id:
            "1054484762553-vi888hr1qncq3v3ofrradfrff67t71dl.apps.googleusercontent.com", // ใส่ clientId ของคุณที่นี่
          scope: "https://www.googleapis.com/auth/photoslibrary.readonly", // เพิ่ม scope สำหรับ Google Photos
        });
      });
    }
  }, []);

  // ฟังก์ชันเปิดหน้าต่าง Google OAuth2
  const handleClick = (e) => {
    e.preventDefault(); // ป้องกันการรีเฟรชหน้า

    const auth2 = window.gapi.auth2.getAuthInstance();

    // ตรวจสอบว่า auth2 instance โหลดเสร็จแล้ว
    if (auth2) {
      // เรียกใช้การล็อกอิน
      auth2
        .signIn()
        .then((response) => {
          console.log("Login Success:", response);
          // คุณสามารถดึงข้อมูลที่จำเป็นจาก response ได้ เช่น
          // const profile = response.getBasicProfile();
          // const idToken = response.getAuthResponse().id_token;
        })
        .catch((error) => {
          console.error("Login Failed:", error);
        });
    } else {
      console.error("Google API auth2 instance is not initialized.");
    }
  };

  return (
    <>
      <Navbar />
      <NavbarUser />
      <div style={styles.wrapper}>
        <div style={styles.title}>Account Settings</div>

        <div style={styles.alert}>
          <div style={styles.alertIcon}>
            <svg
              className="SvgIcon alert-alt"
              viewBox="0 0 24 24"
              style={{ width: "24px", height: "24px" }}
            >
              <path
                d="M.205 23.638L11.801.447a.25.25 0 01.447 0l11.596 23.191a.25.25 0 01-.224.362H.429a.25.25 0 01-.224-.362zM12.75 16a.25.25 0 00.25-.25v-5.5a.25.25 0 00-.25-.25h-1.5a.25.25 0 00-.25.25v5.5c0 .138.112.25.25.25h1.5zm0 4a.25.25 0 00.25-.25v-1.5a.25.25 0 00-.25-.25h-1.5a.25.25 0 00-.25.25v1.5c0 .138.112.25.25.25h1.5z"
                fillRule="evenodd"
                fill="#f5b800"
              />
            </svg>
          </div>
          <div style={styles.alertContent}>
            <strong>Verify Your Email</strong>
            <div style={styles.alertTextWithLinks}>
              <span style={styles.alertText}>
                Local MLS rules require you to verify your email address before
                you can see all home details.
              </span>
              <span style={styles.alertLinks}>
                <a
                  href="https://mail.google.com"
                  target="_blank"
                  style={styles.alertLink}
                >
                  Go to Email
                </a>

                <span> • </span>
                <a
                  href="#resend"
                  style={styles.alertLink}
                  onClick={handleResendEmail}
                >
                  Resend Email
                </a>
              </span>
            </div>
          </div>
        </div>

        <div style={styles.container}>
          <div style={styles.header}></div>

          <div style={styles.profileSection}>
            <div style={styles.avatarContainer}>
              <img
                id="profileImage"
                src={
                  previewImage || // ✅ แสดงรูปที่เลือกไว้ก่อนอัปโหลด
                  (userData?.profileImage
                    ? `data:image/jpeg;base64,${userData.profileImage}`
                    : "/png-clipart-computer-icons-user-user-heroes-black.png")
                }
                alt="Profile"
                style={styles.avatar}
                onError={(e) => {
                  e.target.src =
                    "/png-clipart-computer-icons-user-user-heroes-black.png";
                }}
              />
            </div>

            <div style={styles.photoActions}>
              {/* ลิงก์ Use Google Photo */}
              <a
                href="#"
                style={styles.photoLink}
                onClick={handleClick} // เมื่อคลิกให้แสดง Google Login
              >
                Use Google Photo
              </a>

              {/* การเปลี่ยนรูปภาพ */}
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                id="fileInput"
                onChange={handleChangePhoto}
              />
              <a
                href="#"
                onClick={() => document.getElementById("fileInput").click()}
                style={styles.photoLink}
              >
                Change Photo
              </a>
              {/* การลบรูปภาพ */}
              <a href="#" onClick={handleRemovePhoto} style={styles.photoLink}>
                Remove
              </a>
            </div>
          </div>

          <form style={styles.form}>
            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>First Name *</label>
                <input
                  id="firstNameInput"
                  type="text"
                  defaultValue={userData?.firstName || ""} // ใช้ค่าจาก userData หรือช่องว่าง
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Last Name *</label>
                <input
                  id="lastNameInput"
                  type="text"
                  defaultValue={userData?.lastName || ""}
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Email Address *</label>
                <input
                  id="emailInput"
                  type="email"
                  defaultValue={userData?.email || ""}
                  style={styles.input}
                />
              </div>
            </div>

            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Phone Number</label>
                <div style={styles.phoneInputGroup}>
                  <input type="tel" style={styles.phoneInput} />
                  <select
                    style={styles.typeSelect}
                    value={selectedValue}
                    onChange={(e) => setSelectedValue(e.target.value)}
                  >
                    {selectedValue === "" && (
                      <option value="" disabled hidden>
                        Type
                      </option>
                    )}
                    <option value="cell">Cell</option>
                    <option value="home">Home</option>
                    <option value="office">Office</option>
                  </select>
                </div>
              </div>

              <button
                type="button"
                style={styles.passwordButton}
                onClick={() => navigate("/changepassword")}
              >
                Change Password
              </button>

              <div style={styles.formGroup}>
                <button
                  type="submit"
                  style={styles.saveButton}
                  onClick={handleSaveUpdates}
                >
                  Save Updates
                </button>
              </div>
            </div>
          </form>
        </div>

        <div style={styles.sectiontitle}>Group Settings</div>
        <div style={styles.subsectiontitle}>Your Shared Search</div>
        <div style={styles.descriptionsmall}>
          Share your favorites, comments and saved searches with others.
        </div>

        <div style={styles.sectiontitle}>Linked Accounts</div>
        <div style={styles.description}>
          Sign in to Redfin with your social apps. We never post anything on
          your behalf.
        </div>
        <div style={styles.socialButtons}>
          <button style={styles.socialButton}>
            <img src={googleIcon} alt="Google" style={styles.icon} />
            Unlink Google
          </button>
        </div>

        <div style={styles.sectiontitle}>Touring and Offers</div>
        <div style={styles.subsectiontitle}>Pre-Approval Letter</div>
        <div style={styles.descriptionsmall}>
          Demonstrates your ability to obtain a mortgage for the amount in the
          offer.
        </div>

        <div style={styles.subsectiontitle}>Verify Your ID</div>
        <div style={styles.descriptionsmall}>
          To ensure the safety of our agents, we need you to verify your
          identity before we can take you on a home tour.
        </div>

        <div style={styles.sectiontitle}>Close Account</div>
        <div style={styles.descriptionsmall}>
          This will remove your login information from our system and you will
          not be able to login again. It cannot be undone.
        </div>
      </div>
      <Footer />
    </>
  );
};

const styles = {
  global: {
    fontFamily:
      '"Libre Franklin", -apple-system, BlinkMacSystemFont, Roboto, "Droid Sans", Helvetica, Arial, sans-serif',
    margin: 0,
    padding: 0,
    boxSizing: "border-box",
  },
  wrapper: {
    margin: "0 140px",
  },
  title: {
    fontSize: "28px",
    margin: "20px 0",
  },
  alert: {
    display: "flex",
    alignItems: "flex-start",
    backgroundColor: "#fff8ea",
    color: "#333",
    padding: "15px",
    border: "1px solid #ffb92e",
    borderRadius: "2px",
    marginBottom: "20px",
    fontSize: "14px",
    gap: "10px",
  },
  alertContent: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
    width: "100%",
  },
  alertTextWithLinks: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  alertText: {
    flex: 1,
    fontSize: "14px",
    lineHeight: "1.5",
    color: "#333",
  },
  alertLinks: {
    display: "flex",
    gap: "5px",
    justifyContent: "flex-end",
    marginLeft: "auto",
  },
  alertLink: {
    color: "#1080a2",
    textDecoration: "none",
    fontWeight: "lighter",
    cursor: "pointer",
  },

  //ส่วนของโปรไฟล์
  container: {
    margin: "20px auto",
    backgroundColor: "#fff",
    border: "1px solid #ddd",
    boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
  },
  header: {
    backgroundColor: "#e8f4f8",
    height: "90px",
  },
  profileSection: {
    display: "flex",
    alignItems: "flex-start",
    gap: "24px",
    marginBottom: "0",
    marginTop: "-80px",
    padding: "20px",
  },
  avatarContainer: {
    width: "120px",
    height: "120px",
    flexShrink: 0,
    borderRadius: "50%",
    overflow: "hidden",
  },
  avatar: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  photoActions: {
    display: "flex",
    flexDirection: "row",
    gap: "16px",
    alignItems: "center",
    paddingTop: "0px",
    marginTop: "80px",
  },
  photoLink: {
    background: "none",
    border: "none",
    color: "#0066ff",
    cursor: "pointer",
    fontSize: "14px",
    padding: "4px 0",
    textDecoration: "none",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
    padding: "20px",
  },
  formRow: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "24px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    fontSize: "14px",
    fontWeight: "500",
    color: "#4b5563",
  },
  input: {
    width: "100%",
    height: "40px",
    padding: "8px 12px",
    fontSize: "14px",
    border: "1px solid #d1d5db",
    backgroundColor: "#fff",
  },
  phoneInputGroup: {
    display: "flex",
  },
  phoneInput: {
    flex: "1",
    height: "40px",
    padding: "8px 12px",
    fontSize: "14px",
    border: "1px solid #d1d5db",
    backgroundColor: "#fff",
  },
  typeSelect: {
    width: "100px",
    height: "40px",
    padding: "8px 12px",
    fontSize: "14px",
    border: "1px solid #d1d5db",
    backgroundColor: "#fff",
    cursor: "pointer",
  },
  passwordButton: {
    width: "100%",
    height: "40px",
    marginTop: "auto",
    padding: "8px 16px",
    fontSize: "14px",
    color: "#4b5563",
    backgroundColor: "#f3f4f6",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  saveButton: {
    width: "100%",
    height: "40px",
    marginTop: "auto",
    padding: "8px 16px",
    fontSize: "14px",
    fontWeight: "500",
    color: "#ffffff",
    backgroundColor: "#dc2626",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },

  sectiontitle: {
    fontSize: "22px",
    marginTop: "20px",
    color: "#333",
  },
  subsectiontitle: {
    fontSize: "16px",
    marginTop: "20px",
    color: "#333",
  },
  descriptionsmall: {
    fontSize: "14px",
    color: "#767676",
    marginTop: "5px",
    marginBottom: "20px",
  },
  description: {
    fontSize: "16px",
    color: "#767676",
    marginTop: "5px",
    marginBottom: "20px",
  },

  socialButtons: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginBottom: "20px",
    width: "300px",
  },
  socialButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "2px",
    cursor: "pointer",
    backgroundColor: "#fff",
    fontSize: "16px",
    gap: "20px",
    color: "#585858",
    fontWeight: "600",
    fontFamily:
      '"Libre Franklin", -apple-system, BlinkMacSystemFont, Roboto, "Droid Sans", Helvetica, Arial, sans-serif',
  },
  icon: {
    width: "20px",
    marginRight: "10px",
  },
};

export default AccountSettings;
