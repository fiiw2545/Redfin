import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PropertyCard from "../../helpers/Cards/PropertyCard";
import { sortProperties } from "../../helpers/sortProperties";
import "./PropertyList.css";

const PropertyList = ({ displayedProperties, onPropertiesChange, sortBy }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialPage = parseInt(queryParams.get("page")) || 1;

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [properties, setProperties] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({
    comingSoon: true,
    active: true,
    underContract: true,
  });

  // ดึงข้อมูลบ้านจาก API เมื่อ currentPage เปลี่ยน
  useEffect(() => {
    fetch(`http://localhost:5000/api/homes/?page=${currentPage}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setProperties(data);
        }
      })
      .catch((error) => console.error("Error fetching properties:", error));
  }, [currentPage]);

  // กรองข้อมูลตามตัวเลือกที่เลือก
  const filteredProperties = properties.filter(
    (property) =>
      (selectedOptions.comingSoon && property.tags.includes("Coming Soon")) ||
      (selectedOptions.active && !property.tags.includes("Under Contract")) ||
      (selectedOptions.underContract &&
        property.tags.includes("Under Contract"))
  );

  // เรียงข้อมูลตามที่เลือก
  const sortedProperties = sortProperties(filteredProperties, sortBy);

  // คำนวณ Pagination
  const totalPages = Math.ceil(sortedProperties.length / 8);
  const startIndex = (currentPage - 1) * 8;
  const endIndex = startIndex + 8;
  const currentProperties = sortedProperties.slice(startIndex, endIndex);

  // ตรวจสอบการเปลี่ยนแปลงของ currentPage ก่อนที่จะแก้ไข URL
  useEffect(() => {
    // ตรวจสอบว่ามีการเปลี่ยนแปลงของ currentPage หรือไม่
    if (currentPage !== initialPage) {
      navigate(`?page=${currentPage}`);
    }
  }, [currentPage, navigate, initialPage]); // ตรวจสอบ currentPage และ initialPage

  // อัปเดต onPropertiesChange เพียงครั้งเดียวเมื่อ currentProperties เปลี่ยนแปลง
  useEffect(() => {
    if (onPropertiesChange) {
      onPropertiesChange(currentProperties);
    }
  }, [currentProperties, onPropertiesChange]); // แก้ไขให้เรียกเฉพาะเมื่อ currentProperties เปลี่ยน

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <>
      <div className="property-grid">
        {currentProperties.length > 0 ? (
          currentProperties.map((property) => (
            <PropertyCard key={property._id} property={property} />
          ))
        ) : (
          <p>No properties available on this page.</p>
        )}
      </div>

      <div className="pagination-container">
        <p className="pagination-info">
          Viewing page {currentPage} of {totalPages}
          <a href="/download-all" className="download-link">
            {" "}
            ( Download All ){" "}
          </a>
        </p>

        <div className="pagination">
          {/* ลูกศรย้อนกลับ (ซ่อนไว้ตอนหน้าแรก) */}
          <div className="pagination-button-wrapper">
            {currentPage !== 1 && (
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className="pagination-button"
              >
                {/* ลูกศรซ้าย */}
                <svg viewBox="0 0 25 24" className="pagination-icon left">
                  <path d="M15.01 18.707a1 1 0 000-1.414L9.715 12l5.295-5.293a1 1 0 10-1.414-1.414l-6 6a1 1 0 000 1.414l6 6a1 1 0 001.414 0z"></path>
                </svg>
              </button>
            )}
          </div>

          {/* ตัวเลขหน้าที่มี */}
          <div className="pagination-numbers">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                className={`pagination-number ${
                  currentPage === index + 1 ? "active" : ""
                }`}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </div>

          {/* ลูกศรถัดไป (ซ่อนไว้ตอนหน้าสุดท้าย) */}
          <div className="pagination-button-wrapper">
            {currentPage !== totalPages && (
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                className="pagination-button"
              >
                {/* ลูกศรขวา */}
                <svg viewBox="0 0 25 24" className="pagination-icon right">
                  <path d="M9.99 18.707a1 1 0 010-1.414L15.285 12 9.99 6.707a1 1 0 111.414-1.414l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0z"></path>
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PropertyList;
