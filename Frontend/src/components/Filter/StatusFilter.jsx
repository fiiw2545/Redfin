import React, { useState, useEffect, useRef } from "react";

const StatusFilter = ({ onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isDoneHovered, setIsDoneHovered] = useState(false);
  const dropdownRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const [selectedFilter, setSelectedFilter] = useState("For sale");
  const [subFilters, setSubFilters] = useState({
    comingSoon: true,
    active: true,
    underContract: false,
  });
  const [soldTimeframe, setSoldTimeframe] = useState("Last 3 months");
  const [expanded, setExpanded] = useState({
    forSale: true,
    sold: false,
  });

  const toggleSection = (section) => {
    setExpanded((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // ส่งค่ากรองเมื่อมีการเลือกตัวกรอง (ยังไม่ได้)
  const handleFilterChange = () => {
    onFilterChange(selectedFilter, subFilters, soldTimeframe);
  };

  return (
    <div
      ref={dropdownRef}
      style={{
        ...styles.fontGlobal,
        position: "relative",
        display: "inline-block",
      }}
    >
      <button
        style={{
          ...styles.DropdownButton,
          ...(isHovered ? styles.DropdownButtonHover : {}),
        }}
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {selectedFilter}
        <svg
          style={{
            ...styles.svgIcon,
            fill: isHovered ? "#00828C" : "#585858",
          }}
          viewBox="0 0 24 24"
        >
          <path d="M15.932 10a.5.5 0 01.385.82l-3.933 4.72a.5.5 0 01-.768 0l-3.933-4.72a.5.5 0 01.385-.82h7.864z"></path>
        </svg>
      </button>

      {isOpen && (
        <div style={styles.filterDropdownDropdown}>
          <div>
            <div
              style={styles.sectionHeader}
              onClick={() => toggleSection("forSale")}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setSelectedFilter("For sale");
                  handleFilterChange();
                }}
              >
                <input
                  type="radio"
                  id="forSale"
                  name="listingType"
                  checked={selectedFilter === "For sale"}
                  onChange={() => {
                    setSelectedFilter("For sale");
                    handleFilterChange();
                  }}
                  style={styles.hiddenInput}
                />
                <div
                  style={{
                    ...styles.radioButton,
                    ...(selectedFilter === "For sale"
                      ? styles.radioChecked
                      : styles.radioUnchecked),
                  }}
                >
                  {selectedFilter === "For sale" && (
                    <div style={styles.radioInnerCircle} />
                  )}
                </div>
                <label
                  htmlFor="forSale"
                  style={{ marginLeft: "8px", fontSize: "16px" }}
                >
                  For sale
                </label>
              </div>
              {expanded.forSale ? (
                <svg
                  style={{
                    ...styles.svgIcon,
                    transform: "rotate(180deg)",
                  }}
                  viewBox="0 0 24 24"
                >
                  <path d="M15.932 10a.5.5 0 01.385.82l-3.933 4.72a.5.5 0 01-.768 0l-3.933-4.72a.5.5 0 01.385-.82h7.864z"></path>
                </svg>
              ) : (
                <svg style={styles.svgIcon} viewBox="0 0 24 24">
                  <path d="M15.932 10a.5.5 0 01.385.82l-3.933 4.72a.5.5 0 01-.768 0l-3.933-4.72a.5.5 0 01.385-.82h7.864z"></path>
                </svg>
              )}
            </div>
            {expanded.forSale && (
              <div style={{ marginLeft: "24px", marginTop: "8px" }}>
                {Object.entries(subFilters).map(([key, value]) => (
                  <div
                    key={key}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      cursor: "pointer",
                      marginBottom: "10px",
                    }}
                    onClick={() =>
                      setSubFilters({ ...subFilters, [key]: !value })
                    }
                  >
                    <input
                      type="checkbox"
                      id={key}
                      checked={value}
                      onChange={() =>
                        setSubFilters({ ...subFilters, [key]: !value })
                      }
                      style={styles.hiddenInput}
                    />
                    <div
                      style={{
                        ...styles.checkboxButton,
                        ...(value
                          ? styles.checkboxChecked
                          : styles.checkboxUnchecked),
                      }}
                    >
                      {value && (
                        <svg width="16" height="16">
                          <path
                            fill="#fff"
                            d="M6.349 12.874a1 1 0 01-.771-.342l-3.5-4a1 1 0 111.505-1.317l2.72 3.108 5.751-7.08a1 1 0 111.553 1.261l-6.5 8a1 1 0 01-.758.37z"
                          ></path>
                        </svg>
                      )}
                    </div>
                    <label htmlFor={key} style={{ marginLeft: "8px" }}>
                      {key === "comingSoon" && "Coming soon"}
                      {key === "active" && "Active"}
                      {key === "underContract" && "Under contract/pending"}
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>

          <hr style={{ margin: "12px 0" }} />

          <div
            style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
            onClick={() => {
              setSelectedFilter("For rent");
              handleFilterChange();
            }}
          >
            <input
              type="radio"
              id="forRent"
              name="listingType"
              checked={selectedFilter === "For rent"}
              onChange={() => {
                setSelectedFilter("For rent");
                handleFilterChange();
              }}
              style={styles.hiddenInput}
            />
            <div
              style={{
                ...styles.radioButton,
                ...(selectedFilter === "For rent"
                  ? styles.radioChecked
                  : styles.radioUnchecked),
              }}
            >
              {selectedFilter === "For rent" && (
                <div style={styles.radioInnerCircle} />
              )}
            </div>
            <label
              htmlFor="forRent"
              style={{ marginLeft: "8px", fontSize: "16px" }}
            >
              For rent
            </label>
          </div>

          <hr style={{ margin: "12px 0" }} />

          <div>
            <div
              style={styles.sectionHeader}
              onClick={() => toggleSection("sold")}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setSelectedFilter("Sold");
                  handleFilterChange();
                }}
              >
                <input
                  type="radio"
                  id="sold"
                  name="listingType"
                  checked={selectedFilter === "Sold"}
                  onChange={() => {
                    setSelectedFilter("Sold");
                    handleFilterChange();
                  }}
                  style={styles.hiddenInput}
                />
                <div
                  style={{
                    ...styles.radioButton,
                    ...(selectedFilter === "Sold"
                      ? styles.radioChecked
                      : styles.radioUnchecked),
                  }}
                >
                  {selectedFilter === "Sold" && (
                    <div style={styles.radioInnerCircle} />
                  )}
                </div>
                <label
                  htmlFor="sold"
                  style={{ marginLeft: "8px", fontSize: "16px" }}
                >
                  Sold
                </label>
              </div>
              {expanded.sold ? (
                <svg
                  style={{
                    ...styles.svgIcon,
                    transform: "rotate(180deg)",
                  }}
                  viewBox="0 0 24 24"
                >
                  <path d="M15.932 10a.5.5 0 01.385.82l-3.933 4.72a.5.5 0 01-.768 0l-3.933-4.72a.5.5 0 01.385-.82h7.864z"></path>
                </svg>
              ) : (
                <svg style={styles.svgIcon} viewBox="0 0 24 24">
                  <path d="M15.932 10a.5.5 0 01.385.82l-3.933 4.72a.5.5 0 01-.768 0l-3.933-4.72a.5.5 0 01.385-.82h7.864z"></path>
                </svg>
              )}
            </div>
            {expanded.sold && (
              <div style={{ marginLeft: "24px", marginTop: "8px" }}>
                {[
                  "Last 1 week",
                  "Last 1 month",
                  "Last 3 months",
                  "Last 6 months",
                  "Last 1 year",
                  "Last 2 years",
                  "Last 3 years",
                ].map((timeframe) => (
                  <div
                    key={timeframe}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      cursor: "pointer",
                      marginBottom: "10px",
                    }}
                    onClick={() => setSoldTimeframe(timeframe)}
                  >
                    <input
                      type="radio"
                      id={timeframe}
                      name="soldTimeframe"
                      checked={soldTimeframe === timeframe}
                      onChange={() => setSoldTimeframe(timeframe)}
                      style={styles.hiddenInput}
                    />
                    <div
                      style={{
                        ...styles.radioButton,
                        ...(soldTimeframe === timeframe
                          ? styles.radioChecked
                          : styles.radioUnchecked),
                      }}
                    >
                      {soldTimeframe === timeframe && (
                        <div style={styles.radioInnerCircle} />
                      )}
                    </div>
                    <label htmlFor={timeframe} style={{ marginLeft: "8px" }}>
                      {timeframe}
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            style={{
              ...styles.doneButton,
              ...(isDoneHovered ? { backgroundColor: "#d55656" } : {}),
            }}
            onClick={() => setIsOpen(false)}
            onMouseEnter={() => setIsDoneHovered(true)}
            onMouseLeave={() => setIsDoneHovered(false)}
          >
            Done
          </button>
        </div>
      )}
    </div>
  );
};

const styles = {
  fontGlobal: {
    fontFamily:
      "Inter,-apple-system,BlinkMacSystemFont,Roboto,Droid Sans,Helvetica,Arial,sans-serif",
  },
  DropdownButton: {
    padding: "8px 4px 8px 12px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    backgroundColor: "white",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    fontSize: "14px",
    fontWeight: 500,
    color: "#585858",
    borderColor: "#585858",
    lineHeight: "1.5",
    height: "43px",
  },
  DropdownButtonHover: {
    backgroundColor: "#f1f1f1",
    borderColor: "#00828C",
    color: "#00828C",
  },
  filterDropdownDropdown: {
    position: "absolute",
    marginTop: "8px",
    width: "280px",
    backgroundColor: "white",
    border: "1px solid #ccc",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    zIndex: 1000,
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    cursor: "pointer",
  },
  checkbox: {
    accentColor: "#14b8a6",
    marginRight: "8px",
    width: "16px",
    height: "16px",
  },
  doneButton: {
    width: "100%",
    marginTop: "16px",
    padding: "12px",
    backgroundColor: "#C91C1C",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "16px",
  },
  svgIcon: {
    width: "24px",
    height: "24px",
  },

  hiddenInput: {
    display: "none",
  },
  radioButton: {
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    marginRight: "8px",
    border: "4px solid #ccc",
  },
  radioChecked: {
    borderColor: "#00828C",
    backgroundColor: "#00828C",
  },
  radioUnchecked: {
    borderColor: "#bbb",
    backgroundColor: "white",
  },
  radioInnerCircle: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    backgroundColor: "white",
  },
  checkboxButton: {
    width: "20px",
    height: "20px",
    borderRadius: "4px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "14px",
    fontWeight: "bold",
    cursor: "pointer",
    marginRight: "8px",
    border: "2px solid #ccc",
  },
  checkboxChecked: {
    backgroundColor: "#00828C",
    borderColor: "#00828C",
    color: "white",
  },
  checkboxUnchecked: {
    backgroundColor: "white",
    borderColor: "#bbb",
    color: "black",
  },
};
export default StatusFilter;
