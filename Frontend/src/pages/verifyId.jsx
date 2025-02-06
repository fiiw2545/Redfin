import React, { useState } from "react";
import { useGlobalEvent } from "../context/GlobalEventContext";
import Navbar from "../components/Navbar/Navbar";

const VerifyId = () => {
  const { windowSize } = useGlobalEvent();
  const isMobileView = windowSize.width < 980;

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    birthDate: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div style={styles.global}>
      <Navbar />
      <div style={styles.PageBody}>
        <div
          style={{
            ...styles.Card,
            padding: isMobileView ? "24px 16px" : "32px",
          }}
        >
          <h1 style={styles.title}>
            For agent safety, please verify your identity.
          </h1>
          <p style={styles.subtitle}>
            This information isn't shared with anyone and is only used to verify
            your identity.
          </p>
          <form style={styles.form}>
            <div style={styles.row}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>First Name</label>
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  style={styles.input}
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  style={styles.input}
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Street Address</label>
              <input
                type="text"
                name="street"
                placeholder="Street Address"
                style={styles.input}
                value={formData.street}
                onChange={handleChange}
              />
            </div>
            <div style={styles.row}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>City</label>
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  style={styles.input}
                  value={formData.city}
                  onChange={handleChange}
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>State</label>
                <select
                  name="state"
                  style={styles.input}
                  value={formData.state}
                  onChange={handleChange}
                >
                  <option value="">State</option>
                  <option value="AL">Alabama</option>
                  <option value="AK">Alaska</option>
                  <option value="AZ">Arizona</option>
                  <option value="AR">Arkansas</option>
                </select>
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>ZIP Code</label>
                <input
                  type="text"
                  name="zipcode"
                  placeholder="ZIP Code"
                  style={styles.input}
                  value={formData.zipcode}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Birthdate</label>
              <input
                type="date"
                name="birthDate"
                placeholder="dd/mm/yyyy"
                locale="en-US"
                style={styles.input}
                value={formData.birthDate}
                onChange={handleChange}
              />
            </div>
            <button type="submit" style={styles.submitButton}>
              Next
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const styles = {
  global: {
    fontFamily: "Libre Franklin, sans-serif",
    margin: 0,
    padding: 0,
    boxSizing: "border-box",
  },
  PageBody: {
    backgroundImage:
      "url(https://images.hdqwalls.com/download/sunset-at-st-mary-lake-glacier-national-park-5k-l3-1600x900.jpg)",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    padding: "20px",
  },
  Card: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    maxWidth: "600px",
    width: "100%",
    padding: "20px",
    borderRadius: "8px",
  },
  title: {
    fontSize: "20px",
    fontWeight: "600",
    marginBottom: "10px",
  },
  subtitle: {
    fontSize: "14px",
    color: "#666",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  row: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },
  inputGroup: {
    flex: "1",
    minWidth: "150px",
  },
  label: {
    fontSize: "14px",
    marginBottom: "5px",
    color: "#333",
  },
  input: {
    width: "100%",
    padding: "10px",
    fontSize: "14px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    boxSizing: "border-box",
  },
  submitButton: {
    backgroundColor: "#D32F2F",
    color: "#fff",
    padding: "12px",
    fontSize: "16px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "600",
    marginTop: "10px",
  },
};

export default VerifyId;
