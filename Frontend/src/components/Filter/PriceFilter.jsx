import React, { useState, useRef } from "react";

const PriceFilter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [range, setRange] = useState([50000, 10000000]);
  const minValue = 50000;
  const maxValue = 10000000;
  const sliderRef = useRef(null);

  const getPercent = (value) =>
    ((value - minValue) * 100) / (maxValue - minValue);

  const handleThumbMove = (index, event) => {
    const rect = sliderRef.current.getBoundingClientRect();
    const percent = ((event.clientX - rect.left) / rect.width) * 100;
    const newValue = Math.round(
      (percent / 100) * (maxValue - minValue) + minValue
    );

    setRange((prev) => {
      const updatedRange = [...prev];
      updatedRange[index] = Math.min(Math.max(newValue, minValue), maxValue);
      return updatedRange;
    });
  };

  return (
    <div style={styles.filterContainer}>
      <button
        style={{
          ...styles.DropdownButton,
          ...(isHovered ? styles.DropdownButtonHover : {}),
        }}
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        Price
        <svg
          style={{ ...styles.svgIcon, fill: isHovered ? "#00828C" : "#585858" }}
          viewBox="0 0 24 24"
        >
          <path d="M15.932 10a.5.5 0 01.385.82l-3.933 4.72a.5.5 0 01-.768 0l-3.933-4.72a.5.5 0 01.385-.82h7.864z"></path>
        </svg>
      </button>

      {isOpen && (
        <div style={styles.dropdown}>
          <div style={styles.sliderContainer} ref={sliderRef}>
            <div style={styles.sliderTrack}></div>
            <div
              style={{
                ...styles.sliderThumb,
                left: `${getPercent(range[0])}%`,
              }}
              onMouseDown={(e) => handleThumbMove(0, e)}
            ></div>
            <div
              style={{
                ...styles.sliderThumb,
                left: `${getPercent(range[1])}%`,
              }}
              onMouseDown={(e) => handleThumbMove(1, e)}
            ></div>
          </div>
          <div style={styles.inputContainer}>
            <input
              type="number"
              value={range[0]}
              style={styles.input}
              readOnly
            />
            <span>-</span>
            <input
              type="number"
              value={range[1]}
              style={styles.input}
              readOnly
            />
          </div>
          <div style={styles.buttonGroup}>
            <button
              style={styles.resetButton}
              onClick={() => setRange([50000, 10000000])}
            >
              Reset
            </button>
            <button style={styles.doneButton} onClick={() => setIsOpen(false)}>
              Done
            </button>
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
  dropdown: {
    position: "absolute",
    marginTop: "0.5rem",
    padding: "1rem",
    backgroundColor: "white",
    borderRadius: "0.5rem",
    width: "300px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    zIndex: 1000,
  },
  sliderContainer: {
    position: "relative",
    height: "3rem",
    marginBottom: "1rem",
  },
  sliderTrack: {
    position: "absolute",
    top: "50%",
    width: "100%",
    height: "4px",
    backgroundColor: "#e5e7eb",
  },
  sliderThumb: {
    position: "absolute",
    top: "50%",
    width: "16px",
    height: "16px",
    backgroundColor: "white",
    border: "2px solid #00828C",
    borderRadius: "50%",
    cursor: "pointer",
    transform: "translate(-50%, -50%)",
  },
  inputContainer: {
    display: "flex",
    marginTop: "1rem",
    gap: "0.5rem",
  },
  input: {
    width: "100%",
    padding: "0.5rem",
    border: "1px solid #ccc",
    borderRadius: "4px",
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "1rem",
  },
  resetButton: {
    color: "#00828C",
    cursor: "pointer",
    background: "none",
    border: "none",
  },
  doneButton: {
    backgroundColor: "#dc2626",
    color: "white",
    padding: "0.5rem 1rem",
    borderRadius: "4px",
    cursor: "pointer",
  },
  svgIcon: {
    width: "24px",
    height: "24px",
  },
};

export default PriceFilter;
