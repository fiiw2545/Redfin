import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import ServicesSection from "../components/ServicesSection/ServicesSection";
import SearchLinksSection from "../components/SearchLinksSection/SearchLinksSection";
import { useGlobalEvent } from "../context/GlobalEventContext";
import "./styles/HomePage.css";

const HomePage = () => {
  const { windowSize } = useGlobalEvent();
  const isMobileView = windowSize.width < 670;
  const [visible, setVisible] = useState(false);
  const location = useLocation();

  // ดึงค่า verifyToken จาก URL query
  const params = new URLSearchParams(location.search);
  const verifyToken = params.get("verifyToken");

  // ฟังก์ชัน Verify Email
  const verifyEmail = async (token) => {
    try {
      await axios.post(
        "http://localhost:5000/api/users/verify-email",
        { verifyToken: token },
        { withCredentials: true }
      );
    } catch (error) {
      console.error("Verification failed:", error);
    }
  };

  // ฟังก์ชันเช็คสถานะจากฐานข้อมูลและกำหนดการแสดงแบนเนอร์
  const checkBannerVisibility = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/users/checkBanner",
        { withCredentials: true }
      );

      console.log("API checkBannerStatus response:", response.data);

      if (!response.data.hasSeenBanner) {
        console.log("✅ User has NOT seen the banner, setting visible to TRUE");
        setVisible(true); // แสดงแบนเนอร์
      } else {
        console.log("❌ User HAS seen the banner, keeping it hidden");
      }
    } catch (error) {
      console.error("Error fetching banner status", error);
    }
  };

  // ตรวจสอบ verifyToken และสถานะการแสดงแบนเนอร์
  useEffect(() => {
    if (verifyToken) {
      verifyEmail(verifyToken);
    }
    checkBannerVisibility();
  }, [verifyToken]);

  // เมื่อกดปิดแบนเนอร์
  const handleCloseBanner = async () => {
    setVisible(false);
    try {
      await axios.post(
        "http://localhost:5000/api/users/updateBannerStatus",
        {},
        { withCredentials: true }
      );
    } catch (error) {
      console.error("Error updating banner status", error);
    }
  };

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        {visible && (
          <div
            style={{
              ...styles.banner,
              ...(isMobileView && styles.bannerMobile),
            }}
          >
            <div
              style={{
                ...styles.content,
                ...(isMobileView && styles.contentMobile),
              }}
            >
              <img
                src="https://ssl.cdn-redfin.com/cop-assets/prod/hpwidget/redfinagent.png"
                alt="Verified Illustration"
                style={{
                  ...styles.image,
                  ...(isMobileView && styles.imageMobile),
                }}
              />
              <div style={styles.textContainer}>
                <h2 style={styles.title}>
                  🎉 You’re in! We’ve verified your email.
                </h2>
                <p style={styles.description}>
                  Now you can save searches, share lists of homes you love with
                  a search partner, and track your home’s Redfin Estimate.
                </p>
              </div>
            </div>
            <button
              style={{
                ...styles.button,
                ...(isMobileView && styles.buttonMobile),
              }}
              onClick={handleCloseBanner}
            >
              OK
            </button>
          </div>
        )}
      </div>

      <SearchTab />
      <ServicesSection />
      <AppSection />
      <ContactForm />
      <SearchLinksSection />
      <Footer />
    </>
  );
};

