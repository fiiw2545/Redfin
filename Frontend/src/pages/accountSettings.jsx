import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar/Navbar";
import NavbarUser from "../components/NavbarUser/NavbarUser";
import googleIcon from "../img/google-icon.png";
import Footer from "../components/Footer/Footer";
import facebookIcon from "../img/facebook-icon.png";
import { Link } from "react-router-dom";
import { useGlobalEvent } from "../context/GlobalEventContext";

import Cookies from "js-cookie";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

const AccountSettings = () => {
  const [userEmail, setUserEmail] = useState(""); // ตัวแปรสำหรับเก็บอีเมลผู้ใช้
  const [selectedValue, setSelectedValue] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  const [email, setEmail] = useState("");
  const [googleProfileImage, setGoogleProfileImage] = useState(""); // รูป Google เท่านั้น
  const [useGooglePhoto, setUseGooglePhoto] = useState(false);
  const [profileImageSrc, setProfileImageSrc] = useState(null);
  const [profileImage, setProfileImage] = useState("");
  const [loading, setLoading] = useState(false); // ✅ ใช้เพื่อแสดงสถานะโหลด
  const [userData, setUserData] = useState(null); // ตัวแปรสำหรับเก็บข้อมูลผู้ใช้
  const [showGoogleLogin, setShowGoogleLogin] = useState(false); //เพื่อควบคุมการแสดงปุ่ม GoogleLogin
  const { windowSize } = useGlobalEvent();
  const isMobileView = windowSize.width < 980;
  const [searchPartnerModalOpen, setsearchPartnerModalOpen] = useState(false);
  const [isFacebookLinked, setIsFacebookLinked] = useState(false);
  const [isGoogleLinked, setIsGoogleLinked] = useState(false);
  const [isVerified, setIsVerified] = useState(null);
  const [isPreApproved, setIsPreApproved] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [checked, setChecked] = useState(false);
  const [error, setError] = useState(null);
  const [deleteAccountModalOpen, setdeleteAccountModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = () => {
    setChecked(!checked);
  };

  const toggleTooltip = () => {
    setShowTooltip((prev) => !prev);
  };

  ///รับค่าจากฟอร์มพาร์ทเนอร์
  const [partnerEmails, setPartnerEmails] = useState({ email: "" });
  const handleAddPartner = () => {
    if (partnerEmails.email.trim() === "") {
      alert("กรุณากรอกอีเมลของพาร์ทเนอร์");
      return;
    }
    alert(`เพิ่มพาร์ทเนอร์: ${partnerEmails.email}`);
    setPartnerEmails({ email: "" }); // เคลียร์ input
    setsearchPartnerModalOpen(false); // ปิด modal
  };

  // ฟังก์ชันเมื่อกดปุ่ม "Delete"
  const handleDelete = async () => {
    try {
      setIsLoading(true); // ตั้งสถานะการโหลดเมื่อกำลังลบ
      setError(null); // ลบข้อผิดพลาดเก่า (ถ้ามี)

      // เรียก API สำหรับลบบัญชี
      await axios.delete("http://localhost:5000/api/users/deleteAccount", {
        withCredentials: true, // ส่งคุกกี้ (ที่มี token) ไปด้วย
      });

      // ปิด modal หลังการลบสำเร็จ
      setdeleteAccountModalOpen(false);
      alert("Your account has been deleted successfully.");
      // อาจจะต้อง log out หรือ redirect ผู้ใช้ไปที่หน้าอื่น
      window.location.href = "/"; // เปลี่ยนเส้นทางไปหน้าแรกหรือหน้าอื่น ๆ ที่ต้องการ
    } catch (error) {
      setError("Error occurred while deleting the account. Please try again.");
    } finally {
      setIsLoading(false); // หยุดสถานะการโหลด
    }
  };

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

  useEffect(() => {
    console.log("Rendering image with state:", {
      profileImage: userData?.profileImage,
      googleProfileImage: userData?.googleProfileImage,
      useGooglePhoto: userData?.useGooglePhoto,
    });
  }, [userData]);

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
  const handleUpdateProfilePicture = async (file) => {
    try {
      const formData = new FormData();
      formData.append("profileImage", file);

      const response = await axios.post(
        "http://localhost:5000/api/users/update-profile-picture",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200 && response.data.user) {
        setUserData((prev) => ({
          ...prev,
          profileImage: response.data.user.profileImage,
          isRemoved: false, // เพิ่มการตั้งค่า isRemoved เป็น false
          useGooglePhoto: false,
        }));
        alert("Profile picture updated successfully!");
      }
    } catch (error) {
      console.error("Error updating profile picture:", error);
      alert("Failed to update profile picture");
    }
  };

  // ฟังก์ชันดึง Google Profile และอัปเดตโปรไฟล์
  const handleUseGooglePhoto = async () => {
    setLoading(true);
    setError("");

    try {
      console.log("Current userData:", userData); // เพิ่ม log เพื่อตรวจสอบ

      if (!userData?.googleProfileImage) {
        alert("ไม่พบรูปภาพ Google Profile");
        setLoading(false);
        return;
      }

      const response = await axios.post(
        "http://localhost:5000/api/users/update-profile-picture",
        {
          useGooglePhoto: "true",
          googleProfileImage: userData.googleProfileImage,
        },
        { withCredentials: true }
      );

      console.log("Server response:", response.data); // เพิ่ม log เพื่อตรวจสอบ

      if (response.status === 200 && response.data.user) {
        // อัปเดต state ให้ครบถ้วน
        setUserData((prev) => ({
          ...prev,
          profileImage: null,
          isRemoved: false, // ต้องตั้งค่าเป็น false เพื่อให้แสดงรูป
          useGooglePhoto: true,
          googleProfileImage: response.data.user.googleProfileImage,
        }));
        setPreviewImage(null);
        alert("Now using Google profile photo!");
      }
    } catch (error) {
      console.error("Error setting Google profile image:", error);
      alert("ไม่สามารถใช้รูปภาพ Google Profile ได้ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setLoading(false);
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

      const previewURL = URL.createObjectURL(file);
      setPreviewImage(previewURL);

      // อัปเดต state เมื่อเลือกรูปใหม่
      setUserData((prev) => ({
        ...prev,
        isRemoved: false, // เปลี่ยน isRemoved เป็น false เมื่อมีการเลือกรูปใหม่
        useGooglePhoto: false, // ตั้งค่าเป็น false เมื่อใช้รูปที่อัปโหลดเอง
      }));

      handleUpdateProfilePicture(file);
    }
  };

  // ลบรูปภาพ
  const handleRemovePhoto = async () => {
    try {
      const response = await axios.put(
        "http://localhost:5000/api/users/remove-profile-picture",
        {},
        { withCredentials: true }
      );

      if (response.status === 200 && response.data.user) {
        console.log("Updated user data:", response.data.user); // Debug ค่า user ที่อัปเดตมา

        setUserData((prev) => ({
          ...prev,
          profileImage: null,
          isRemoved: true, // ตั้งค่า isRemoved เป็น true
          useGooglePhoto: false, // อัปเดต useGooglePhoto เป็น false
          googleProfileImage: response.data.user.googleProfileImage, // เก็บค่า Google Image (แต่ไม่ใช้)
        }));

        setPreviewImage(null);
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
      // เพิ่มข้อมูลเกี่ยวกับรูปภาพ
      isRemoved: userData.isRemoved,
      useGooglePhoto: userData.useGooglePhoto,
      googleProfileImage: userData.googleProfileImage,
    };

    console.log("Sending update data:", updatedData); // เพิ่ม log

    try {
      const response = await axios.put(
        "http://localhost:5000/api/users/update-profile",
        updatedData,
        { withCredentials: true }
      );

      console.log("Save update response:", response.data); // เพิ่ม log

      if (response.status === 200 && response.data.user) {
        setUserData((prev) => ({
          ...prev,
          ...response.data.user,
          useGooglePhoto: response.data.user.useGooglePhoto,
          googleProfileImage: response.data.user.googleProfileImage,
          isRemoved: response.data.user.isRemoved,
        }));
        alert("Profile updated successfully!");
      } else {
        alert("Failed to update profile. Please try again.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("An error occurred while updating the profile.");
    }
  };

  //ฟังก์ชันเกี่ยวกับการใช้googleเพื่่อดึงโปรไฟล์
  const handleClick = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get(
        "http://localhost:5000/api/users/getProfileGoogle",
        { withCredentials: true }
      );

      console.log("Google Profile Image Response:", response);
      // รับค่ารูปโปรไฟล์จาก Google
      const googleImage = response.data.googleProfileImage;

      // บันทึกค่าใน state
      if (googleImage) {
        setGoogleProfileImage(googleImage); // เก็บรูปภาพจาก Google
        setProfileImage(googleImage); // ถ้าต้องการใช้ Google Profile Image แทน
      } else {
        setError("No Google Profile Image found");
      }
    } catch (error) {
      console.error("Error fetching Google profile image:", error);
      setError("Failed to fetch Google profile image");
    }

    setLoading(false);
  };

  //เช็คว่าVerifyหรือยัง
  const fetchVerificationStatus = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/users/checkVerify", {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      setIsVerified(data.isVerified);
    } catch (error) {
      console.error("Error fetching verification status", error);
    }
  };

  useEffect(() => {
    fetchVerificationStatus();
  }, []);

  return (
    <>
      <Navbar />
      <NavbarUser />
      <div
        style={{
          ...styles.wrapper,
          margin: isMobileView ? "0 16px" : "0 140px",
        }}
      >
        {/* หัวข้อหลัก */}
        <div style={styles.title}>Account Settings</div>

        {/* ส่วนกล่องเตือนเมื่อ */}
        {!isVerified && (
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
              <div
                style={{
                  ...styles.alertTextWithLinks,
                  flexDirection: isMobileView ? "column" : "row",
                }}
              >
                <span style={styles.alertText}>
                  Local MLS rules require you to verify your email address
                  before you can see all home details.
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
        )}

        {/* ส่วนของกล่องโปรไฟล์ */}
        <div style={styles.container}>
          <div style={styles.header}></div>
          <div
            style={{
              ...styles.profileSection,
              alignItems: isMobileView ? "center" : "flex-start",
              flexDirection: isMobileView ? "column" : "row",
            }}
          >
            <div style={styles.avatarContainer}>
              <img
                id="profileImage"
                src={(() => {
                  console.log("Rendering image with state:", {
                    profileImage: userData?.profileImage,
                    googleProfileImage: userData?.googleProfileImage,
                    useGooglePhoto: userData?.useGooglePhoto,
                    isRemoved: userData?.isRemoved,
                    previewImage,
                  });

                  // ถ้ามี profileImage ให้ใช้ก่อน
                  if (userData?.profileImage) {
                    console.log("Using uploaded profile image");
                    return `data:image/jpeg;base64,${userData.profileImage}`;
                  }

                  // ถ้า profileImage เป็น null และ useGooglePhoto เป็น true และมี googleProfileImage
                  if (
                    !userData?.profileImage &&
                    userData?.useGooglePhoto &&
                    userData?.googleProfileImage
                  ) {
                    console.log("Using Google profile image");
                    return userData.googleProfileImage;
                  }

                  // ถ้าไม่เข้าเงื่อนไขข้างบน ให้ใช้รูป default
                  console.log("Using default image");
                  return "/png-clipart-computer-icons-user-user-heroes-black.png";
                })()}
                alt="Profile"
                style={styles.avatar}
                crossOrigin="anonymous"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  console.error("Image load error for:", e.target.src);
                  e.target.src =
                    "/png-clipart-computer-icons-user-user-heroes-black.png";
                }}
              />
              ; ;
            </div>
            <div
              style={{
                ...styles.photoActions,
                marginTop: isMobileView ? "0" : "80px",
              }}
            >
              {/* ปุ่มจะถูกเปิดเมื่อผู้ใช้กด Use Google Photo */}
              <a
                onClick={handleUseGooglePhoto}
                style={{
                  fontSize: "16px",
                  cursor: "pointer",
                }}
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
                onClick={() => document.getElementById("fileInput").click()}
                style={{
                  ...styles.photoLink,
                  fontSize: isMobileView ? "12px" : "16px",
                }}
              >
                Change Photo
              </a>

              <a
                onClick={handleRemovePhoto}
                style={{
                  ...styles.photoLink,
                  fontSize: isMobileView ? "12px" : "16px",
                }}
              >
                Remove
              </a>
            </div>
          </div>

          <form style={styles.form}>
            <div
              style={{
                ...styles.formRow,
                gridTemplateColumns: isMobileView ? "1fr" : "repeat(3, 1fr)",
              }}
            >
              <div style={styles.formGroup}>
                <label style={styles.label}>First Name *</label>
                <input
                  id="firstNameInput"
                  type="text"
                  style={styles.input}
                  defaultValue={userData?.firstName || ""}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Last Name *</label>
                <input
                  id="lastNameInput"
                  type="text"
                  style={styles.input}
                  defaultValue={userData?.lastName || ""}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Email Address *</label>
                <input
                  id="emailInput"
                  type="email"
                  style={styles.input}
                  defaultValue={userData?.email || ""}
                />
              </div>
            </div>

            <div
              style={{
                ...styles.formRow,
                gridTemplateColumns: isMobileView ? "1fr" : "repeat(3, 1fr)",
                marginTop: isMobileView ? "0" : "24px",
              }}
            >
              <div style={styles.formGroup}>
                <label style={styles.label}>Phone Number</label>
                <div
                  style={{
                    ...styles.phoneInputGroup,
                    flexDirection: isMobileView ? "column" : "row",
                    gap: isMobileView ? "8px" : "0",
                  }}
                >
                  <input
                    type="tel"
                    style={{
                      ...styles.phoneInput,
                      width: isMobileView ? "100%" : "auto",
                    }}
                  />
                  <select
                    style={{
                      ...styles.typeSelect,
                      width: isMobileView ? "100%" : "100px",
                    }}
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

              <div style={styles.formGroup}>
                <button
                  type="button"
                  onClick={() => navigate("/changepassword")}
                  style={{
                    ...styles.passwordButton,
                    marginTop: isMobileView ? "0" : "auto",
                    width: isMobileView ? "100%" : "auto",
                  }}
                >
                  Change Password
                </button>
              </div>

              <div style={styles.formGroup}>
                <button
                  type="submit"
                  onClick={handleSaveUpdates}
                  style={{
                    ...styles.saveButton,
                    marginTop: isMobileView ? "0" : "auto",
                    width: isMobileView ? "100%" : "auto",
                  }}
                >
                  Save Updates
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* ส่วนของพาร์ทเนอร์ */}
        <div style={styles.sectiontitle}>Group Settings</div>
        <div style={styles.subsectiontitle}>Your Shared Search</div>
        <div style={styles.descriptionsmall}>
          Share your favorites, comments and saved searches with others.
        </div>
        <div
          style={{
            ...styles.searchPartnerContainer,
            width: isMobileView ? "auto" : "300px",
          }}
        >
          <div
            style={styles.searchPartnerButton}
            onClick={() => setsearchPartnerModalOpen(true)}
          >
            <div
              style={{
                ...styles.searchPartnerIconWrapper,
                width: isMobileView ? "24px" : "48px",
                height: isMobileView ? "24px" : "48px",
              }}
            >
              <svg
                viewBox="0 0 24 24"
                style={{
                  ...styles.searchPartnerIcon,
                  width: isMobileView ? "16px" : "24px",
                  height: isMobileView ? "16px" : "24px",
                }}
              >
                <path
                  d="M14.33 6.746C13.702 6.296 12.847 6 11.912 6c-1.275 0-2.7.55-3.904 2.011C6.805 6.55 5.38 6 4.106 6c-.936 0-1.79.296-2.417.746C.21 7.809-.48 10.043.37 12.167c1.087 2.711 6.537 6.858 7.495 7.572.09.066.2.066.288.001.966-.717 6.484-4.898 7.495-7.573.81-2.14.161-4.358-1.319-5.421zm8 0c-1.23-.882-3.335-1.168-5.21.209.976 1.69 1.175 3.867.4 5.92-.604 1.594-2.276 3.435-3.982 5.017a55.652 55.652 0 002.327 1.847c.088.066.2.066.29 0 .965-.717 6.482-4.898 7.493-7.572.81-2.14.161-4.358-1.319-5.421z"
                  fillRule="evenodd"
                />
              </svg>
            </div>
            <span style={styles.searchPartnerText}>
              Add your search partner
            </span>
          </div>
        </div>

        {/* โมดอลพาร์ทเนอร์ */}
        {searchPartnerModalOpen && (
          <div
            style={{ ...styles.modalOverlay }}
            onClick={() => setsearchPartnerModalOpen(false)}
          >
            <div
              style={{
                ...styles.modalContent,
                minWidth:
                  isMobileView && windowSize.width < 300 ? "250px" : "300px",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={styles.headerpartner}>
                <div style={styles.titleModal}>Add a member to your search</div>
                <button
                  style={styles.closeButton}
                  onClick={() => setsearchPartnerModalOpen(false)}
                >
                  ×
                </button>
              </div>
              <div style={styles.subsectiontitle}>
                Search partners can share favorites, saved searches, comments,
                tours, and offers.
              </div>

              <input
                type="email"
                placeholder="Enter your search partner's email"
                value={partnerEmails.email}
                onChange={(e) =>
                  setPartnerEmails({ ...partnerEmails, email: e.target.value })
                }
                required
                style={styles.inputField}
              />

              <button style={styles.sendButton} onClick={handleAddPartner}>
                Send Invite
              </button>
            </div>
          </div>
        )}

        {/*ส่วนการลิงค์บัญชี*/}
        <div style={styles.sectiontitle}>Linked Accounts</div>
        <div style={styles.description}>
          Sign in to Redfin with your social apps. We never post anything on
          your behalf.
        </div>
        <div
          style={{
            ...styles.socialButtonsContainer,
            flexDirection: isMobileView ? "column" : "row",
          }}
        >
          <button
            style={{
              ...styles.socialButton,
              width: isMobileView ? "100%" : "250px",
            }}
            onClick={() => setIsFacebookLinked(!isFacebookLinked)}
          >
            <img src={facebookIcon} alt="Facebook" style={styles.icon} />
            {isFacebookLinked ? "Unlink Facebook" : "Connect Facebook"}
          </button>

          <button
            style={{
              ...styles.socialButton,
              width: isMobileView ? "100%" : "250px",
            }}
            onClick={() => setIsGoogleLinked(!isGoogleLinked)}
          >
            <img src={googleIcon} alt="Google" style={styles.icon} />
            {isGoogleLinked ? "Unlink Google" : "Connect Google"}
          </button>
        </div>

        {/* ส่วนของทัวร์ริ่ง */}
        <div style={styles.containerTouring}>
          <div style={styles.sectiontitle}>Touring and Offers</div>

          <div style={isMobileView ? styles.sectionMobile : styles.section}>
            <div style={styles.contentWrapper}>
              <div style={styles.subsectiontitle}>
                Pre-Approval Letter
                <span style={styles.status}>
                  {isPreApproved ? "Approved" : "None specified"}
                </span>
              </div>
              <div style={styles.descriptionsmall}>
                Demonstrates your ability to obtain a mortgage for the amount in
                the offer.
              </div>
            </div>
            {!isPreApproved && (
              <button
                style={
                  isMobileView
                    ? { ...styles.button, ...styles.buttonMobile }
                    : styles.button
                }
              >
                Upload letter
              </button>
            )}
          </div>

          <div style={isMobileView ? styles.sectionMobile : styles.section}>
            <div style={styles.contentWrapper}>
              <div style={styles.subsectiontitle}>
                Verify Your ID
                <span style={styles.status}>
                  {isVerified ? "Verified" : "Not yet verified"}
                </span>
              </div>
              <div style={styles.descriptionsmall}>
                To ensure the safety of our agents, we need you to verify your
                identity before we can take you on a home tour.
              </div>
            </div>
            {!isVerified && (
              <Link to="/verify">
                <button
                  style={
                    isMobileView
                      ? { ...styles.button, ...styles.buttonMobile }
                      : styles.button
                  }
                >
                  Verify ID
                </button>
              </Link>
            )}
          </div>
        </div>

        {/* ส่วนของการรับข้อเสนอ */}
        <div style={styles.containerAllow}>
          <div style={styles.checkboxContainer}>
            <input
              type="checkbox"
              checked={checked}
              style={
                checked
                  ? { ...styles.checkbox, ...styles.checkboxChecked }
                  : styles.checkbox
              }
              onChange={handleChange}
            />
            {checked && (
              <svg viewBox="0 0 102 102" style={styles.checkmark}>
                <path d="M35 91.6 1 57.6 16.1 42.5 35 61.4 85.9 10.4 101 25.5z"></path>
              </svg>
            )}
          </div>

          <label htmlFor="offer-insights" style={styles.labelAllow}>
            Allow offer insights
          </label>
          <div style={styles.tooltipContainer}>
            <div style={styles.infoIcon} onClick={toggleTooltip}>
              <svg
                className="SvgIcon label-info"
                viewBox="0 0 24 24"
                style={{ width: "14px", height: "14px" }}
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  fill="#585858"
                  d="M12 0c6.617 0 12 5.383 12 12s-5.383 12-12 12S0 18.617 0 12 5.383 0 12 0zm1 16v-5.75a.25.25 0 00-.25-.25h-2.5a.25.25 0 00-.25.25V12h1v4h-1v1.75c0 .138.112.25.25.25h3.5a.25.25 0 00.25-.25V16h-1zm-.25-8h-1.5a.25.25 0 01-.25-.25v-1.5a.25.25 0 01.25-.25h1.5a.25.25 0 01.25.25v1.5a.25.25 0 01-.25.25z"
                ></path>
              </svg>
            </div>

            {showTooltip && (
              <div
                style={{
                  ...styles.tooltipBox,
                  width: isMobileView ? "300px" : "400px",
                  fontSize: isMobileView ? "12px" : "14px",
                  left: isMobileView ? "-40px" : "50%",
                }}
              >
                <strong>Offer Insights</strong>
                <br />
                This feature helps other buyers understand local trends and get
                a sense of what it takes to win in different neighborhoods. If
                you make an offer with Redfin, we’ll publish anonymized data on
                whether you won, how many competing offers you faced, how long
                the property was on the market, how much you offered compared to
                the list price, and the rough amount of the planned
                down-payment.
              </div>
            )}
          </div>
        </div>
        <div style={styles.descriptionsmall}>
          Allow offer insights for offers that you submit.
        </div>

        {/* ส่วนของการลบบัญชี */}
        <div style={styles.sectiontitle}>Close Account</div>
        <div style={styles.descriptionsmall}>
          This will remove your login information from our system and you will
          not be able to login again. It cannot be undone.
        </div>
        <button
          style={{
            ...styles.deleteButton,
            width: isMobileView ? "100%" : "250px",
          }}
          onClick={() => setdeleteAccountModalOpen(true)}
        >
          Delete Your Account
        </button>

        {/* โมดอลลบบัญชี */}
        {deleteAccountModalOpen && (
          <div
            style={styles.modalOverlay}
            onClick={() => setdeleteAccountModalOpen(false)}
          >
            <div
              style={styles.modalContent}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={styles.headerpartner}>
                <div style={styles.titleModal}>Delete Account</div>
                <button
                  style={styles.closeButton}
                  onClick={() => setdeleteAccountModalOpen(false)}
                >
                  ×
                </button>
              </div>
              <div style={styles.subsectiontitle}>
                Are you sure you want to delete your account? This cannot be
                undone.
              </div>
              <div style={styles.buttonContainer}>
                <button
                  style={styles.whiteButton}
                  onClick={() => setdeleteAccountModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  style={styles.redButton}
                  onClick={handleDelete}
                  disabled={isLoading}
                >
                  {isLoading ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}
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
    lineHeight: "1.5",
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
  },
  photoLink: {
    background: "none",
    border: "none",
    color: "#1080a2",
    cursor: "pointer",
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
    padding: "8px 16px",
    fontSize: "16px",
    color: "#4b5563",
    backgroundColor: "#e2e2e2",
    border: "1px solid #ccc",
    cursor: "pointer",
    fontWeight: "600",
    fontFamily:
      '"Libre Franklin", -apple-system, BlinkMacSystemFont, Roboto, "Droid Sans", Helvetica, Arial, sans-serif',
  },
  saveButton: {
    width: "100%",
    height: "40px",
    padding: "8px 16px",
    fontSize: "16px",
    color: "#ffffff",
    backgroundColor: "#c82021",
    border: "1px solid #d1d5db",
    cursor: "pointer",
    fontWeight: "600",
    fontFamily:
      '"Libre Franklin", -apple-system, BlinkMacSystemFont, Roboto, "Droid Sans", Helvetica, Arial, sans-serif',
  },

  sectiontitle: {
    fontSize: "22px",
    marginTop: "20px",
    color: "#333",
    marginBottom: "10px",
  },
  subsectiontitle: {
    fontSize: "16px",
    color: "#333",
    display: "flex",
    alignItems: "center",
    gap: "8px",
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

  searchPartnerContainer: {
    backgroundColor: "#fff",
    border: "2px dashed #ddd",
    boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
    padding: "35px 20px",
    marginBottom: "20px",
  },
  searchPartnerButton: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    cursor: "pointer",
  },
  searchPartnerIconWrapper: {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    backgroundColor: "#f3f4f6",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid #d1d5db",
  },
  searchPartnerPlus: {
    fontSize: "24px",
    color: "#4b5563",
    fontWeight: "300",
  },
  searchPartnerIcon: {
    fill: "#4b5563",
  },
  searchPartnerText: {
    color: "#4b5563",
    fontSize: "16px",
    fontFamily:
      '"Libre Franklin", -apple-system, BlinkMacSystemFont, Roboto, "Droid Sans", Helvetica, Arial, sans-serif',
  },

  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    zIndex: 1000,
  },
  modalContent: {
    background: "#fff",
    padding: "20px",
    minWidth: "300px",
    maxWidth: "600px",
    boxSizing: "border-box",
    position: "relative",
    width: "80%",
  },
  headerpartner: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "15px",
  },
  titleModal: {
    fontSize: "24px",
    marginBottom: "0",
    color: "#333",
    fontWeight: "600",
    lineHeight: "1",
  },
  closeButton: {
    background: "transparent",
    border: "none",
    fontSize: "50px",
    cursor: "pointer",
    color: "#888",
    lineHeight: "1",
    padding: "0",
  },
  inputField: {
    width: "100%",
    padding: "10px",
    margin: "10px 0",
    border: "1px solid #ccc",
  },
  sendButton: {
    background: "#DC2626",
    color: "#fff",
    padding: "8px 16px",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "600",
    marginLeft: "auto",
    display: "block",
    fontFamily:
      '"Libre Franklin", -apple-system, BlinkMacSystemFont, Roboto, "Droid Sans", Helvetica, Arial, sans-serif',
  },

  socialButtonsContainer: {
    display: "flex",
    gap: "20px",
    marginBottom: "50px",
    alignItems: "center",
  },
  socialButton: {
    width: "250px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center", // จัดข้อความให้อยู่ตรงกลาง
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
    position: "relative", // สำหรับวางไอคอนแบบ absolute
  },
  buttonText: {
    flex: 1,
    textAlign: "center",
  },
  icon: {
    width: "20px",
    position: "absolute",
    left: "20px",
  },

  containerTouring: {
    width: "100%",
  },
  section: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "8px",
    paddingBottom: "16px",
    marginTop: "8px",
  },
  sectionMobile: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    marginBottom: "8px",
    paddingBottom: "16px",
    marginTop: "8px",
  },
  contentWrapper: {
    flex: 1,
  },
  status: {
    color: "#ef4444",
    fontSize: "14px",
    fontWeight: "normal",
    marginLeft: "8px",
  },
  button: {
    backgroundColor: "#f5f5f5",
    border: "1px solid #D1D5DB",
    borderRadius: "4px",
    padding: "8px 16px",
    color: "#585858",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    fontFamily:
      '"Libre Franklin", -apple-system, BlinkMacSystemFont, Roboto, "Droid Sans", Helvetica, Arial, sans-serif',
    minWidth: "120px",
    ":hover": {
      backgroundColor: "#F9FAFB",
    },
  },
  buttonMobile: {
    alignSelf: "flex-start",
  },

  containerAllow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    position: "relative",
  },
  tooltipContainer: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  tooltipBox: {
    position: "absolute",
    bottom: "100%",
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 1000,
    backgroundColor: "#fff",
    padding: "12px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.15)",
    width: "400px",
    maxHeight: "400px",
    overflowY: "auto",
    whiteSpace: "normal",
    wordWrap: "break-word",
    lineHeight: "1.4",
    marginBottom: "8px",
    fontSize: "14px",
    textAlign: "justify",
    fontFamily:
      '"Libre Franklin", -apple-system, BlinkMacSystemFont, Roboto, "Droid Sans", Helvetica, Arial, sans-serif',
    color: "#585858",
  },
  checkboxContainer: {
    position: "relative",
    display: "inline-block",
    width: "24px",
    height: "24px",
  },
  checkbox: {
    cursor: "pointer",
    width: "20px",
    height: "20px",
    border: "0.5px solid  #585858",
    backgroundColor: "#fff",
    appearance: "none",
    position: "relative",
  },
  checkboxChecked: {
    backgroundColor: "#1080a2",
    borderColor: "#1080a2",
  },
  checkmark: {
    position: "absolute",
    top: "44%",
    left: "44%",
    transform: "translate(-50%, -50%)",
    width: "16px",
    height: "16px",
    fill: "#fff",
    pointerEvents: "none",
  },
  infoIcon: {
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
  },
  labelAllow: {
    fontSize: "16px",
    color: "#333",
  },

  deleteButton: {
    width: "250px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "2px",
    cursor: "pointer",
    backgroundColor: "#C82021",
    fontSize: "16px",
    gap: "20px",
    color: "#fff",
    fontWeight: "600",
    fontFamily:
      '"Libre Franklin", -apple-system, BlinkMacSystemFont, Roboto, "Droid Sans", Helvetica, Arial, sans-serif',
  },

  buttonContainer: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    marginTop: "15px",
    flexDirection: "row",
  },
  whiteButton: {
    backgroundColor: "#fff",
    color: "#585858",
    padding: "10px 20px",
    border: "1px solid #585858",
    cursor: "pointer",
    fontSize: "14px",
    minWidth: "90px",
  },
  redButton: {
    backgroundColor: "#C82021",
    color: "#fff",
    padding: "10px 20px",
    border: "none",
    cursor: "pointer",
    fontSize: "14px",
    minWidth: "90px",
  },
};

export default AccountSettings;
