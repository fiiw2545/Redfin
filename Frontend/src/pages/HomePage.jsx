import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import SearchTabs from "../components/SearchTabs/SearchTabs";
import ServicesSection from "../components/ServicesSection/ServicesSection";
import SearchLinksSection from "../components/SearchLinksSection/SearchLinksSection";
import ContactForm from "../components/ContactForm/ContactForm";
import AppSection from "../components/AppSection/AppSection";
import { useGlobalEvent } from "../context/GlobalEventContext";

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

      <SearchTabs />
      <ServicesSection />
      <AppSection />
      <ContactForm />
      <SearchLinksSection />
      <Footer />
    </>
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