// SearchTab
const SearchTab = () => {
  return (
    <div className="search-tab">
      <div className="overlay">
        <h1 className="hero-title">
          Find the right home <br /> at the right price
        </h1>
        <div className="tabs">
          <a href="#" className="tab active">
            Buy
          </a>
          <a href="#" className="tab">
            Rent
          </a>
          <a href="#" className="tab">
            Sell
          </a>
          <a href="#" className="tab">
            Mortgage
          </a>
          <a href="#" className="tab">
            Home Estimate
          </a>
        </div>
        <div className="search-bar">
          <input
            type="text"
            className="search-input"
            placeholder="City, Address, School, Agent, ZIP"
          />
          <button className="search-button">
            <svg
              className="search-icon"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M23.884 21.763l-7.554-7.554a8.976 8.976 0 001.526-6.835C17.203 3.68 14.204.72 10.502.122a9.01 9.01 0 00-10.38 10.38c.598 3.702 3.558 6.7 7.252 7.354a8.976 8.976 0 006.835-1.526l7.554 7.554a.25.25 0 00.353 0l1.768-1.768a.25.25 0 000-.353zM2 9c0-3.86 3.14-7 7-7s7 3.14 7 7-3.14 7-7 7-7-3.14-7-7z"
                fill="#ffffff"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

// AppSection
const AppSection = () => {
  return (
    <div className="app-section">
      <div className="app-download">
        <div className="app-download-content">
          <h2>Get the Redfin app</h2>
          <p>
            Download our top-rated real estate app for iOS or Android to get
            alerts when your dream home hits the market.
          </p>
        </div>
        <div className="qr-content">
          <img
            src="https://ssl.cdn-redfin.com/v561.1.0/images/homepage/banners/download.jpg"
            alt="QR code to download the app"
            className="qr-code"
          />
        </div>
      </div>

      <div className="tour-section">
        <div className="tour-image">
          <img
            src="https://ssl.cdn-redfin.com/cop-assets/prod/hpwidget/tour_updated.jpg"
            alt="People touring a house"
          />
        </div>
        <div className="tour-content">
          <h2>Start touring homes, no strings attached</h2>
          <p>
            Unlike many other agents, Redfin agents won’t ask you to sign an
            exclusive commitment before they’ll take you on a first tour.
          </p>
          <button className="search-button">Search for homes</button>
        </div>
      </div>
    </div>
  );
};

// ContactForm
const ContactForm = () => {
  return (
    <div className="contact-form-container">
      <div className="form-header">
        <h2>Talk to a Redfin agent</h2>
        <p>
          You’ll be connected with an expert local agent—there’s no pressure or
          obligation.
        </p>
      </div>
      <form className="contact-form">
        <div className="contact-form-group">
          <label htmlFor="location">Where are you searching for homes? *</label>
          <div className="contact-search-box">
            <input
              type="text"
              id="location"
              placeholder="City, Address, ZIP"
              required
            />
            <button type="button" className="contact-search-button"></button>
          </div>
        </div>
        <div className="contact-form-group">
          <label htmlFor="email">Email *</label>
          <input
            type="email"
            id="email"
            placeholder="redfin@redfin.com"
            required
          />
        </div>
        <div className="contact-form-group">
          <label htmlFor="phone">Phone *</label>
          <input type="tel" id="phone" placeholder="( ) -" required />
        </div>
        <div className="contact-form-group">
          <label htmlFor="message">What can we help you with? *</label>
          <textarea
            id="message"
            placeholder="I'm interested in buying, selling or a free consult with a Redfin agent."
            required
          ></textarea>
        </div>
        <button type="submit" className="contact-submit-button">
          Submit
        </button>
        <p className="contact-form-footer">
          You are creating a Redfin account and agree to our{" "}
          <a href="#">Terms of Use</a> and <a href="#">Privacy Policy</a>.
        </p>
      </form>
    </div>
  );
};

const styles = {
  container: {
    borderTop: "1px solid #d1d1d1",
    justifyContent: "center",
    padding: "0 20px",
  },
  banner: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: "20px 80px",
    borderRadius: "4px",
    width: "100%",
    fontFamily:
      '"Libre Franklin", -apple-system, BlinkMacSystemFont, Roboto, "Droid Sans", Helvetica, Arial, sans-serif',
    flexWrap: "nowrap",
    gap: "5px",
  },
  bannerMobile: {
    flexDirection: "column",
    textAlign: "center",
    padding: "12px 16px",
  },
  content: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    flexWrap: "nowrap",
    flexGrow: 1,
    minWidth: "0",
  },
  contentMobile: {
    flexDirection: "column",
    textAlign: "center",
  },
  image: {
    width: "100px",
    height: "100px",
    flexShrink: 0,
  },
  imageMobile: {
    width: "60px",
    height: "60px",
  },
  textContainer: {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    minWidth: "0",
  },
  title: {
    fontSize: "16px",
    fontWeight: "bold",
    color: "#333",
    margin: "0",
  },
  description: {
    fontSize: "14px",
    color: "#333",
    whiteSpace: "normal",
    wordBreak: "break-word",
    textAlign: "justify",
    letterSpacing: "0.2px",
  },
  button: {
    background: "none",
    border: "1px solid #333333",
    padding: "12px 24px",
    fontSize: "14px",
    fontWeight: "600",
    color: "#333333",
    borderRadius: "3px",
    cursor: "pointer",
    marginLeft: "auto",
    marginRight: "20px",
  },
  buttonMobile: {
    marginTop: "12px",
    width: "100%",
  },
};

export default HomePage;
