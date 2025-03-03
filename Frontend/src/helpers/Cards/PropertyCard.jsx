import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/PropertyCard.css";

const PropertyCard = ({ property }) => {
  const navigate = useNavigate();
  const [images, setImages] = useState([]); // เก็บรูปภาพจาก API
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  // ตรวจสอบว่า property มีค่าและมี _id
  useEffect(() => {
    console.log("Property data:", property); // ตรวจสอบค่า property

    if (!property || !property._id) {
      console.error("❌ Property หรือ Property ID หายไป!");
      return;
    }

    const fetchImages = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/homes/${property._id}/images`
        );
        const data = await response.json();
        if (response.ok) {
          setImages(data.images);
        } else {
          console.error("เกิดข้อผิดพลาดในการโหลดรูปภาพ:", data.message);
        }
      } catch (error) {
        console.error("Error fetching images:", error.message);
      }
    };

    fetchImages();
  }, [property]);

  // ใช้รูปภาพแรกจาก API ถ้ามี ถ้าไม่มีให้ใช้ภาพเริ่มต้น
  const fullImageUrl =
    images.length > 0 ? images[currentImageIndex] : "/default-image.jpg";

  // ฟังก์ชันเปลี่ยนรูปไปข้างหน้า
  const handleNextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  // ฟังก์ชันเปลี่ยนรูปไปข้างหลัง
  const handlePrevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleCardClick = () => {
    navigate(`/property/${property._id}`);
    window.location.reload();
  };

  // ฟังก์ชันสำหรับกำหนดคลาสของแท็ก
  const getTagClass = (tag) => {
    switch (tag) {
      case "Listed by Redfin":
        return "property-tag listed-by-redfin";
      case "3D Walkthrough":
        return "property-tag three-d-walkthrough";
      default:
        return "property-tag";
    }
  };

  return (
    <div
      className="property-card"
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="photo-slider">
        <img
          className="homecard-image"
          src={fullImageUrl}
          alt={`Photo of ${property.address?.full || "property"}`}
        />

        <div className="property-tags">
          {property.tags &&
            property.tags.map((tag, index) => (
              <span key={index} className={getTagClass(tag)}>
                {tag}
              </span>
            ))}
        </div>
      </div>

      <div className={`slider-controls ${isHovered ? "show" : ""}`}>
        <button
          onClick={(e) => {
            e.stopPropagation(); // หยุด event ไม่ให้ส่งไปยัง parent
            handlePrevImage(e);
          }}
          className="slider-button prev"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
          >
            <path d="M16.866 23.134l1.06-1.06a.25.25 0 000-.355L7.81 11.603l10.116-10.115a.25.25 0 000-.355l-1.06-1.06a.25.25 0 00-.354 0L5.16 11.427a.25.25 0 000 .353L16.512 23.134a.25.25 0 00.354 0"></path>
          </svg>
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation(); // หยุด event ไม่ให้ส่งไปยัง parent
            handleNextImage(e);
          }}
          className="slider-button next"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
          >
            <path d="M7.134 23.134l-1.06-1.06a.25.25 0 010-.355L16.19 11.603 6.074 1.488a.25.25 0 010-.355l1.06-1.06a.25.25 0 01.354 0L18.84 11.427a.25.25 0 010 .353L7.488 23.134a.25.25 0 01-.354 0"></path>
          </svg>
        </button>
      </div>

      <div className="property-details">
        <div className="property-header">
          <h3 className="property-price">${property.price.toLocaleString()}</h3>
          <div className="property-actions">
            <button
              className={`favorite-button ${isFavorite ? "active" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                setIsFavorite((prev) => !prev);
              }}
              title="Add to Favorites"
            >
              <svg viewBox="0 0 24 24">
                <path d="M3.354 4.844C4.306 3.69 5.72 3 7.5 3c1.572 0 2.913.777 3.797 1.457.267.205.503.41.703.597.2-.187.436-.392.703-.597C13.587 3.777 14.928 3 16.5 3c1.78 0 3.194.689 4.146 1.844C21.577 5.974 22 7.468 22 9c0 1.205-.42 2.394-1.019 3.488-.601 1.1-1.416 2.162-2.283 3.131-1.735 1.937-3.766 3.59-4.99 4.522a2.813 2.813 0 01-3.417 0c-1.223-.931-3.254-2.585-4.989-4.522-.868-.969-1.682-2.032-2.283-3.131-.599-1.094-1.02-2.283-1.02-3.487.002-1.532.423-3.025 1.355-4.156z"></path>
              </svg>
            </button>

            <button
              className="share-button"
              title="Share this Property"
              onClick={(e) => {
                e.stopPropagation();
                alert("Link copied to clipboard!");
              }}
            >
              <svg viewBox="0 0 24 24">
                <path d="M12.617 3.076a1 1 0 011.09.217l8 8a1 1 0 010 1.414l-8 8A1 1 0 0112 20v-4c-4.317 0-6.255 1.194-7.132 2.169a3.514 3.514 0 00-.77 1.337c-.086.29-.098.507-.098.507A1 1 0 012 20c0-.177.009-.354.02-.531.018-.323.056-.778.13-1.323.148-1.084.445-2.547 1.05-4.025.603-1.475 1.531-3.01 2.965-4.177C7.615 8.762 9.528 8 12 8V4a1 1 0 01.617-.924z"></path>
              </svg>
            </button>
          </div>
        </div>

        <div className="property-stats">
          <span>{property.details.beds} beds</span>
          <span>{property.details.baths} baths</span>
          <span>{property.details.sqft.toLocaleString()} sq ft</span>
        </div>
        <p className="property-address">{property.address.full}</p>
      </div>
    </div>
  );
};

export default PropertyCard;
