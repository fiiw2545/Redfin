import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { properties } from "../data/properties";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
const PropertyDetails = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Overview");

  // 🏷️ สร้าง reference สำหรับแต่ละส่วน
  const photoRef = useRef(null);
  const overviewRef = useRef(null);
  const detailsRef = useRef(null);
  const tabs = ["Photo", "Overview", "Property details"];

  // 📌 ฟังก์ชันเลื่อนไปยังตำแหน่งที่เลือก
  const scrollToSection = (section) => {
    setActiveTab(section);
    const sectionRef =
      section === "Photo"
        ? photoRef
        : section === "Overview"
        ? overviewRef
        : detailsRef;

    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  useEffect(() => {
    let timeout;
    const options = { root: null, threshold: 0.6 };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          clearTimeout(timeout);
          timeout = setTimeout(() => {
            setActiveTab(entry.target.getAttribute("data-section"));
          }, 100); // หน่วงเวลา 100ms เพื่อป้องกันการเปลี่ยนค่าเร็วเกินไป
        }
      });
    }, options);
    console.log("Observing sections...");
    if (photoRef.current) observer.observe(photoRef.current);
    if (overviewRef.current) observer.observe(overviewRef.current);
    if (detailsRef.current) observer.observe(detailsRef.current);

    return () => {
      clearTimeout(timeout);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <Navbar />
      {/* Navigation Tabs */}
      <div style={NavStyles.navbar}>
        <button
          onClick={() => navigate("/test")}
          style={NavStyles.backButton}
          aria-label="Go back to search"
        >
          <BackIcon />
          <span>Search</span>
        </button>

        <div style={NavStyles.navLinks}>
          {tabs.map((tab, index) => (
            <div
              key={index}
              onClick={() => scrollToSection(tab)}
              style={{
                ...NavStyles.tabWrapper,
                ...(tab === activeTab ? NavStyles.activeTabWrapper : {}),
              }}
            >
              <button
                style={{
                  ...NavStyles.tab,
                  fontWeight: tab === activeTab ? "bold" : "normal",
                  color: tab === activeTab ? "#000" : "#6b7280",
                }}
              >
                {tab}
              </button>
              {tab === activeTab && (
                <div style={NavStyles.activeIndicator}></div>
              )}
            </div>
          ))}
        </div>

        <div style={NavStyles.navActions}>
          <span style={NavStyles.actionItem}>
            <HeartIcon /> Favorite
          </span>
          <span style={NavStyles.actionItem}>
            <HideIcon /> Hide
          </span>
          <span style={NavStyles.actionItem}>
            <ShareIcon /> Share
          </span>
        </div>
      </div>

      {/* ส่วนแสดงภาพ*/}
      <div
        ref={photoRef}
        data-section="Photo"
        style={{ scrollMarginTop: "60px" }}
      >
        <PropertyGallery />
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          gap: "30px",
          marginTop: "20px",
        }}
      >
        {/* Left section with OverviewCard and PropertyDetailsCard */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: "1",
            maxWidth: "900px",
          }}
        >
          <div
            ref={overviewRef}
            data-section="Overview"
            style={{ scrollMarginTop: "60px" }}
          >
            <OverviewCard />
          </div>

          <div
            ref={detailsRef}
            data-section="Property details"
            style={{ scrollMarginTop: "60px" }}
          >
            <PropertyDetailsCard />
          </div>
        </div>

        {/* Right section with ContactCard */}
        <div style={{ position: "sticky", top: "56px", width: "380px" }}>
          <ContactCard />
        </div>
      </div>

      <Footer />
    </>
  );
};

const NavStyles = {
  navbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: "8px 24px",
    borderBottom: "2px solid #e5e7eb",
    backgroundColor: "#fff",
    position: "sticky",
    top: 0,
    zIndex: 10,
    fontFamily: `"Inter", -apple-system, BlinkMacSystemFont, "Roboto", "Droid Sans", "Helvetica", "Arial", sans-serif`,
  },
  backButton: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "16px",
    fontWeight: "600",
    color: "#005a76",
    background: "none",
    border: "none",
    cursor: "pointer",
    fontFamily: `"Inter", -apple-system, BlinkMacSystemFont, "Roboto", "Droid Sans", "Helvetica", "Arial", sans-serif`,
  },
  navLinks: {
    display: "flex",
    gap: "24px",
    fontSize: "16px",
    color: "#6b7280",
    marginLeft: "20px",
  },
  tabWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    position: "relative",
    cursor: "pointer",
    padding: "10px 16px",
  },
  activeTabWrapper: {
    fontWeight: "bold",
    color: "#000",
  },
  tab: {
    border: "none",
    background: "none",
    fontSize: "16px",
    fontWeight: "normal",
    cursor: "pointer",
    fontFamily: `"Inter", -apple-system, BlinkMacSystemFont, "Roboto", "Droid Sans", "Helvetica", "Arial", sans-serif`,
  },
  activeIndicator: {
    position: "absolute",
    bottom: "-9px",
    left: "0",
    width: "100%",
    height: "3px",
    backgroundColor: "black",
  },
  navActions: {
    display: "flex",
    gap: "20px",
    fontSize: "14px",
    color: "#6b7280",
    cursor: "pointer",
    marginLeft: "auto",
    fontFamily: `"Inter", -apple-system, BlinkMacSystemFont, "Roboto", "Droid Sans", "Helvetica", "Arial", sans-serif`,
  },
  actionItem: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
  },
};

