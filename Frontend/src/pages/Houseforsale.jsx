import React from "react";
import Navbar from "../components/Navbar/Navbar";
import "./styles/Houseforsale.css";
import { useGlobalEvent } from "../context/GlobalEventContext";

import PropertyCard from "../helpers/Cards/PropertyCard";
import propertyData from "../data/properties";

const Housesforsale = () => {
  const { windowSize } = useGlobalEvent();
  const isMobileView = windowSize.width < 0;
  return (
    <>
      <Navbar />

      <div
        className={`filters-container ${
          isMobileView ? "mobile-layout" : "desktop-layout"
        }`}
      >
        {/* Filters อยู่ด้านซ้าย */}
        <div className="filters">
          <button className="housesforsale-dropdown">For sale ▾</button>
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

        {/* View Options อยู่ด้านขวา */}
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
            <strong>1</strong> of <strong>36</strong> homes
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
        {propertyData.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>

      <div className="pagination">Viewing page 1 of 9</div>
    </>
  );
};

export default Housesforsale;
