import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar/Navbar";
import "./styles/Houseforsale.css";
import { useGlobalEvent } from "../context/GlobalEventContext";
import { useNavigate, useLocation } from "react-router-dom";
import PropertyCard from "../helpers/Cards/PropertyCard";
import propertyData from "../data/properties";

const Housesforsale = () => {
  const { windowSize } = useGlobalEvent();
  const isMobileView = windowSize.width < 768;
  const navigate = useNavigate();
  const location = useLocation();

  const itemsPerPage = 4;
  const totalPages = Math.ceil(propertyData.length / itemsPerPage);

  // อ่านค่า page จาก URL query
  const queryParams = new URLSearchParams(location.search);
  const initialPage = parseInt(queryParams.get("page")) || 1;

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState({
    comingSoon: true,
    active: true,
    underContract: false,
  });

  // อัปเดต currentPage ทุกครั้งที่ query parameter page เปลี่ยน
  useEffect(() => {
    const page = parseInt(queryParams.get("page")) || 1;
    if (page !== currentPage) {
      setCurrentPage(page);
    }
  }, [location.search]); // ใช้ location.search เป็น dependency

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProperties = propertyData.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      navigate(`?page=${pageNumber}`); // อัปเดต URL query parameter
    }
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleOptionChange = (option) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [option]: !prev[option],
    }));
  };

  return (
    <>
      <Navbar />
      <div
        className={`filters-container ${
          isMobileView ? "mobile-layout" : "desktop-layout"
        }`}
      >
        <div className="filters">
          <div className="dropdown-wrapper">
            <button className="housesforsale-dropdown" onClick={toggleDropdown}>
              For sale ▾
            </button>

            {showDropdown && (
              <div className="dropdown-menu">
                <div>
                  <input
                    type="checkbox"
                    id="comingSoon"
                    checked={selectedOptions.comingSoon}
                    onChange={() => handleOptionChange("comingSoon")}
                  />
                  <label htmlFor="comingSoon">Coming soon</label>
                </div>
                <div>
                  <input
                    type="checkbox"
                    id="active"
                    checked={selectedOptions.active}
                    onChange={() => handleOptionChange("active")}
                  />
                  <label htmlFor="active">Active</label>
                </div>
                <div>
                  <input
                    type="checkbox"
                    id="underContract"
                    checked={selectedOptions.underContract}
                    onChange={() => handleOptionChange("underContract")}
                  />
                  <label htmlFor="underContract">Under contract/pending</label>
                </div>
                <button className="done-button" onClick={toggleDropdown}>
                  Done
                </button>
              </div>
            )}
          </div>

          <button className="housesforsale-dropdown price">Price ▾</button>
          <button className="housesforsale-dropdown beds-baths">
            Beds/baths ▾
          </button>
          <button className="housesforsale-dropdown home-type">
            Home type ▾
          </button>
          <button className="housesforsale-filters-icon">
            <i className="fas fa-sliders-h"></i> All filters
          </button>
          <button className="housesforsale-save-search">Save search</button>
        </div>

        <div className="housesforsale-view-options">
          <button className="active">List</button>
          <button>Split</button>
          <button>Map</button>
        </div>
      </div>

      <div className="listing-header">
        <div className="housesforsale-header">
          <h1>Chicago, IL homes for sale & real estate</h1>
        </div>

        <div className="listing-header-right">
          <span>
            <strong>{startIndex + 1}</strong> -{" "}
            <strong>{Math.min(endIndex, propertyData.length)}</strong> of{" "}
            <strong>{propertyData.length}</strong> homes
          </span>
          <span>
            Sort: <button className="sort-dropdown">Recommended ▾</button>
          </span>
          <span>
            View: <button className="view-dropdown">Photos ▾</button>
          </span>
        </div>
      </div>

      <div className="property-grid">
        {currentProperties.length > 0 ? (
          currentProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))
        ) : (
          <p>No properties available on this page.</p>
        )}
      </div>

      <div className="pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          &lt;
        </button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            className={currentPage === index + 1 ? "active" : ""}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          &gt;
        </button>
      </div>
    </>
  );
};

export default Housesforsale;
