// src/pages/HomePage.jsx
import React, { useState, useEffect } from "react";
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

  const isVerifiedEmail = true; // จะต้องรับค่ามาอีกทีว่า verify อีเมลล์หรือยัง
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // ตรวจสอบว่าผู้ใช้เคยเห็นยัง
    const hasSeenBanner =
      localStorage.getItem("hasSeenVerifiedBanner") === "true";

    // ถ้าอีเมลล์เคย verify แล้วและยังไม่เคยเห็นแบนเนอร์ ให้แสดงแบนเนอร์
    if (isVerifiedEmail && !hasSeenBanner) {
      setVisible(true);
    }
  }, []);

  // เมื่อกด OK ให้ซ่อนแบนเนอร์และบันทึกค่าใน localStorage
  const handleCloseBanner = () => {
    setVisible(false);
    localStorage.setItem("hasSeenVerifiedBanner", "true");
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
                  You’re in! We’ve verified your email.
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
    cursor: "pointer",
    borderRadius: "4px",
    transition: "background 0.2s",
    fontWeight: "bold",
    fontFamily:
      '"Libre Franklin", -apple-system, BlinkMacSystemFont, Roboto, "Droid Sans", Helvetica, Arial, sans-serif',
    whiteSpace: "nowrap",
  },
  buttonMobile: {
    marginTop: "10px",
    width: "100%",
  },
};

export default HomePage;
