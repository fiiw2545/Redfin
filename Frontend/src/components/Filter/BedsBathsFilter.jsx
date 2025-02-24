import React, { useState, useEffect } from "react";

const ViewOption = ({ onSelect }) => {
  const [selected, setSelected] = useState(
    localStorage.getItem("viewOption") || "List"
  ); // ดึงค่าจาก localStorage ถ้ามี
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  const [hoveredButton, setHoveredButton] = useState(null);

  useEffect(() => {
    const handleResize = () => setIsMobileView(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const icons = {
    List: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
        <path d="M9 4H4v5h5V4zM4 2a2 2 0 00-2 2v5a2 2 0 002 2h5a2 2 0 002-2V4a2 2 0 00-2-2H4zM20 4h-5v5h5V4zm-5-2a2 2 0 00-2 2v5a2 2 0 002 2h5a2 2 0 002-2V4a2 2 0 00-2-2h-5zM20 15h-5v5h5v-5zm-5-2a2 2 0 00-2 2v5a2 2 0 002 2h5a2 2 0 002-2v-5a2 2 0 00-2-2h-5zM9 15H4v5h5v-5zm-5-2a2 2 0 00-2 2v5a2 2 0 002 2h5a2 2 0 002-2v-5a2 2 0 00-2-2H4z"></path>
      </svg>
    ),
    Split: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
        <path d="M5 21c-.55 0-1.02-.196-1.413-.587A1.926 1.926 0 013 19V5c0-.55.196-1.02.587-1.413A1.926 1.926 0 015 3h14c.55 0 1.02.196 1.413.587C20.803 3.98 21 4.45 21 5v14c0 .55-.196 1.02-.587 1.413A1.926 1.926 0 0119 21H5zm3-2V5H5v14h3zm2 0h9V5h-9v14z"></path>
      </svg>
    ),
    Map: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
        <path d="M8.684 3.051a1 1 0 01.632 0L15 4.946l4.367-1.456A2 2 0 0122 5.387V17.28a2 2 0 01-1.367 1.898l-5.317 1.772a1 1 0 01-.632 0L9 19.054 4.632 20.51A2 2 0 012 18.613V6.72a2 2 0 011.368-1.898l5.316-1.772zM10 17.28l4 1.334V6.72l-4-1.334V17.28zM8 5.387L4 6.721v11.892l4-1.334V5.387zm8 1.334v11.892l4-1.334V5.387l-4 1.334z"></path>
      </svg>
    ),
  };

  const handleSelect = (option) => {
    setSelected(option);
    localStorage.setItem("viewOption", option); // เก็บค่าการเลือกใน localStorage
    onSelect(option); // ส่งค่าไปที่ Test.js
  };

  return (
    <div style={styles.viewoptionsbox}>
      {["List", "Split", "Map"].map((option) => (
        <button
          key={option}
          onClick={() => handleSelect(option)}
          onMouseEnter={() => setHoveredButton(option)}
          onMouseLeave={() => setHoveredButton(null)}
          style={{
            ...styles.button,
            backgroundColor:
              selected === option
                ? "#00828C"
                : hoveredButton === option
                ? "#DFF6F5"
                : "transparent",
            color:
              selected === option
                ? "#fff"
                : hoveredButton === option
                ? "#00828C"
                : "#000",
            fontWeight: selected === option ? "600" : "500",
            padding: isMobileView ? "7px" : "8px 16px",
            width: isMobileView ? "auto" : "80px",
            gap: isMobileView ? "0px" : "5px",
          }}
        >
          {isMobileView ? icons[option] : option}
        </button>
      ))}
    </div>
  );
};

const styles = {
  viewoptionsbox: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "4px",
    borderRadius: "8px",
    border: "1px solid #585858",
    height: "43px",
    justifyContent: "center",
  },
  button: {
    border: "none",
    cursor: "pointer",
    padding: "8px 16px",
    borderRadius: "6px",
    fontSize: "16px",
    fontWeight: "500",
    width: "80px",
    fontFamily:
      "Inter,-apple-system,BlinkMacSystemFont,Roboto,Droid Sans,Helvetica,Arial,sans-serif",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
};

export default ViewOption;
