import React, { useState, useEffect, useRef } from "react";

const BedsBathsFilter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedBeds, setSelectedBeds] = useState(["Any"]);
  const [selectedBath, setSelectedBath] = useState("Any");
  const [isHoveredBeds, setIsHoveredBeds] = useState(null);
  const [isHoveredBaths, setIsHoveredBaths] = useState(null);
  const [isDropdownHovered, setIsDropdownHovered] = useState(false);
  const [isResetHovered, setIsResetHovered] = useState(false);
  const [isDoneHovered, setIsDoneHovered] = useState(false);
  const dropdownRef = useRef(null);

  const bedOptions = ["Any", "Studio", "1", "2", "3", "4", "5+"];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleBedSelection = (value) => {
    let newSelection = new Set(selectedBeds);

    if (value === "Any") {
      setSelectedBeds(["Any"]); // รีเซ็ตทุกอย่าง
    } else if (value === "Studio") {
      setSelectedBeds(["Studio"]); // เลือก Studio เท่านั้น
    } else {
      if (newSelection.has(value)) {
        newSelection.delete(value); // ถ้าคลิกซ้ำให้ลบออก
      } else {
        newSelection.add(value); // ถ้ายังไม่มีให้เพิ่ม
      }

      // ถ้าตัวเลขถูกเลือก ต้องรวม Studio
      if (
        [...newSelection].some((item) =>
          ["1", "2", "3", "4", "5+"].includes(item)
        )
      ) {
        newSelection.add("Studio");
      } else {
        newSelection.delete("Studio");
      }

      // ถ้าตัวเลขทั้งหมดถูกลบ และไม่มี Studio ให้เลือก Any กลับมา
      if (newSelection.size === 0) {
        newSelection.add("Any");
      } else {
        newSelection.delete("Any");
      }

      setSelectedBeds(Array.from(newSelection));
    }
  };

  const handleBathSelection = (value) => {
    setSelectedBath(value);
  };

  const handleReset = () => {
    setSelectedBeds(["Any"]);
    setSelectedBath("Any");
  };
  return (
    <div style={styles.filterContainer} ref={dropdownRef}>
      <button
        style={{
          ...styles.DropdownButton,
          ...(isDropdownHovered ? styles.DropdownButtonHover : {}),
        }}
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsDropdownHovered(true)}
        onMouseLeave={() => !isOpen && setIsDropdownHovered(false)}
      >
        Beds/baths
        <svg
          style={{
            ...styles.svgIcon,
            fill: isDropdownHovered ? "#00828C" : "#585858",
          }}
          viewBox="0 0 24 24"
        >
          <path d="M15.932 10a.5.5 0 01.385.82l-3.933 4.72a.5.5 0 01-.768 0l-3.933-4.72a.5.5 0 01.385-.82h7.864z"></path>
        </svg>
      </button>
      {isOpen && (
        <div
          style={styles.container}
          onMouseEnter={() => setIsDropdownHovered(true)}
          onMouseLeave={() => setIsDropdownHovered(false)}
        >
          <div style={styles.bedsBathsSection}>
            {/* Beds Section */}
            <div style={styles.bedsContainer}>
              <div style={styles.header}>
                <h4 style={styles.title}>Beds</h4>
                <p style={styles.subtitle}>Tap two numbers to select a range</p>
              </div>
              <div style={styles.optionsRow}>
                {bedOptions.map((bed, index) => (
                  <button
                    key={bed}
                    onClick={() => handleBedSelection(bed)}
                    onMouseEnter={() => setIsHoveredBeds(bed)}
                    onMouseLeave={() => setIsHoveredBeds(null)}
                    style={{
                      ...styles.optionButton,
                      ...(selectedBeds.includes(bed)
                        ? styles.optionButtonSelected
                        : isHoveredBeds === bed
                        ? styles.optionButtonHover
                        : {}),
                      flex: index === 0 ? 1.5 : 1, // ปรับให้ปุ่ม Any มีขนาดที่สมดุล
                    }}
                  >
                    {bed}
                  </button>
                ))}
              </div>
            </div>

            {/* Baths Section */}
            <div style={styles.bathsContainer}>
              <div style={styles.header}>
                <h4 style={styles.title}>Baths</h4>
              </div>
              <div style={styles.optionsRow}>
                {["Any", "1+", "1.5+", "2+", "2.5+", "3+", "4+"].map((bath) => (
                  <button
                    key={bath}
                    onClick={() => handleBathSelection(bath)}
                    onMouseEnter={() => setIsHoveredBaths(bath)}
                    onMouseLeave={() => setIsHoveredBaths(null)}
                    style={{
                      ...styles.optionButton,
                      ...(selectedBath === bath
                        ? styles.optionButtonSelected
                        : isHoveredBaths === bath
                        ? styles.optionButtonHover
                        : {}),
                    }}
                  >
                    {bath}
                  </button>
                ))}
              </div>
            </div>
            {/* Reset & Done Buttons */}
            <div style={styles.buttonRow}>
              <button
                style={{
                  ...styles.resetButton,
                  ...(isResetHovered
                    ? { backgroundColor: "rgba(21, 114, 122, 0.2)" }
                    : {}),
                }}
                onClick={handleReset}
                onMouseEnter={() => setIsResetHovered(true)}
                onMouseLeave={() => setIsResetHovered(false)}
              >
                Reset
              </button>

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
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  filterContainer: {
    position: "relative",
    display: "inline-block",
    fontFamily: `"Inter", -apple-system, BlinkMacSystemFont, "Roboto", "Droid Sans", "Helvetica", "Arial", sans-serif`,
  },
  DropdownButton: {
    padding: "8px 12px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    backgroundColor: "white",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    fontSize: "14px",
    fontWeight: "500",
    color: "#585858",
    borderColor: "#585858",
    lineHeight: "1.5",
    height: "43px",
    fontFamily: `"Inter", -apple-system, BlinkMacSystemFont, "Roboto", "Droid Sans", "Helvetica", "Arial", sans-serif`,
  },
  DropdownButtonHover: {
    backgroundColor: "#f1f1f1",
    borderColor: "#00828C",
    color: "#00828C",
  },
  svgIcon: {
    width: "24px",
    height: "24px",
  },

  container: {
    position: "absolute",
    top: "50px",
    left: "0",
    backgroundColor: "#fff",
    border: "1px solid #ccc",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    padding: "20px",
    zIndex: 1000,
    width: "max-content",
    fontFamily: `"Inter", -apple-system, BlinkMacSystemFont, "Roboto", "Droid Sans", "Helvetica", "Arial", sans-serif`,
  },
  bedsBathsSection: {
    display: "flex",
    flexDirection: "column",
  },
  bedsContainer: {
    display: "flex",
    flexDirection: "column",
    marginBottom: "1rem",
  },
  bathsContainer: {
    display: "flex",
    flexDirection: "column",
    marginBottom: "1rem",
  },
  header: {
    display: "flex",
    alignItems: "baseline",
    justifyContent: "start",
    marginBottom: "1rem",
    gap: "1rem",
  },
  title: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#333",
  },
  subtitle: {
    fontSize: "14px",
    color: "#666",
  },

  optionsRow: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "1px",
    border: "1px solid #ccc",
    borderRadius: "10px",
    padding: "5px",
    backgroundColor: "#fff",
  },
  optionButton: {
    padding: "8px 16px",
    margin: "0 1px",
    border: "2px solid transparent",
    backgroundColor: "transparent",
    cursor: "pointer",
    fontSize: "16px",
    color: "#333",
    borderRadius: "7px",
    transition: "all 0.2s ease-in-out",
    fontFamily: `"Inter", -apple-system, BlinkMacSystemFont, "Roboto", "Droid Sans", "Helvetica", "Arial", sans-serif`,
  },
  optionButtonSelected: {
    backgroundColor: "rgba(21, 114, 122, 0.2)",
    fontWeight: "bold",
    border: "2px solid #15727A",
    color: "#15727A",
  },
  optionButtonHover: {
    backgroundColor: "rgba(21, 114, 122, 0.2)",
    color: "#00828C",
    border: "2px solid #00828C",
  },

  buttonRow: {
    display: "flex",
    justifyContent: "end",
    marginTop: "12px",
    gap: "1rem",
  },
  resetButton: {
    backgroundColor: "transparent",
    color: "#15727A",
    fontWeight: "bold",
    border: "none",
    padding: "12px 24px",
    cursor: "pointer",
    fontSize: "16px",
    fontFamily: `"Inter", -apple-system, BlinkMacSystemFont, "Roboto", "Droid Sans", "Helvetica", "Arial", sans-serif`,
    width: "90px",
    borderRadius: "6px",
  },
  doneButton: {
    backgroundColor: "#C91C1C",
    color: "#fff",
    fontWeight: "bold",
    border: "none",
    borderRadius: "6px",
    padding: "12px 24px",
    cursor: "pointer",
    fontSize: "16px",
    fontFamily: `"Inter", -apple-system, BlinkMacSystemFont, "Roboto", "Droid Sans", "Helvetica", "Arial", sans-serif`,
    width: "90px",
  },
};

export default BedsBathsFilter;
