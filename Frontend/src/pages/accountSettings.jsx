import React from "react";
import Navbar from "../components/Navbar/Navbar";
import NavbarUser from "../components/NavbarUser/NavbarUser";
import googleIcon from "../img/google-icon.png";
import Footer from "../components/Footer/Footer";
import { useState } from "react";
const AccountSettings = () => {
  const [selectedValue, setSelectedValue] = useState("");
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
                <a href="#verify" style={styles.alertLink}>
                  Go to Email
                </a>
                <span> • </span>
                <a href="#resend" style={styles.alertLink}>
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
                src="https://images.hdqwalls.com/download/sunset-at-st-mary-lake-glacier-national-park-5k-l3-1600x900.jpg"
                alt="Profile"
                style={styles.avatar}
              />
            </div>
            <div style={styles.photoActions}>
              <a href="#" style={styles.photoLink}>
                Use Google Photo
              </a>
              <a href="#" style={styles.photoLink}>
                Change Photo
              </a>
              <a href="#" style={styles.photoLink}>
                Remove
              </a>
            </div>
          </div>

          <form style={styles.form}>
            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>First Name *</label>
                <input type="text" defaultValue="Nyx" style={styles.input} />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Last Name *</label>
                <input type="text" style={styles.input} />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Email Address *</label>
                <input
                  type="email"
                  defaultValue="kantapongmini@gmail.com"
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
                    <option value="cell">ฉell</option>
                    <option value="home">Home</option>
                    <option value="office">Office</option>
                  </select>
                </div>
              </div>

              <div style={styles.formGroup}>
                <button type="button" style={styles.passwordButton}>
                  Change Password
                </button>
              </div>

              <div style={styles.formGroup}>
                <button type="submit" style={styles.saveButton}>
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
