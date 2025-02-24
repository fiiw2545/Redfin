import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useGlobalEvent } from "../../context/GlobalEventContext";
import properties from "../../data/properties";
import { sortProperties } from "../../helpers/sortProperties";
import { CiLineHeight } from "react-icons/ci";

const sortOptions = [
  "Recommended",
  "Newest",
  "Price (low to high)",
  "Price (high to low)",
  "Square feet",
  "Lot size",
  "Price/sq. ft.",
];

const viewOptions = ["Photos", "Table"];

const PropertyHeader = ({
  displayedProperties,
  onSortChange,
  onViewChange,
}) => {
  const { windowSize } = useGlobalEvent();
  const isTablet = windowSize.width <= 768;
  const isMobile = windowSize.width <= 500;
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get("query");

  const [selectedSort, setSelectedSort] = useState("Recommended");
  const [selectedView, setSelectedView] = useState("Photos");

  // ✅ Handle Sort Change
  const handleSortChange = (e) => {
    const newSort = e.target.value;
    setSelectedSort(newSort);
    onSortChange(newSort);
  };

  // ✅ Handle View Change
  const handleViewChange = (e) => {
    const newView = e.target.value;
    setSelectedView(newView);
    onViewChange(newView);
  };

  return (
    <div style={styles.container}>
      {/* ✅ Desktop Layout */}
      {!isTablet ? (
        <div style={styles.desktopRow}>
          <h1 style={styles.title}>
            {searchQuery
              ? `${searchQuery}, IL homes for sale & real estate`
              : "All Homes"}
          </h1>
          <div style={styles.rightContainer}>
            <span style={styles.count}>
              <b>{displayedProperties.length}</b> of{" "}
              <b>{properties.length} homes</b>
            </span>
            <span style={styles.sort}>
              <b>Sort:</b>
              <div style={styles.selectContainer}>
                <select
                  style={styles.dropdown}
                  value={selectedSort}
                  onChange={handleSortChange}
                >
                  {sortOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <svg style={styles.icon} viewBox="0 0 24 24">
                  <path d="M15.932 10a.5.5 0 01.385.82l-3.933 4.72a.5.5 0 01-.768 0l-3.933-4.72a.5.5 0 01.385-.82h7.864z"></path>
                </svg>
              </div>
            </span>
            <span style={styles.view}>
              <b>View:</b>
              <div style={styles.selectContainer}>
                <select
                  style={styles.dropdown}
                  value={selectedView}
                  onChange={handleViewChange}
                >
                  {viewOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <svg style={styles.icon} viewBox="0 0 24 24">
                  <path d="M15.932 10a.5.5 0 01.385.82l-3.933 4.72a.5.5 0 01-.768 0l-3.933-4.72a.5.5 0 01.385-.82h7.864z"></path>
                </svg>
              </div>
            </span>
          </div>
        </div>
      ) : (
        // ✅ Tablet & Mobile Layout
        <>
          <h1 style={styles.title}>
            {searchQuery
              ? `${searchQuery}, IL homes for sale & real estate`
              : "All Homes"}
          </h1>
          <div
            style={{
              ...styles.infoContainer,
              flexDirection: isMobile ? "column" : "row",
              alignItems: isMobile ? "flex-start" : "center",
            }}
          >
            <span style={styles.count}>
              <b>{displayedProperties.length}</b> of{" "}
              <b>{properties.length} homes</b>
            </span>
            <div
              style={{
                ...styles.filterContainer,
                flexDirection: isMobile ? "column" : "row",
              }}
            >
              <span style={styles.sort}>
                <b>Sort:</b>
                <div style={styles.selectContainer}>
                  <select
                    style={styles.dropdown}
                    value={selectedSort}
                    onChange={handleSortChange}
                  >
                    {sortOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <svg style={styles.icon} viewBox="0 0 24 24">
                    <path d="M15.932 10a.5.5 0 01.385.82l-3.933 4.72a.5.5 0 01-.768 0l-3.933-4.72a.5.5 0 01.385-.82h7.864z"></path>
                  </svg>
                </div>
              </span>
              <span style={styles.view}>
                <b>View:</b>
                <div style={styles.selectContainer}>
                  <select
                    style={styles.dropdown}
                    value={selectedView}
                    onChange={handleViewChange}
                  >
                    {viewOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <svg style={styles.icon} viewBox="0 0 24 24">
                    <path d="M15.932 10a.5.5 0 01.385.82l-3.933 4.72a.5.5 0 01-.768 0l-3.933-4.72a.5.5 0 01.385-.82h7.864z"></path>
                  </svg>
                </div>
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    padding: "16px",
    backgroundColor: "white",
    width: "100%",
    borderBottom: "1px solid #ddd",
  },
  desktopRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  rightContainer: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },
  title: {
    fontSize: "18px",
    fontWeight: "bold",
    margin: 0,
  },
  infoContainer: {
    display: "flex",
    width: "100%",
    fontSize: "14px",
    color: "#333",
  },
  count: {
    fontSize: "14px",
  },
  filterContainer: {
    display: "flex",
  },
  sort: {
    display: "flex",
    alignItems: "center",
    color: "#333",
    gap: "5px",
    fontSize: "14px",
  },
  view: {
    display: "flex",
    alignItems: "center",
    color: "#333",
    gap: "5px",
    fontSize: "14px",
  },
  selectContainer: {
    position: "relative",
    display: "inline-block",
    fontSize: "14px",
  },
  dropdown: {
    padding: "4px 20px 4px 1px",
    fontSize: "14px",
    border: "none",
    backgroundColor: "transparent",
    color: "#00828C",
    cursor: "pointer",
    fontWeight: "bold",
    appearance: "none",
  },
  icon: {
    position: "absolute",
    right: "5px",
    top: "50%",
    transform: "translateY(-50%)",
    width: "16px",
    height: "16px",
    fill: "#00828C",
    pointerEvents: "none",
  },
};

export default PropertyHeader;