const PropertyGallery = () => {
  const { id } = useParams();
  const property = properties.find((p) => p.id === parseInt(id));
  const images = property.images.slice(0, 7);
  const totalPhotos = property.images.length;
  return (
    <div style={GalleryStyles.container}>
      <div style={GalleryStyles.mainImageContainer}>
        <img
          src={images[0]}
          alt="Main Property"
          style={GalleryStyles.mainImage}
        />
      </div>
      <div style={GalleryStyles.subImagesContainer}>
        {images.slice(1, 7).map((image, index) => (
          <div key={index} style={GalleryStyles.subImageWrapper}>
            <img
              src={image}
              alt={`Sub ${index + 1}`}
              style={GalleryStyles.subImage}
            />
            {index === 5 && totalPhotos > 7 && (
              <div style={GalleryStyles.photoButton}>
                <svg
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  fill="white"
                  style={{ marginRight: "6px" }}
                >
                  <path d="M15.988 10a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path>
                  <path d="M3.488 5a2 2 0 012-2h14a2 2 0 012 2v14a2 2 0 01-2 2h-14a2 2 0 01-2-2V5zm16 0h-14v7.92l3.375-2.7a1 1 0 011.25 0l4.3 3.44 1.368-1.367a1 1 0 011.414 0l2.293 2.293V5zm-14 14h14v-1.586l-3-3-1.293 1.293a1 1 0 01-1.332.074l-4.375-3.5-4 3.2V19z"></path>
                </svg>
                {totalPhotos} Photos
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const GalleryStyles = {
  container: {
    display: "flex",
    gap: "5px",
    borderRadius: "8px",
    overflow: "hidden",
    marginTop: "16px",
    width: "100%",
    maxWidth: "1520px",
    padding: "5px 10px 0px",
    boxSizing: "border-box",
    justifyContent: "center",
    margin: "auto",
  },
  mainImageContainer: {
    flexGrow: 1,
    flexBasis: "40%",
    minWidth: "592px",
    maxWidth: "700px",
    aspectRatio: "592 / 400",
  },
  mainImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: "8px",
  },
  subImagesContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gridTemplateRows: "repeat(2, 1fr)",
    gap: "5px",
    flexGrow: 1,
    flexBasis: "60%",
    minWidth: "888px",
    maxWidth: "1050px",
  },
  subImageWrapper: {
    position: "relative",
    flexGrow: 1,
    flexBasis: "20%",
    minWidth: "296px",
    maxWidth: "350px",
  },
  subImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: "6px",
  },
  photoButton: {
    position: "absolute",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    color: "#fff",
    fontWeight: "bold",
    borderRadius: "6px",
    cursor: "pointer",
    textAlign: "center",
    fontSize: "14px",
    gap: "5px",
  },
};

const OverviewCard = () => {
  const { id } = useParams();
  const property = properties.find((p) => p.id === parseInt(id));
  if (!property) return <div>Property not found</div>;
  const [showFullDescription, setShowFullDescription] = useState(false);

  // ดึงค่า `status`
  const status = Array.isArray(property.status)
    ? property.status[0]
    : property.status;
  const cleanedStatus = status?.toString().trim().toLowerCase();

  // คำนวณราคา Price per Sq.Ft.
  const pricePerSqFt = property.details.sqft
    ? (property.price / property.details.sqft).toFixed(0)
    : "-";

  // ฟังก์ชันแปลงวันที่ Listed Date
  const formattedDate = new Date(property.listedDate).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  // คำที่ต้องการไฮไลต์
  const highlightWords = [
    "Welcome",
    "lakefront",
    "fitness center",
    "bike storage",
    "laundry center",
    "vintage courtyard building",
    "Montrose Beach",
  ];

  // ฟังก์ชันเพิ่มสำหรับไฮไลต์คำ
  const highlightText = (text) => {
    const regex = new RegExp(`(${highlightWords.join("|")})`, "gi");
    return text.split(regex).map((part, index) =>
      highlightWords.some(
        (word) => word.toLowerCase() === part.toLowerCase()
      ) ? (
        <span key={index} style={{ fontWeight: "bold", color: "#15727A" }}>
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const renderPropertyIcon = (propertyType) => {
    const normalizedType = propertyType.toLowerCase();
    switch (normalizedType) {
      case "condo":
        return (
          <svg viewBox="0 0 24 24" style={OverviewCardStyles.icontype}>
            <path d="M7 9a1 1 0 100 2h3a1 1 0 100-2H7zM7 13a1 1 0 100 2h3a1 1 0 100-2H7zM7 17a1 1 0 100 2h3a1 1 0 100-2H7z"></path>
            <path d="M4.683 1.548A2 2 0 002 3.428V21a2 2 0 002 2h16a2 2 0 002-2V11a2 2 0 00-2-2h-5V6.7a2 2 0 00-1.316-1.88l-9-3.272zM15 17v-2h2a1 1 0 100-2h-2v-2h5v10h-5v-2h2a1 1 0 100-2h-2zM13 6.7V21H4V3.428L13 6.7z"></path>
          </svg>
        );
      case "house":
        return (
          <svg viewBox="0 0 24 24" style={OverviewCardStyles.icontype}>
            <path d="M11.336 3.253a1 1 0 011.328 0l9 8a1 1 0 01-1.328 1.494L20 12.45V19a2 2 0 01-2 2H6a2 2 0 01-2-2v-6.55l-.336.297a1 1 0 01-1.328-1.494l9-8zM6 10.67V19h3v-5a1 1 0 011-1h4a1 1 0 011 1v5h3v-8.329l-6-5.333-6 5.333zM13 19v-4h-2v4h2z"></path>
          </svg>
        );
      case "townhouse":
        return (
          <svg viewBox="0 0 24 24" style={OverviewCardStyles.icontype}>
            <path d="M9 10a1 1 0 11-2 0 1 1 0 012 0zM9 14a1 1 0 11-2 0 1 1 0 012 0zM16 11a1 1 0 100-2 1 1 0 000 2zM16 15a1 1 0 100-2 1 1 0 000 2z"></path>
            <path d="M8.017 2a1 1 0 01.764.375L12 6.4l3.22-4.024a1 1 0 011.54-.026l6 7a1 1 0 01-1.52 1.302L21 10.37V20a2 2 0 01-2 2H5a2 2 0 01-2-2v-9.63l-.24.28a1 1 0 01-1.52-1.3l6-7A1 1 0 018.018 2zM5 8.037V20h2v-2a1 1 0 112 0v2h2V8.35L7.973 4.569 5 8.037zm8 .314V20h2v-2a1 1 0 112 0v2h2V8.037l-2.973-3.47L13 8.352z"></path>
          </svg>
        );
      case "land":
        return (
          <svg viewBox="0 0 25 24" style={OverviewCardStyles.icontype}>
            <path d="M11.282 15.602v-4.139l-2.75-2.75a.917.917 0 111.296-1.296l1.454 1.453V7.417a.917.917 0 011.833 0v4.203l1.454-1.453a.917.917 0 111.296 1.296l-2.75 2.75v1.389a6.418 6.418 0 00-.917-12.769 6.417 6.417 0 00-.916 12.769zm0 1.848a8.251 8.251 0 111.833 0v4.633a.917.917 0 11-1.833 0V17.45z"></path>
          </svg>
        );
      case "mobile":
        return (
          <svg viewBox="0 0 24 24" style={OverviewCardStyles.icontype}>
            <path d="M16.5 10a1.5 1.5 0 100 3 1.5 1.5 0 000-3z"></path>
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M13.968 3.75a1 1 0 00-1.382-1.161l-11 5A1 1 0 002 9.5V18a2 2 0 001 1.732V21a1 1 0 102 0v-1h7a2 2 0 104 0h1a2 2 0 103.983-.258A2 2 0 0022 18V9.5a1 1 0 00.414-1.91l-8.446-3.84zM20 18H4v-1h16v1zm0-9.31l-8-3.637-8 3.636V15h3v-4.5a1 1 0 011-1h4a1 1 0 011 1V15h7V8.69zM11 15v-3.5H9V15h2z"
            ></path>
          </svg>
        );
      case "multi-family":
        return (
          <svg viewBox="0 0 24 24" style={OverviewCardStyles.icontype}>
            <path d="M16 10a1 1 0 100 2 1 1 0 000-2zM15 15a1 1 0 112 0 1 1 0 01-2 0zM12 10a1 1 0 100 2 1 1 0 000-2zM7 11a1 1 0 112 0 1 1 0 01-2 0zM16 6a1 1 0 100 2 1 1 0 000-2zM11 7a1 1 0 112 0 1 1 0 01-2 0zM8 6a1 1 0 100 2 1 1 0 000-2z"></path>
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M2 3a1 1 0 011-1h18a1 1 0 110 2v16a2 2 0 01-2 2H5a2 2 0 01-2-2V4a1 1 0 01-1-1zm17 1v16h-6v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4H5V4h14zm-8 16H9v-4h2v4z"
            ></path>
          </svg>
        );
      case "co-op":
        return (
          <svg viewBox="0 0 24 24" style={OverviewCardStyles.icontype}>
            <path d="M11.875 20a.58.58 0 00.35-.15l8.2-8.2c.2-.2.346-.425.438-.675a2.174 2.174 0 000-1.513 1.657 1.657 0 00-.438-.637l-4.25-4.25a1.657 1.657 0 00-.637-.438 2.143 2.143 0 00-1.513 0c-.25.092-.475.238-.675.438l-.275.275 1.85 1.875c.25.233.433.5.55.8.117.3.175.617.175.95 0 .7-.237 1.287-.712 1.762-.475.475-1.063.713-1.763.713-.333 0-.654-.058-.962-.175a2.274 2.274 0 01-.813-.525L9.525 8.4 5.15 12.775a.473.473 0 00-.15.35c0 .133.05.254.15.362a.444.444 0 00.55.113.582.582 0 00.15-.1l3.4-3.4 1.4 1.4-3.375 3.4a.48.48 0 00-.15.35c0 .133.05.25.15.35.1.1.217.15.35.15a.582.582 0 00.35-.15l3.4-3.375 1.4 1.4-3.375 3.4a.297.297 0 00-.112.15.56.56 0 00-.038.2c0 .133.05.25.15.35a.48.48 0 00.7 0l3.4-3.375 1.4 1.4-3.4 3.4a.47.47 0 00-.15.35c0 .133.054.25.163.35.108.1.229.15.362.15zm-.025 2a2.436 2.436 0 01-1.637-.613 2.384 2.384 0 01-.838-1.537 2.465 2.465 0 01-1.425-.7 2.465 2.465 0 01-.7-1.425 2.373 2.373 0 01-1.412-.712A2.544 2.544 0 015.15 15.6a2.377 2.377 0 01-1.55-.825c-.4-.467-.6-1.017-.6-1.65 0-.333.063-.654.188-.963a2.42 2.42 0 01.537-.812l5.8-5.775L12.8 8.85c.033.05.083.087.15.112a.56.56 0 00.2.038c.15 0 .275-.046.375-.137a.47.47 0 00.15-.363.572.572 0 00-.037-.2.302.302 0 00-.113-.15L9.95 4.575a1.656 1.656 0 00-.638-.438 2.135 2.135 0 00-1.512 0c-.25.092-.475.238-.675.438L3.6 8.125c-.15.15-.275.325-.375.525-.1.2-.167.4-.2.6a1.885 1.885 0 00.2 1.2l-1.45 1.45a3.975 3.975 0 01-.625-1.263 3.925 3.925 0 01.2-2.75c.2-.441.475-.837.825-1.187L5.7 3.175c.4-.383.846-.675 1.338-.875a3.976 3.976 0 014.337.875l.275.275.275-.275c.4-.383.846-.675 1.337-.875.492-.2.996-.3 1.513-.3.517 0 1.021.1 1.513.3.491.2.929.492 1.312.875L21.825 7.4A4.074 4.074 0 0123 10.25c0 .517-.1 1.02-.3 1.512-.2.492-.492.93-.875 1.313l-8.2 8.175a2.591 2.591 0 01-.813.55c-.308.133-.629.2-.962.2z"></path>
          </svg>
        );
      case "other":
        return (
          <svg viewBox="0 0 24 24" style={OverviewCardStyles.icontype}>
            <path d="M9 11v-1a1 1 0 112 0v1a1 1 0 11-2 0zM13 10v1a1 1 0 102 0v-1a1 1 0 10-2 0z"></path>
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M5 3a1 1 0 00-2 0v3.586A2 2 0 003.586 8L5 9.414v6.172L3.586 17A2 2 0 003 18.414V20a2 2 0 002 2h14a2 2 0 002-2v-1.586A2 2 0 0020.414 17L19 15.586V9.414L20.414 8A2 2 0 0021 6.586V3a1 1 0 10-2 0v1h-2V3a1 1 0 10-2 0v1h-2V3a1 1 0 10-2 0v1H9V3a1 1 0 00-2 0v1H5V3zm14 17v-1.586L17.586 17A2 2 0 0117 15.586V9.414A2 2 0 0117.586 8L19 6.586V6H5v.586L6.414 8A2 2 0 017 9.414v6.172A2 2 0 016.414 17L5 18.414V20h4v-3a3 3 0 116 0v3h4zm-8 0h2v-3a1 1 0 10-2 0v3z"
            ></path>
          </svg>
        );
      default:
        return null;
    }
  };
  return (
    <div style={OverviewCardStyles.card}>
      {/* สถานะการขาย และข้อมูลเบื้องต้น*/}
      <div style={OverviewCardStyles.propertyInfo}>
        <div style={OverviewCardStyles.statusRow}>
          <span
            style={{
              ...OverviewCardStyles.statusIndicator,
              backgroundColor:
                cleanedStatus === "sold"
                  ? "red"
                  : cleanedStatus === "under contract"
                  ? "#FF5F15"
                  : "green",
            }}
          ></span>
          <span style={OverviewCardStyles.status}>
            {cleanedStatus === "sold" ? (
              "SOLD"
            ) : (
              <>
                FOR SALE -{" "}
                <span style={OverviewCardStyles.active}>
                  {status.toUpperCase()}
                </span>
              </>
            )}
          </span>
        </div>
        <div style={OverviewCardStyles.addressContainer}>
          <h2>
            <span style={OverviewCardStyles.addressStreet}>
              {property.address.street},
            </span>{" "}
            <span style={OverviewCardStyles.addressCity}>
              {property.address.city}, {property.address.state}{" "}
              {property.address.zip}
            </span>
          </h2>
        </div>

        <div style={OverviewCardStyles.propertyInfoContainer}>
          <div style={OverviewCardStyles.priceSection}>
            <p style={OverviewCardStyles.price}>
              ${property.price.toLocaleString()}
            </p>
            <p style={OverviewCardStyles.listedDate}>
              Listed on {formattedDate}
            </p>
          </div>
          <div style={OverviewCardStyles.detailSection}>
            <strong style={OverviewCardStyles.detailValue}>
              {property.details.beds}
            </strong>
            <span style={OverviewCardStyles.detailLabel}>Beds</span>
          </div>
          <div style={OverviewCardStyles.detailSection}>
            <strong style={OverviewCardStyles.detailValue}>
              {property.details.baths}
            </strong>
            <span style={OverviewCardStyles.detailLabel}>Baths</span>
          </div>
          <div style={OverviewCardStyles.detailSection}>
            <strong style={OverviewCardStyles.detailValue}>
              {property.details.sqft || "—"}
            </strong>
            <span style={OverviewCardStyles.detailLabel}>Sq Ft</span>
          </div>
        </div>
      </div>

      {/* แผนที่ */}
      <div style={OverviewCardStyles.mapContainer}>
        <iframe
          title="Property Location"
          src={`https://www.google.com/maps?q=${property.address.street},${property.address.city}&output=embed`}
          style={OverviewCardStyles.mapFrame}
        ></iframe>
      </div>

      {/* คำอธิบายบ้าน */}
      <div style={OverviewCardStyles.descriptionSection}>
        <h3 style={OverviewCardStyles.sectionTitle}>About this home</h3>
        <p
          style={{
            ...OverviewCardStyles.description,
            maxHeight: showFullDescription ? "none" : "100px",
          }}
        >
          {highlightText(property.about)}
        </p>
        {property.about.length > 150 && (
          <button
            style={OverviewCardStyles.showMoreButton}
            onClick={() => setShowFullDescription(!showFullDescription)}
          >
            {showFullDescription ? (
              <>
                Show less
                <svg
                  style={{
                    ...OverviewCardStyles.showMoreIcon,
                    ...(showFullDescription && OverviewCardStyles.rotated),
                  }}
                  viewBox="0 0 13 12"
                >
                  <path d="M11.207 3.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L6.5 6.586l3.293-3.293a1 1 0 011.414 0z"></path>
                </svg>
              </>
            ) : (
              <>
                Show more
                <svg
                  style={OverviewCardStyles.showMoreIcon}
                  viewBox="0 0 13 12"
                >
                  <path d="M11.207 3.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L6.5 6.586l3.293-3.293a1 1 0 011.414 0z"></path>
                </svg>
              </>
            )}
          </button>
        )}
      </div>

      {/* รายละเอียดเพิ่มเติม */}
      <div style={OverviewCardStyles.detailsGrid}>
        {/* ประเภท */}
        {property.propertyType && (
          <div style={OverviewCardStyles.detailIconItem}>
            <span>{renderPropertyIcon(property.propertyType)}</span>
            <div>
              <div style={OverviewCardStyles.detailIconText}>
                {property.propertyType.charAt(0).toUpperCase() +
                  property.propertyType.slice(1).toLowerCase()}
              </div>{" "}
              <div style={OverviewCardStyles.detailIconLabel}>
                Property Type
              </div>
            </div>
          </div>
        )}
        {/* ปีที่สร้าง */}
        {property.yearBuilt && (
          <div style={OverviewCardStyles.detailIconItem}>
            <span style={OverviewCardStyles.icon}>
              <svg viewBox="0 0 24 24">
                <path d="M9.438 12.598l-5.031 5.031a1.389 1.389 0 001.964 1.964l5.031-5.031 1.175.395a5.625 5.625 0 005.775-1.355c1.172-1.171 1.635-2.837 1.39-4.516l-3.202 3.202-3.621-1.207-1.207-3.621 3.202-3.202c-1.679-.245-3.345.218-4.516 1.39a5.625 5.625 0 00-1.355 5.775l.395 1.175zM14 8l3.614-3.614c.454-.454.368-1.215-.219-1.473-2.784-1.227-6.154-.937-8.412 1.32a7.625 7.625 0 00-1.836 7.827l-4.154 4.155a3.389 3.389 0 104.792 4.793l4.155-4.155a7.625 7.625 0 007.827-1.836c2.257-2.258 2.547-5.628 1.32-8.412-.259-.587-1.019-.673-1.473-.22L16 10l-1.5-.5L14 8z"></path>
              </svg>
            </span>
            <div>
              <div style={OverviewCardStyles.detailIconText}>
                {property.yearBuilt}
              </div>
              <div style={OverviewCardStyles.detailIconLabel}>Year Built</div>
            </div>
          </div>
        )}
        {/* ราคาต่อฟุต */}
        {pricePerSqFt && (
          <div style={OverviewCardStyles.detailIconItem}>
            <span style={OverviewCardStyles.icon}>
              <svg viewBox="0 0 24 24">
                <path d="M17.414 3a2 2 0 00-2.828 0L3 14.586a2 2 0 000 2.828L6.586 21a2 2 0 002.828 0L21 9.414a2 2 0 000-2.828L17.414 3zM16 4.414L19.586 8 8 19.586 4.414 16l1.836-1.836 1.48 1.48a1 1 0 001.415-1.414l-1.48-1.48L9.5 10.914l1.48 1.48a1 1 0 001.415-1.414l-1.48-1.48 1.835-1.836 1.48 1.48a1 1 0 101.415-1.414l-1.48-1.48L16 4.414z"></path>
              </svg>
            </span>
            <div>
              <div style={OverviewCardStyles.detailIconText}>
                ${pricePerSqFt}
              </div>
              <div style={OverviewCardStyles.detailIconLabel}>Price/Sq.Ft.</div>
            </div>
          </div>
        )}
        {/* อัตราค่าส่วนกลาง */}
        {property.hoaDues && (
          <div style={OverviewCardStyles.detailIconItem}>
            <span style={OverviewCardStyles.icon}>
              <svg viewBox="0 0 24 24">
                <path d="M4.795 12a8 8 0 1116 0 8 8 0 01-16 0zm8-10c-5.523 0-10 4.477-10 10s4.477 10 10 10 10-4.477 10-10-4.477-10-10-10zm0 3.5a1 1 0 011 1v.671a3 3 0 01.985.58 1 1 0 01-1.324 1.499 1 1 0 10-.661 1.75 3 3 0 011 5.83v.67a1 1 0 11-2 0v-.671a3 3 0 01-.984-.58 1 1 0 111.323-1.499 1 1 0 10.661-1.75 3 3 0 01-1-5.83V6.5a1 1 0 011-1z"></path>
              </svg>
            </span>
            <div>
              <div style={OverviewCardStyles.detailIconText}>
                ${property.hoaDues}/mo
              </div>
              <div style={OverviewCardStyles.detailIconLabel}>HOA Dues</div>
            </div>
          </div>
        )}
        {/* จำนวนที่จอดรถ */}
        {property.details.parking && (
          <div style={OverviewCardStyles.detailIconItem}>
            <span style={OverviewCardStyles.icon}>
              <svg viewBox="0 0 24 24">
                <path d="M8 14.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM19 14.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"></path>
                <path d="M4.624 5.176L3.531 9H2a1 1 0 000 2h.764A2.989 2.989 0 002 13v6.75c0 .69.56 1.25 1.25 1.25h.5C4.44 21 5 20.44 5 19.75V19h14v.75c0 .69.56 1.25 1.25 1.25h.5c.69 0 1.25-.56 1.25-1.25V13c0-.768-.289-1.47-.764-2H22a1 1 0 100-2h-1.531l-1.093-3.824A3 3 0 0016.491 3H7.51a3 3 0 00-2.885 2.176zM7.509 5a1 1 0 00-.962.725L5.326 10h13.348l-1.221-4.275A1 1 0 0016.49 5H7.51zM20 17v-4a1 1 0 00-1-1H5a1 1 0 00-1 1v4h16z"></path>
              </svg>
            </span>
            <div>
              <div style={OverviewCardStyles.detailIconText}>
                {property.details.parking}
              </div>
              <div style={OverviewCardStyles.detailIconLabel}>Parking</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const BackIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="#005a76">
    <path d="M11.707 5.293a1 1 0 010 1.414L7.414 11H19a1 1 0 110 2H7.414l4.293 4.293a1 1 0 01-1.414 1.414l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 0z"></path>
  </svg>
);

const HeartIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="20"
    height="20"
    fill="none"
    stroke="#6b7280"
    strokeWidth="2"
  >
    <path d="M3.354 4.844C4.306 3.69 5.72 3 7.5 3c1.572 0 2.913.777 3.797 1.457.267.205.503.41.703.597.2-.187.436-.392.703-.597C13.587 3.777 14.928 3 16.5 3c1.78 0 3.194.689 4.146 1.844C21.577 5.974 22 7.468 22 9c0 1.205-.42 2.394-1.019 3.488-.601 1.1-1.416 2.162-2.283 3.131-1.735 1.937-3.766 3.59-4.99 4.522a2.813 2.813 0 01-3.417 0c-1.223-.931-3.254-2.585-4.989-4.522-.868-.969-1.682-2.032-2.283-3.131-.599-1.094-1.02-2.283-1.02-3.487.002-1.532.423-3.025 1.355-4.156z"></path>
  </svg>
);

const HideIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="#6b7280">
    <path d="M2.293 2.293a1 1 0 011.414 0l18 18a1 1 0 01-1.414 1.414l-3.025-3.024A11.046 11.046 0 0112 20c-5.517 0-9.314-3.86-10.92-7.606a1 1 0 010-.788c.802-1.869 2.133-3.745 3.943-5.169l-2.73-2.73a1 1 0 010-1.414zm4.157 5.57C4.964 8.977 3.825 10.47 3.097 12 4.575 15.11 7.7 18 12 18c1.394 0 2.655-.3 3.776-.81l-1.744-1.744a4.002 4.002 0 01-5.478-5.478L6.45 7.864z"></path>
    <path d="M12 6c-.393 0-.775.024-1.145.07a1 1 0 01-.243-1.986C11.063 4.03 11.526 4 12 4c5.517 0 9.314 3.86 10.92 7.606a1 1 0 010 .788 13.476 13.476 0 01-1.745 2.95 1 1 0 01-1.578-1.229c.525-.674.962-1.392 1.306-2.115C19.425 8.89 16.3 6 12 6z"></path>
    <path d="M12.903 8.103c-.224-.052-.348.209-.186.372l2.808 2.808c.163.163.424.038.373-.186a4.006 4.006 0 00-2.995-2.994z"></path>
  </svg>
);

const ShareIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="20"
    height="20"
    fill="none"
    stroke="#6b7280"
    strokeWidth="2"
  >
    <path d="M12.617 3.076a1 1 0 011.09.217l8 8a1 1 0 010 1.414l-8 8A1 1 0 0112 20v-4c-4.317 0-6.255 1.194-7.132 2.169a3.514 3.514 0 00-.77 1.337c-.086.29-.098.507-.098.507A1 1 0 012 20c0-.177.009-.354.02-.531.018-.323.056-.778.13-1.323.148-1.084.445-2.547 1.05-4.025.603-1.475 1.531-3.01 2.965-4.177C7.615 8.762 9.528 8 12 8V4a1 1 0 01.617-.924z"></path>
  </svg>
);

const ArrowUpIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="20"
    height="20"
    style={{ transform: "rotate(270deg)" }}
  >
    <path d="M9.99 18.707a1 1 0 010-1.414L15.285 12 9.99 6.707a1 1 0 111.414-1.414l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0z"></path>
  </svg>
);

const ArrowDownIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="20"
    height="20"
    style={{ transform: "rotate(90deg)" }}
  >
    <path d="M9.99 5.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.715 12 9.99 6.707a1 1 0 010-1.414z"></path>
  </svg>
);
const PropertyDetailsCard = () => {
  // ข้อมูลจำลอง
  const properties = [
    {
      address: {
        street: "7308 W 59th St",
        city: "Chicago",
        state: "IL",
        zip: "60638",
      },
      parking: {
        garage: 2,
        total: 4,
      },
      interior: {
        baths: 1,
      },
      exterior: {
        livingArea: "Estimated",
        buildingType: "Vinyl Siding, Frame",
      },
      financial: {
        taxAmount: "$4,915.90",
        taxYear: "2023",
      },
      utilities: {
        waterSource: "Public Sewer",
      },
      location: {
        associationFee: "Not Required",
        elementarySchoolDistrict: 104,
        middleSchoolDistrict: 104,
        highSchoolDistrict: 217,
        highSchool: "Argo Community High School",
        township: "Lyons",
        corporateLimits: "Summit",
        directions: "7308 W 59th St Summit, IL",
      },
      publicFacts: {
        beds: 3,
        baths: 1.0,
        finishedSqFt: 990,
        totalSqFt: 990,
        stories: 1.5,
        lotSize: "3,125 square feet",
        style: "Single Family Residential",
        yearBuilt: 1923,
        county: "Cook County",
        apn: "181322903700000",
      },
      other: {
        earnestMoney: "Yes",
        possession: "Closing",
        photosStaged: "No",
      },
    },
  ];

  const property = properties[0]; // ดึงข้อมูลของ property จาก array

  if (!property) {
    return <div>No property data available</div>; // แสดงข้อความถ้าไม่มีข้อมูล
  }

  // ฟังก์ชันในการจัดการการขยาย/ย่อของแต่ละส่วน
  const [expandedSections, setExpandedSections] = useState({
    parking: false,
    interior: false,
    exterior: false,
    financial: false,
    utilities: false,
  });

  const toggleSection = (section) => {
    setExpandedSections((prevState) => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };

  return (
    <div style={PropertyDetailsStyles.card}>
      <h2 style={PropertyDetailsStyles.title}>
        Property Details for {property.address.street}
      </h2>

      {/* Parking */}
      <div style={PropertyDetailsStyles.section}>
        <div
          style={PropertyDetailsStyles.sectionHeader}
          onClick={() => toggleSection("parking")}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <svg
              viewBox="0 0 24 24"
              width="24"
              height="24"
              style={{ marginRight: "8px" }}
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M11.336 3.253a1 1 0 011.328 0l9 8a1 1 0 01-1.328 1.494L20 12.45V19a2 2 0 01-2 2H6a2 2 0 01-2-2v-6.55l-.336.297a1 1 0 01-1.328-1.494l9-8zM6 10.67V19h2v-7a1 1 0 011-1h6a1 1 0 011 1v7h2v-8.329l-6-5.333-6 5.333zM14 19v-2h-4v2h4zm-4-4h4v-2h-4v2z"
              ></path>
            </svg>
            <span>Parking</span>
          </div>
          <span>
            {expandedSections.parking ? <ArrowUpIcon /> : <ArrowDownIcon />}
          </span>
        </div>
        {expandedSections.parking && (
          <div style={PropertyDetailsStyles.sectionContent}>
            <h4 style={PropertyDetailsStyles.sectionTitle}>
              Parking Information
            </h4>
            <ul style={PropertyDetailsStyles.list}>
              <li
                style={PropertyDetailsStyles.listItem}
              >{`# of Garage Spaces: ${property.parking.garage}`}</li>
              <li
                style={PropertyDetailsStyles.listItem}
              >{`# of Parking (Total): ${property.parking.total}`}</li>
              <li
                style={PropertyDetailsStyles.listItem}
              >{`Parking On-Site: Yes`}</li>
            </ul>
          </div>
        )}
      </div>

      <div style={PropertyDetailsStyles.Line}></div>

      {/* Interior */}
      <div style={PropertyDetailsStyles.section}>
        <div
          style={PropertyDetailsStyles.sectionHeader}
          onClick={() => toggleSection("interior")}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <svg
              viewBox="0 0 24 24"
              width="24"
              height="24"
              style={{ marginRight: "8px" }}
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M12 4a5 5 0 00-2.5 9.332 1 1 0 01.5.865V16h4v-1.803a1 1 0 01.5-.865A5 5 0 0012 4zM5 9a7 7 0 1111 5.745V16a2 2 0 01-2 2h-4a2 2 0 01-2-2v-1.255A6.993 6.993 0 015 9z"
              ></path>
              <path d="M9 21a1 1 0 011-1h4a1 1 0 110 2h-4a1 1 0 01-1-1z"></path>
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M1.134 15.274a1 1 0 01.366-1.366l1.34-.774a1 1 0 111 1.732l-1.34.774a1 1 0 01-1.366-.367zM19.794 4.5a1 1 0 01.366-1.366l1.34-.774a1 1 0 111 1.733l-1.34.773a1 1 0 01-1.366-.366zM1.134 2.727A1 1 0 012.5 2.36l1.34.774a1 1 0 01-1 1.732L1.5 4.093a1 1 0 01-.366-1.366zM19.794 13.5a1 1 0 011.366-.366l1.34.774a1 1 0 11-1 1.732l-1.34-.774a1 1 0 01-.366-1.366z"
              ></path>
            </svg>
            <span>Interior</span>
          </div>
          <span>
            {expandedSections.interior ? <ArrowUpIcon /> : <ArrowDownIcon />}
          </span>
        </div>
        {expandedSections.interior && (
          <div style={PropertyDetailsStyles.sectionContent}>
            <h4 style={PropertyDetailsStyles.sectionTitle}>
              Bathroom Information
            </h4>
            <ul style={PropertyDetailsStyles.list}>
              <li
                style={PropertyDetailsStyles.listItem}
              >{`# of Baths (Full): ${property.interior.baths}`}</li>
            </ul>
          </div>
        )}
      </div>

      <div style={PropertyDetailsStyles.Line}></div>

      {/* Exterior  */}
      <div style={PropertyDetailsStyles.section}>
        <div
          style={PropertyDetailsStyles.sectionHeader}
          onClick={() => toggleSection("exterior")}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <svg
              viewBox="0 0 25 24"
              width="24"
              height="24"
              style={{ marginRight: "8px" }}
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M11.282 15.602v-4.139l-2.75-2.75a.917.917 0 111.296-1.296l1.454 1.453V7.417a.917.917 0 011.833 0v4.203l1.454-1.453a.917.917 0 111.296 1.296l-2.75 2.75v1.389a6.418 6.418 0 00-.917-12.769 6.417 6.417 0 00-.916 12.769zm0 1.848a8.251 8.251 0 111.833 0v4.633a.917.917 0 11-1.833 0V17.45z"
              ></path>
            </svg>
            <span>Exterior</span>
          </div>
          <span>
            {expandedSections.exterior ? <ArrowUpIcon /> : <ArrowDownIcon />}
          </span>
        </div>
        {expandedSections.exterior && (
          <div style={PropertyDetailsStyles.sectionContent}>
            <h4 style={PropertyDetailsStyles.sectionTitle}>
              Building Information
            </h4>
            <ul style={PropertyDetailsStyles.list}>
              <li
                style={PropertyDetailsStyles.listItem}
              >{`Living Area Source: ${property.exterior.livingArea}`}</li>
              <li
                style={PropertyDetailsStyles.listItem}
              >{`Building Type: ${property.exterior.buildingType}`}</li>
            </ul>
          </div>
        )}
      </div>

      <div style={PropertyDetailsStyles.Line}></div>

      {/* Financial  */}
      <div style={PropertyDetailsStyles.section}>
        <div
          style={PropertyDetailsStyles.sectionHeader}
          onClick={() => toggleSection("financial")}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <svg
              viewBox="0 0 25 24"
              width="24"
              height="24"
              style={{ marginRight: "8px" }}
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M4.795 12a8 8 0 1116 0 8 8 0 01-16 0zm8-10c-5.523 0-10 4.477-10 10s4.477 10 10 10 10-4.477 10-10-4.477-10-10-10zm0 3.5a1 1 0 011 1v.671a3 3 0 01.985.58 1 1 0 01-1.324 1.499 1 1 0 10-.661 1.75 3 3 0 011 5.83v.67a1 1 0 11-2 0v-.671a3 3 0 01-.984-.58 1 1 0 111.323-1.499 1 1 0 10.661-1.75 3 3 0 01-1-5.83V6.5a1 1 0 011-1z"
              ></path>
            </svg>
            <span>Financial</span>
          </div>
          <span>
            {expandedSections.financial ? <ArrowUpIcon /> : <ArrowDownIcon />}
          </span>
        </div>
        {expandedSections.financial && (
          <div style={PropertyDetailsStyles.sectionContent}>
            <h4 style={PropertyDetailsStyles.sectionTitle}>Tax Information</h4>
            <ul style={PropertyDetailsStyles.list}>
              <li
                style={PropertyDetailsStyles.listItem}
              >{`Tax Annual Amount: ${property.financial.taxAmount}`}</li>
              <li
                style={PropertyDetailsStyles.listItem}
              >{`Tax Year: ${property.financial.taxYear}`}</li>
            </ul>
          </div>
        )}
      </div>

      <div style={PropertyDetailsStyles.Line}></div>

      {/* Utilities  */}
      <div style={PropertyDetailsStyles.section}>
        <div
          style={PropertyDetailsStyles.sectionHeader}
          onClick={() => toggleSection("utilities")}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <svg
              viewBox="0 0 24 24"
              width="24"
              height="24"
              style={{ marginRight: "8px" }}
            >
              <path d="M8.5 8a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM12 6a1 1 0 011-1h3a1 1 0 110 2h-3a1 1 0 01-1-1z"></path>
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M17 14a5 5 0 10-10 0 5 5 0 0010 0zm-5-3a3 3 0 012.236 5H9.764A3 3 0 0112 11z"
              ></path>
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M6 2a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H6zm0 2h12v16H6V4z"
              ></path>
            </svg>
            <span>Utilities</span>
          </div>
          <span>
            {expandedSections.utilities ? <ArrowUpIcon /> : <ArrowDownIcon />}
          </span>
        </div>
        {expandedSections.utilities && (
          <div style={PropertyDetailsStyles.sectionContent}>
            <h4 style={PropertyDetailsStyles.sectionTitle}>
              Utility Information
            </h4>
            <ul style={PropertyDetailsStyles.list}>
              <li
                style={PropertyDetailsStyles.listItem}
              >{`Water Source: ${property.utilities.waterSource}`}</li>
            </ul>
          </div>
        )}
      </div>

      <div style={PropertyDetailsStyles.Line}></div>

      {/* Location */}
      <div style={PropertyDetailsStyles.section}>
        <div
          style={PropertyDetailsStyles.sectionHeader}
          onClick={() => toggleSection("location")}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <svg
              viewBox="0 0 25 24"
              width="24"
              height="24"
              style={{ marginRight: "8px" }}
            >
              <path d="M12.848 2c-4.4 0-8 3.6-8 8 0 5.4 7 11.5 7.3 11.8.2.1.5.2.7.2.2 0 .5-.1.7-.2.3-.3 7.3-6.4 7.3-11.8 0-4.4-3.6-8-8-8zm0 17.7c-2.1-2-6-6.3-6-9.7 0-3.3 2.7-6 6-6s6 2.7 6 6-3.9 7.7-6 9.7zm0-13.7c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"></path>
            </svg>
            <span>Location</span>
          </div>
          <span>
            {expandedSections.location ? <ArrowUpIcon /> : <ArrowDownIcon />}
          </span>
        </div>
        {expandedSections.location && (
          <div style={PropertyDetailsStyles.sectionContent}>
            <h4 style={PropertyDetailsStyles.sectionTitle}>
              Homeowners Association Information
            </h4>
            <ul style={PropertyDetailsStyles.list}>
              <li
                style={PropertyDetailsStyles.listItem}
              >{`Master Association Fee Frequency: ${property.location.associationFee}`}</li>
            </ul>
            <h4 style={PropertyDetailsStyles.sectionTitle}>
              School Information
            </h4>
            <ul style={PropertyDetailsStyles.list}>
              <li
                style={PropertyDetailsStyles.listItem}
              >{`Elementary School District: ${property.location.elementarySchoolDistrict}`}</li>
              <li
                style={PropertyDetailsStyles.listItem}
              >{`Middle School District: ${property.location.middleSchoolDistrict}`}</li>
              <li
                style={PropertyDetailsStyles.listItem}
              >{`High School District: ${property.location.highSchoolDistrict}`}</li>
              <li
                style={PropertyDetailsStyles.listItem}
              >{`High School: ${property.location.highSchool}`}</li>
            </ul>
            <h4 style={PropertyDetailsStyles.sectionTitle}>
              Location Information
            </h4>
            <ul style={PropertyDetailsStyles.list}>
              <li
                style={PropertyDetailsStyles.listItem}
              >{`Township: ${property.location.township}`}</li>
              <li
                style={PropertyDetailsStyles.listItem}
              >{`Corporate Limits: ${property.location.corporateLimits}`}</li>
              <li
                style={PropertyDetailsStyles.listItem}
              >{`Directions: ${property.location.directions}`}</li>
            </ul>
          </div>
        )}
      </div>

      <div style={PropertyDetailsStyles.Line}></div>

      {/* Public Facts  */}
      <div style={PropertyDetailsStyles.section}>
        <div
          style={PropertyDetailsStyles.sectionHeader}
          onClick={() => toggleSection("publicFacts")}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <svg
              viewBox="0 0 25 24"
              width="24"
              height="24"
              style={{ marginRight: "8px" }}
            >
              <path d="M4.5 4a2 2 0 012-2h8a1 1 0 01.707.293l5 5A1 1 0 0120.5 8v12a2 2 0 01-2 2h-12a2 2 0 01-2-2V4zm13.586 4L14.5 4.414V8h3.586zM12.5 4h-6v16h12V10h-5a1 1 0 01-1-1V4zm-4 9a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1zm0 4a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1z"></path>
            </svg>
            <span>Public facts</span>
          </div>
          <span>
            {expandedSections.publicFacts ? <ArrowUpIcon /> : <ArrowDownIcon />}
          </span>
        </div>
        {expandedSections.publicFacts && (
          <div style={PropertyDetailsStyles.sectionContent}>
            <ul style={PropertyDetailsStyles.list}>
              <li
                style={PropertyDetailsStyles.listItem}
              >{`Beds: ${property.publicFacts.beds}`}</li>
              <li
                style={PropertyDetailsStyles.listItem}
              >{`Baths: ${property.publicFacts.baths}`}</li>
              <li
                style={PropertyDetailsStyles.listItem}
              >{`Finished Sq. Ft.: ${property.publicFacts.finishedSqFt}`}</li>
              <li
                style={PropertyDetailsStyles.listItem}
              >{`Total Sq. Ft.: ${property.publicFacts.totalSqFt}`}</li>
              <li
                style={PropertyDetailsStyles.listItem}
              >{`Stories: ${property.publicFacts.stories}`}</li>
              <li
                style={PropertyDetailsStyles.listItem}
              >{`Lot Size: ${property.publicFacts.lotSize}`}</li>
              <li
                style={PropertyDetailsStyles.listItem}
              >{`Style: ${property.publicFacts.style}`}</li>
              <li
                style={PropertyDetailsStyles.listItem}
              >{`Year Built: ${property.publicFacts.yearBuilt}`}</li>
              <li
                style={PropertyDetailsStyles.listItem}
              >{`County: ${property.publicFacts.county}`}</li>
              <li
                style={PropertyDetailsStyles.listItem}
              >{`APN: ${property.publicFacts.apn}`}</li>
            </ul>
          </div>
        )}
      </div>

      <div style={PropertyDetailsStyles.Line}></div>

      {/* Other  */}
      <div style={PropertyDetailsStyles.section}>
        <div
          style={PropertyDetailsStyles.sectionHeader}
          onClick={() => toggleSection("other")}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <svg
              viewBox="0 0 25 25"
              width="24"
              height="24"
              style={{ marginRight: "8px" }}
            >
              <path d="M12.5 14.5a2 2 0 100-4 2 2 0 000 4zM6.5 14.5a2 2 0 100-4 2 2 0 000 4zM18.5 14.5a2 2 0 100-4 2 2 0 000 4z"></path>
            </svg>
            <span>Other</span>
          </div>
          <span>
            {expandedSections.other ? <ArrowUpIcon /> : <ArrowDownIcon />}
          </span>
        </div>
        {expandedSections.other && (
          <div style={PropertyDetailsStyles.sectionContent}>
            <h4 style={PropertyDetailsStyles.sectionTitle}>
              Listing Information
            </h4>
            <ul style={PropertyDetailsStyles.list}>
              <li
                style={PropertyDetailsStyles.listItem}
              >{`Holds Earnest Money: ${property.other.earnestMoney}`}</li>
              <li
                style={PropertyDetailsStyles.listItem}
              >{`Possession: ${property.other.possession}`}</li>
              <li
                style={PropertyDetailsStyles.listItem}
              >{`Some Photos Virtually Staged?: ${property.other.photosStaged}`}</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

const PropertyDetailsStyles = {
  card: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    padding: "32px",
    borderRadius: "10px",
    border: "1px solid #ddd",
    backgroundColor: "#fff",
    width: "100%",
    maxWidth: "900px",
    margin: "auto",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    marginTop: "1rem",
    marginBottom: "1rem",
    fontFamily: `"Inter", -apple-system, BlinkMacSystemFont, "Roboto", "Droid Sans", "Helvetica", "Arial", sans-serif`,
  },
  title: {
    fontSize: "23px",
    fontWeight: "bold",
    marginBottom: "10px",
    color: "#333",
  },
  section: {
    marginBottom: "16px",
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "18px",
    fontWeight: "600",
    cursor: "pointer",
    color: "#333",
  },
  sectionContent: {
    marginTop: "1rem",
    fontSize: "16px",
    color: "#131313",
    paddingLeft: "20px",
  },
  list: {
    listStyleType: "disc",
    paddingLeft: "30px",
  },
  listItem: {
    marginBottom: "5px",
    fontSize: "14px",
    color: "#131313",
  },
  sectionTitle: {
    marginTop: "1rem",
    fontWeight: "bold",
    marginBottom: "5px",
  },

  Line: {
    flex: "1",
    borderTop: "1px solid #e0e0e0",
  },
};

const OverviewCardStyles = {
  card: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    padding: "32px",
    borderRadius: "10px",
    border: "1px solid #ddd",
    backgroundColor: "#fff",
    width: "100%",
    maxWidth: "900px",
    margin: "auto",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    marginTop: "1rem",
  },
  propertyInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  statusRow: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    marginBottom: "1rem",
  },
  statusIndicator: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
  },
  status: {
    fontSize: "14px",
    color: "#686868",
    fontFamily: `"Inter", -apple-system, BlinkMacSystemFont, "Roboto", "Droid Sans", "Helvetica", "Arial", sans-serif`,
  },
  active: {
    borderBottom: "2px dotted  #686868",
    paddingBottom: "2px",
  },

  addressContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    marginBottom: "1rem",
  },
  addressStreet: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#131313",
    fontFamily:
      "Inter, -apple-system, BlinkMacSystemFont, Roboto, Droid Sans, Helvetica, Arial, sans-serif",
  },
  addressCity: {
    fontSize: "16px",
    color: "#686868",
    fontFamily:
      "Inter, -apple-system, BlinkMacSystemFont, Roboto, Droid Sans, Helvetica, Arial, sans-serif",
    fontWeight: "400",
  },

  propertyInfoContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: "30px",
    width: "100%",
    marginBottom: "1rem",
    fontFamily:
      "Inter, -apple-system, BlinkMacSystemFont, Roboto, Droid Sans, Helvetica, Arial, sans-serif", // เพิ่มฟอนต์เดียวกันใน container นี้
  },
  priceSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    width: "25%",
    gap: "5px",
  },
  price: {
    fontSize: "23px",
    fontWeight: "bold",
    color: "#131313",
  },
  listedDate: {
    fontSize: "16px",
    color: "#131313",
  },
  detailSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    width: "15%",
    gap: "5px",
  },
  detailValue: {
    fontSize: "23px",
    fontWeight: "bold",
    color: "#131313",
  },
  detailLabel: {
    fontSize: "16px",
    color: "#686868",
  },

  mapContainer: {
    width: "100%",
    height: "250px",
    borderRadius: "6px",
    overflow: "hidden",
    marginBottom: "1rem",
  },
  mapFrame: {
    width: "100%",
    height: "100%",
    border: "none",
  },

  descriptionSection: {
    fontFamily:
      "Inter, -apple-system, BlinkMacSystemFont, Roboto, Droid Sans, Helvetica, Arial, sans-serif",
    marginTop: "20px",
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: "23px",
    marginBottom: "1rem",
    color: "131313",
  },
  description: {
    color: "#131313",
    fontSize: "16px",
    lineHeight: "1.5",
    maxHeight: "100px",
    overflow: "hidden",
    transition: "max-height 0.3s ease",
    textAlign: "justify",
  },
  showMoreButton: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    border: "none",
    background: "none",
    fontSize: "18px",
    cursor: "pointer",
    color: "#15727a",
    fontWeight: "700",
    marginTop: "8px",
    fontFamily:
      "Inter, -apple-system, BlinkMacSystemFont, Roboto, Droid Sans, Helvetica, Arial, sans-serif",
  },
  showMoreIcon: {
    fill: "#15727a",
    width: "13px",
    height: "12px",
    transition: "transform 0.3s ease",
  },
  rotated: {
    transform: "rotate(180deg)",
  },

  detailsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "20px",
    marginTop: "10px",
    fontFamily:
      "Inter, -apple-system, BlinkMacSystemFont, Roboto, Droid Sans, Helvetica, Arial, sans-serif",
  },
  icontype: {
    width: "24px",
    height: "24px",
    fill: "#000",
    marginRight: "10px",
  },
  icon: {
    width: "24px",
    height: "24px",
    marginRight: "10px",
    fillRule: "evenodd",
    clipRule: "evenodd",
  },

  detailIconItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: "8px",
    backgroundColor: "#f7f7f7",
    borderRadius: "6px",
    gap: "8px",
    boxSizing: "border-box",
  },
  detailIconText: {
    fontWeight: "500",
    fontSize: "16px",
    color: "#131313",
  },
  detailIconLabel: {
    fontSize: "12px",
    color: "#686868",
    marginTop: "5px",
  },
};

