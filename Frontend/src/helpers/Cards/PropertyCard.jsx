import React, { useState } from 'react';
import './styles/PropertyCard.css';

const PropertyCard = ({ property }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // ฟังก์ชันที่ตรวจสอบและกำหนดคลาสสำหรับแท็กที่มีข้อความพิเศษ
  const getTagClass = (tag) => {
    switch (tag) {
      case 'Listed by Redfin':
        return 'property-tag listed-by-redfin'; // เพิ่มคลาสพิเศษ
      case '3D Walkthrough':
        return 'property-tag three-d-walkthrough'; // เพิ่มคลาสพิเศษ
      default:
        return 'property-tag'; // คลาสพื้นฐานสำหรับแท็กอื่น ๆ
    }
  };

  const handleNextImage = () => {
    if (currentImageIndex < property.images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    } else {
      setCurrentImageIndex(0); // ไปที่รูปแรกเมื่อถึงรูปสุดท้าย
    }
  };

  const handlePrevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    } else {
      setCurrentImageIndex(property.images.length - 1); // ไปที่รูปสุดท้ายเมื่อถึงรูปแรก
    }
  };

  return (
    <div
      className="property-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="photo-slider">
        <img
          className="homecard-image"
          src={property.images[currentImageIndex]}
          alt={`Photo of ${property.address}`}
        />

        {/* แสดงแท็กที่ตำแหน่งใกล้กับรูปภาพ */}
        <div className="property-tags">
          {property.tags && property.tags.map((tag, index) => (
            <span key={index} className={getTagClass(tag)}>
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* ปุ่มแสดงเมื่อ hover */}
      <div className={`slider-controls ${isHovered ? 'show' : ''}`}>
        <button onClick={handlePrevImage} className="slider-button prev">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
            <path d="M16.866 23.134l1.06-1.06a.25.25 0 000-.355L7.81 11.603l10.116-10.115a.25.25 0 000-.355l-1.06-1.06a.25.25 0 00-.354 0L5.16 11.427a.25.25 0 000 .353L16.512 23.134a.25.25 0 00.354 0"></path>
          </svg>
        </button>
        <button onClick={handleNextImage} className="slider-button next">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
            <path d="M7.134 23.134l-1.06-1.06a.25.25 0 010-.355L16.19 11.603 6.074 1.488a.25.25 0 010-.355l1.06-1.06a.25.25 0 01.354 0L18.84 11.427a.25.25 0 010 .353L7.488 23.134a.25.25 0 01-.354 0"></path>
          </svg>
        </button>
      </div>

      <div className="property-details">
        <h3 className="property-price">${property.price}</h3>
        <div className="property-stats">
          <span>{property.beds} beds</span>
          <span>{property.baths} baths</span>
          <span>{property.sqft} sq ft</span>
        </div>
        <p className="property-address">{property.address}</p>
      </div>
    </div>
  );
};

export default PropertyCard;
