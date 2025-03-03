import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";

const PropertyDetails = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Overview");

  const photoRef = useRef(null);
  const overviewRef = useRef(null);
  const detailsRef = useRef(null);
  const tabs = ["Photo", "Overview", "Property details"];
  const { propertyId } = useParams(); // ดึง ID ของบ้านจาก URL
  const [property, setProperty] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

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

  // ตรวจสอบว่า propertyId มีค่าไหม
  useEffect(() => {
    console.log("Current propertyId:", propertyId); // เพิ่ม log เพื่อตรวจสอบ propertyId

    if (!propertyId) {
      console.error("❌ Property ID หายไปจาก URL");
      return;
    }

    const fetchPropertyDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:5000/api/homes/${propertyId}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch property details");
        }

        const data = await response.json();
        console.log("Fetched property data:", data); // เพิ่ม log เพื่อตรวจสอบข้อมูล

        // ตรวจสอบและเซ็ตข้อมูล
        if (data.data) {
          setProperty(data.data);
        } else {
          setProperty(data);
        }
      } catch (error) {
        console.error("Error fetching property details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (propertyId) {
      fetchPropertyDetails();
    }
  }, [propertyId]);

  // แก้ไขส่วนการแสดงผล Loading
  if (loading) {
    return (
      <>
        <Navbar />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            fontSize: "20px",
          }}
        >
          Loading property details...
        </div>
      </>
    );
  }

  // แก้ไขส่วนการแสดงผลเมื่อไม่พบข้อมูล
  if (!property) {
    return (
      <>
        <Navbar />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            fontSize: "20px",
            color: "red",
          }}
        >
          Property not found or error loading data
        </div>
      </>
    );
  }

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
        <PropertyGallery propertyId={property?.id} />
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
            <OverviewCard propertyId={propertyId} />
          </div>

          <div
            ref={detailsRef}
            data-section="Property details"
            style={{ scrollMarginTop: "60px" }}
          >
            <PropertyDetailsCard propertyId={property?.id} />
          </div>
        </div>

        {/* Right section with ContactCard */}
        <div style={{ position: "sticky", top: "56px", width: "380px" }}>
          <ContactCard propertyId={property?.id} />
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
  const { propertyId } = useParams();
  const [images, setImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  console.log("Property ID from URL:", propertyId); // เช็กค่าที่ได้จาก useParams()

  useEffect(() => {
    if (!propertyId) {
      console.error("Error: propertyId is undefined or null");
      setLoading(false);
      return;
    }

    const fetchImages = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/homes/${propertyId}/images`
        );
        const data = await response.json();

        console.log("API Response:", data);

        if (Array.isArray(data.images)) {
          setImages(data.images); // ✅ ดึง array ของ images มาใช้
        }
      } catch (error) {
        console.error("Error fetching images:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [propertyId]);

  if (loading) {
    return <div>Loading images...</div>;
  }

  if (!propertyId) {
    return <div>Error: Property ID is missing</div>;
  }

  if (images.length === 0) {
    return <div>No images available</div>;
  }

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex < images.length - 1 ? prevIndex + 1 : 0
    );
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : images.length - 1
    );
  };

  return (
    <div className="photo-gallery">
      <img
        src={images[currentImageIndex]}
        alt={`Property image ${currentImageIndex + 1}`}
        className="property-image"
        style={{
          width: "100%",
          height: "400px",
          objectFit: "cover",
          borderRadius: "10px",
          cursor: "pointer", // ทำให้เมาส์เป็นรูปมือเมื่อวางบนรูป
        }}
        onClick={handleNextImage} // คลิกที่รูปเพื่อเปลี่ยนไปภาพถัดไป
      />
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

const OverviewCard = ({ propertyId }) => {
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [listedDate, setListedDate] = useState(null);

  useEffect(() => {
    if (!propertyId) {
      setError("Property ID is missing");
      setLoading(false);
      return;
    }

    const fetchProperty = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/homes/${propertyId}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch property");
        }

        const result = await response.json();
        console.log("Fetched property data:", result);

        // ตรวจสอบและเซ็ตข้อมูล property
        if (result.data) {
          setProperty(result.data);
          if (result.data.listed_date) {
            const formattedDate = formatListedDate(result.data.listed_date);
            setListedDate(formattedDate); // แปลงวันที่และตั้งค่า
          }
        } else {
          setProperty(result);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchProperty();
  }, [propertyId]);

  const formatListedDate = (date) => {
    const formatted = new Date(date); // แปลงเป็น Date object
    return formatted.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }); // รูปแบบ "27 Feb 2025"
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!property) return <div>Property not found</div>;

  // ดึงค่า status และทำความสะอาด
  const status = property.status || "For Sale";
  const cleanedStatus = status.toString().trim().toLowerCase();

  // คำนวณ Price per Sq.Ft.
  const pricePerSqFt = property.details?.sqft
    ? (property.price / property.details.sqft).toFixed(0)
    : "-";

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
    if (!text) return "";
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
    // ตรวจสอบว่ามี propertyType หรือไม่
    if (!propertyType) return null;

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
      default:
        return (
          <svg viewBox="0 0 24 24" style={OverviewCardStyles.icontype}>
            <path d="M11.336 3.253a1 1 0 011.328 0l9 8a1 1 0 01-1.328 1.494L20 12.45V19a2 2 0 01-2 2H6a2 2 0 01-2-2v-6.55l-.336.297a1 1 0 01-1.328-1.494l9-8zM6 10.67V19h3v-5a1 1 0 011-1h4a1 1 0 011 1v5h3v-8.329l-6-5.333-6 5.333zM13 19v-4h-2v4h2z"></path>
          </svg>
        ); // แสดงไอคอนบ้านเป็นค่าเริ่มต้น
    }
  };

  return (
    <div style={OverviewCardStyles.card}>
      <div style={OverviewCardStyles.propertyInfo}>
        {/* Property Type Icon */}
        <div style={OverviewCardStyles.propertyTypeIcon}>
          {renderPropertyIcon(property?.propertyType || "house")}
        </div>

        {/* Status */}
        <div style={OverviewCardStyles.statusContainer}>
          <div
            style={{
              ...OverviewCardStyles.statusIndicator,
              backgroundColor: cleanedStatus === "sold" ? "red" : "green",
            }}
          ></div>
          <span style={OverviewCardStyles.statusText}>{status}</span>
        </div>

        {/* Price */}
        <div style={OverviewCardStyles.priceContainer}>
          <h2 style={OverviewCardStyles.price}>
            ${property.price?.toLocaleString()}
          </h2>
        </div>

        {/* Main Details */}
        <div style={OverviewCardStyles.mainDetails}>
          <div style={OverviewCardStyles.detailItem}>
            <span style={OverviewCardStyles.detailValue}>
              {property.details?.beds || "N/A"}
            </span>
            <span style={OverviewCardStyles.detailLabel}>beds</span>
          </div>
          <div style={OverviewCardStyles.detailItem}>
            <span style={OverviewCardStyles.detailValue}>
              {property.details?.baths || "N/A"}
            </span>
            <span style={OverviewCardStyles.detailLabel}>baths</span>
          </div>
          <div style={OverviewCardStyles.detailItem}>
            <span style={OverviewCardStyles.detailValue}>
              {property.details?.sqft?.toLocaleString() || "N/A"}
            </span>
            <span style={OverviewCardStyles.detailLabel}>sq ft</span>
          </div>
          <div style={OverviewCardStyles.detailItem}>
            <span style={OverviewCardStyles.detailValue}>${pricePerSqFt}</span>
            <span style={OverviewCardStyles.detailLabel}>price/sq ft</span>
          </div>
        </div>

        {/* Listed Date */}
        <div style={OverviewCardStyles.listedDate}>Listed: {listedDate}</div>

        {/* Description */}
        <div style={OverviewCardStyles.description}>
          <h3>About This Home</h3>
          <div style={OverviewCardStyles.descriptionText}>
            {showFullDescription
              ? highlightText(property.description)
              : highlightText(property.description?.substring(0, 250) + "...")}
            <button
              onClick={() => setShowFullDescription(!showFullDescription)}
              style={OverviewCardStyles.readMoreButton}
            >
              {showFullDescription ? "Read less" : "Read more"}
            </button>
          </div>
        </div>

        {/* Additional Details */}
        {property.details?.parking && (
          <div style={OverviewCardStyles.additionalDetails}>
            <div style={OverviewCardStyles.detailIcon}>
              <span>Parking: {property.details.parking}</span>
            </div>
          </div>
        )}

        {property.hoaDues && (
          <div style={OverviewCardStyles.additionalDetails}>
            <div style={OverviewCardStyles.detailIcon}>
              <span>HOA Dues: ${property.hoaDues}/month</span>
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
  const [property, setProperty] = useState(null);
  const { propertyId } = useParams();
  console.log("PropertyDetailsCard received propertyId from URL:", propertyId);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedSections, setExpandedSections] = useState({
    parking: false,
    interior: false,
    exterior: false,
  });

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        console.log("Fetching property with ID:", propertyId); // ใช้ propertyId

        const response = await fetch(
          `http://localhost:5000/api/homes/${propertyId}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log("API Response:", result);

        // ตรวจสอบโครงสร้างข้อมูลและเซ็ตค่า
        const propertyData = result.data || result;
        console.log("Property Data:", propertyData);

        setProperty(propertyData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching property:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    if (propertyId) {
      // ตรวจสอบ propertyId
      fetchProperty();
    } else {
      setError("No property ID provided");
      setLoading(false);
    }
  }, [propertyId]); // ใช้ propertyId ใน dependency array

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "200px",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <div>Loading property data...</div>
        <div>Property ID: {propertyId}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          color: "red",
          padding: "20px",
          textAlign: "center",
        }}
      >
        Error: {error}
      </div>
    );
  }

  if (!property) {
    return (
      <div
        style={{
          padding: "20px",
          textAlign: "center",
        }}
      >
        No property data available for ID: {propertyId}
      </div>
    );
  }

  // ฟังก์ชันสำหรับ toggle sections
  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div style={PropertyDetailsStyles.card}>
      <h2 style={PropertyDetailsStyles.title}>
        Property Details for {property.address?.street || "N/A"}
      </h2>

      {/* Parking Section */}
      <div style={PropertyDetailsStyles.section}>
        <button
          style={PropertyDetailsStyles.sectionHeader}
          onClick={() => toggleSection("parking")}
        >
          <span>Parking</span>
          <span style={PropertyDetailsStyles.expandIcon}>
            {expandedSections.parking ? "−" : "+"}
          </span>
        </button>
        {expandedSections.parking && (
          <div style={PropertyDetailsStyles.sectionContent}>
            <div style={PropertyDetailsStyles.detailItem}>
              <span>Garage Spaces:</span>
              <span>{property.details?.parking?.garage || "N/A"}</span>
            </div>
            <div style={PropertyDetailsStyles.detailItem}>
              <span>Total Parking Spaces:</span>
              <span>{property.details?.parking?.total || "N/A"}</span>
            </div>
          </div>
        )}
      </div>

      {/* Interior Features Section */}
      <div style={PropertyDetailsStyles.section}>
        <button
          style={PropertyDetailsStyles.sectionHeader}
          onClick={() => toggleSection("interior")}
        >
          <span>Interior Features</span>
          <span style={PropertyDetailsStyles.expandIcon}>
            {expandedSections.interior ? "−" : "+"}
          </span>
        </button>
        {expandedSections.interior && (
          <div style={PropertyDetailsStyles.sectionContent}>
            <div style={PropertyDetailsStyles.detailItem}>
              <span>Bedrooms:</span>
              <span>{property.details?.beds || "N/A"}</span>
            </div>
            <div style={PropertyDetailsStyles.detailItem}>
              <span>Bathrooms:</span>
              <span>{property.details?.baths || "N/A"}</span>
            </div>
            <div style={PropertyDetailsStyles.detailItem}>
              <span>Square Feet:</span>
              <span>{property.details?.sqft?.toLocaleString() || "N/A"}</span>
            </div>
            {property.details?.appliances && (
              <div style={PropertyDetailsStyles.detailItem}>
                <span>Appliances:</span>
                <span>{property.details.appliances.join(", ")}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Exterior Features Section */}
      <div style={PropertyDetailsStyles.section}>
        <button
          style={PropertyDetailsStyles.sectionHeader}
          onClick={() => toggleSection("exterior")}
        >
          <span>Exterior Features</span>
          <span style={PropertyDetailsStyles.expandIcon}>
            {expandedSections.exterior ? "−" : "+"}
          </span>
        </button>
        {expandedSections.exterior && (
          <div style={PropertyDetailsStyles.sectionContent}>
            <div style={PropertyDetailsStyles.detailItem}>
              <span>Lot Size:</span>
              <span>{property.details?.lotSize || "N/A"}</span>
            </div>
            {property.details?.exterior && (
              <div style={PropertyDetailsStyles.detailItem}>
                <span>Exterior Features:</span>
                <span>{property.details.exterior.join(", ")}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Additional Information */}
      {property.hoaDues && (
        <div style={PropertyDetailsStyles.section}>
          <div style={PropertyDetailsStyles.detailItem}>
            <span>HOA Dues:</span>
            <span>${property.hoaDues}/month</span>
          </div>
        </div>
      )}
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
  expandIcon: {
    fontSize: "16px",
    marginLeft: "5px",
    transition: "transform 0.3s ease",
  },
  detailItem: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "5px",
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
  statusContainer: {
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
  statusText: {
    fontSize: "14px",
    color: "#686868",
    fontFamily: `"Inter", -apple-system, BlinkMacSystemFont, "Roboto", "Droid Sans", "Helvetica", "Arial", sans-serif`,
  },
  priceContainer: {
    marginBottom: "1rem",
  },
  price: {
    fontSize: "23px",
    fontWeight: "bold",
    color: "#131313",
  },
  mainDetails: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: "30px",
    width: "100%",
    marginBottom: "1rem",
  },
  detailItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
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
  listedDate: {
    fontSize: "16px",
    color: "#131313",
  },
  description: {
    marginTop: "20px",
  },
  descriptionText: {
    color: "#131313",
    fontSize: "16px",
    lineHeight: "1.5",
    maxHeight: "100px",
    overflow: "hidden",
    transition: "max-height 0.3s ease",
    textAlign: "justify",
  },
  readMoreButton: {
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
    fontFamily: `"Inter", -apple-system, BlinkMacSystemFont, "Roboto", "Droid Sans", "Helvetica", "Arial", sans-serif`,
  },
  additionalDetails: {
    marginTop: "1rem",
  },
  detailIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: "8px",
    backgroundColor: "#f7f7f7",
    borderRadius: "6px",
    gap: "8px",
    boxSizing: "border-box",
  },
  propertyTypeIcon: {
    width: "24px",
    height: "24px",
    marginRight: "10px",
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