const ContactCard = () => {
  const getDates = (totalDays) => {
    const today = new Date();
    const dates = [];
    for (let i = 0; i < totalDays; i++) {
      const nextDate = new Date(today);
      nextDate.setDate(today.getDate() + i);

      const day = nextDate.toLocaleDateString("en-GB", { weekday: "short" });
      const date = nextDate.getDate();
      const month = nextDate.toLocaleDateString("en-GB", { month: "short" });

      dates.push({ day, date, month });
    }
    return dates;
  };

  const [selectedDateIndex, setSelectedDateIndex] = useState(null);
  const handleDateSelect = (index) => {
    setSelectedDateIndex(index);
  };

  const [selectedTourOption, setSelectedTourOption] = useState(null);
  const handleTourOptionSelect = (option) => {
    setSelectedTourOption(option);
  };
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalDays = 15;
  const dateArray = getDates(totalDays);

  const handleNext = () => {
    if (currentIndex + 3 < dateArray.length) {
      setCurrentIndex(currentIndex + 3);
    }
  };

  const handlePrev = () => {
    if (currentIndex - 3 >= 0) {
      setCurrentIndex(currentIndex - 3);
    }
  };

  return (
    <div style={ContactCardStyles.container}>
      <h3 style={ContactCardStyles.title}>Thinking of buying?</h3>
      <div style={ContactCardStyles.dateSelector}>
        {/* ปุ่มย้อนกลับ */}
        <button
          style={
            currentIndex > 0
              ? ContactCardStyles.arrowButton
              : { ...ContactCardStyles.arrowButton, visibility: "hidden" }
          }
          onClick={handlePrev}
        >
          <svg
            viewBox="0 0 25 24"
            width="16"
            height="16"
            style={{ transform: "rotate(180deg)" }}
          >
            <path d="M9.99 18.707a1 1 0 010-1.414L15.285 12 9.99 6.707a1 1 0 111.414-1.414l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0z"></path>
          </svg>
        </button>

        {/* วันที่ */}
        <div style={ContactCardStyles.dateButtonsContainer}>
          {dateArray
            .slice(currentIndex, currentIndex + 3)
            .map((date, index) => (
              <button
                key={index}
                style={{
                  ...ContactCardStyles.dateButton,
                  ...(selectedDateIndex === index &&
                    ContactCardStyles.selectedDate),
                }}
                onClick={() => handleDateSelect(index)}
              >
                <div
                  style={
                    selectedDateIndex === index
                      ? { ...ContactCardStyles.dayStyle, color: "#15727a" }
                      : ContactCardStyles.dayStyle
                  }
                >
                  {date.day}
                </div>
                <div
                  style={
                    selectedDateIndex === index
                      ? { ...ContactCardStyles.dateStyle, color: "#15727a" }
                      : ContactCardStyles.dateStyle
                  }
                >
                  {date.date}
                </div>
                <div
                  style={
                    selectedDateIndex === index
                      ? { ...ContactCardStyles.monthStyle, color: "#15727a" }
                      : ContactCardStyles.monthStyle
                  }
                >
                  {date.month}
                </div>
              </button>
            ))}
        </div>

        {/* ปุ่มไปข้างหน้า */}
        <button
          style={
            currentIndex + 3 < dateArray.length
              ? ContactCardStyles.arrowButton
              : { ...ContactCardStyles.arrowButton, visibility: "hidden" }
          }
          onClick={handleNext}
        >
          <svg viewBox="0 0 25 24" width="16" height="16">
            <path d="M9.99 18.707a1 1 0 010-1.414L15.285 12 9.99 6.707a1 1 0 111.414-1.414l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0z"></path>
          </svg>
        </button>
      </div>

      <div style={ContactCardStyles.tourOptions}>
        <button
          style={{
            ...ContactCardStyles.tourButton,
            borderTopLeftRadius: "6px",
            borderBottomLeftRadius: "6px",
            ...(selectedTourOption === "inPerson" &&
              ContactCardStyles.selectedTourOption),
          }}
          onClick={() => handleTourOptionSelect("inPerson")}
        >
          <svg
            viewBox="0 0 24 24"
            width="18"
            height="18"
            style={{
              fill: selectedTourOption === "inPerson" ? "#15727a" : "#333",
            }}
          >
            <path d="M12.707 2.793a1 1 0 00-1.414 0l-7 7-2 2a1 1 0 101.414 1.414L4 12.914V19.5a2 2 0 002 2h2a1 1 0 100-2H6v-8.586l6-6 6 6V19.5h-2a1 1 0 100 2h2a2 2 0 002-2v-6.586l.293.293a1 1 0 001.414-1.414l-9-9zm2 11l-2-2a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414l.293-.293V20.5a1 1 0 102 0v-5.586l.293.293a1 1 0 001.414-1.414z"></path>
          </svg>
          Tour in person
        </button>
        <button
          style={{
            ...ContactCardStyles.tourButton,
            borderTopRightRadius: "6px",
            borderBottomRightRadius: "6px",
            ...(selectedTourOption === "videoChat" &&
              ContactCardStyles.selectedTourOption),
          }}
          onClick={() => handleTourOptionSelect("videoChat")}
        >
          <svg
            viewBox="0 0 24 24"
            width="18"
            height="18"
            style={{
              fill: selectedTourOption === "videoChat" ? "#15727a" : "#333",
            }}
          >
            <path d="M6 5a2 2 0 012-2h8a2 2 0 012 2v14a2 2 0 01-2 2H8a2 2 0 01-2-2V5zm10 0H8v14h8V5z"></path>
            <path d="M13 17a1 1 0 11-2 0 1 1 0 012 0z"></path>
          </svg>
          Tour via video chat
        </button>
      </div>

      <div style={ContactCardStyles.requestShowingContainer}>
        <button style={ContactCardStyles.requestButton}>Request showing</button>
        <div style={ContactCardStyles.requestDescription}>
          Tour for free, no strings attached
        </div>
      </div>

      <div style={ContactCardStyles.orContainer}>
        <div style={ContactCardStyles.orLine}></div>
        <div style={ContactCardStyles.orText}>OR</div>
        <div style={ContactCardStyles.orLine}></div>
      </div>

      <button style={ContactCardStyles.offerButton}>Start an offer</button>
      <button style={ContactCardStyles.questionButton}>Ask a question</button>
    </div>
  );
};

const ContactCardStyles = {
  container: {
    fontFamily: `"Inter", -apple-system, BlinkMacSystemFont, "Roboto", "Droid Sans", "Helvetica", "Arial", sans-serif`,
    padding: "20px",
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    maxWidth: "380px",
    margin: "auto",
    border: "1px solid #e0e0e0",
    marginTop: "1rem",
  },
  title: {
    fontSize: "23px",
    fontWeight: "bold",
    marginBottom: "1.5rem",
  },
  dateSelector: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    marginBottom: "15px",
    alignItems: "center",
  },
  dateButtonsContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    flex: "1",
  },
  dateButton: {
    padding: "10px",
    backgroundColor: "#fff",
    border: "1px solid #ccc",
    borderRadius: "6px",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "70px",
  },
  dayStyle: {
    fontSize: "13px",
    fontWeight: "400",
    color: "#333",
    textTransform: "uppercase",
  },
  dateStyle: {
    fontSize: "28px",
    fontWeight: "bold",
    color: "#333",
  },
  monthStyle: {
    fontSize: "13px",
    fontWeight: "normal",
    color: "#333",
    textTransform: "uppercase",
  },
  arrowButton: {
    paddingTop: "10px",
    paddingBottom: "6px",
    backgroundColor: "#fff",
    border: "1px solid #ccc",
    borderRadius: "6px",
    cursor: "pointer",
    paddingLeft: "10px",
    paddingRight: "10px",
  },
  selectedDate: {
    backgroundColor: "rgba(21, 114, 122, 0.2)",
    color: "#15727a",
    border: "2px solid #15727a",
  },

  tourOptions: {
    display: "flex",
    justifyContent: "center",
    marginTop: "20px",
  },
  tourButton: {
    padding: "10px 20px",
    backgroundColor: "#fff",
    border: "1px solid #ccc",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "5px",
    fontSize: "14px",
  },
  selectedTourOption: {
    backgroundColor: "rgba(21, 114, 122, 0.2)",
    color: "#15727a",
    border: "2px solid #15727a",
  },

  requestShowingContainer: {
    marginTop: "1rem",
  },
  requestButton: {
    padding: "12px 20px",
    backgroundColor: "#C82021",
    color: "#fefefe",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
    width: "100%",
    fontFamily: `"Inter", -apple-system, BlinkMacSystemFont, "Roboto", "Droid Sans", "Helvetica", "Arial", sans-serif`,
  },
  requestDescription: {
    fontSize: "12px",
    color: "#686868",
    marginTop: "0.5rem",
    textAlign: "start",
  },

  orContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "20px 0",
    width: "100%",
  },

  orText: {
    fontSize: "16px",
    fontWeight: "bold",
    color: "#686868",
    padding: "0 1rem",
  },

  orLine: {
    flex: "1",
    borderTop: "1px solid #686868",
  },

  offerButton: {
    padding: "12px 20px",
    backgroundColor: "transparent",
    color: "#333",
    border: "1px solid #333",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
    width: "100%",
    fontFamily: `"Inter", -apple-system, BlinkMacSystemFont, "Roboto", "Droid Sans", "Helvetica", "Arial", sans-serif`,
    textAlign: "center",
    marginBottom: "10px",
  },

  questionButton: {
    padding: "12px 20px",
    backgroundColor: "transparent",
    color: "#333",
    border: "1px solid #333",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
    width: "100%",
    fontFamily: `"Inter", -apple-system, BlinkMacSystemFont, "Roboto", "Droid Sans", "Helvetica", "Arial", sans-serif`,
    textAlign: "center",
    marginBottom: "10px",
  },
};

export default PropertyDetails;
