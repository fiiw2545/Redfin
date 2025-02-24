import React, { useState, useEffect, useRef } from "react";

const HomeTypeFilter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [isHovered, setIsHovered] = useState(false);
  const [isResetHovered, setIsResetHovered] = useState(false);
  const [isDoneHovered, setIsDoneHovered] = useState(false);
  const [isDropdownHovered, setIsDropdownHovered] = useState(false);
  const [hoveredType, setHoveredType] = useState(null);
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

  const handleSelection = (key) => {
    setSelectedTypes((prev) =>
      prev.includes(key) ? prev.filter((type) => type !== key) : [...prev, key]
    );
  };

  const homeTypes = [
    {
      key: "House",
      label: "House",
      icon: (isSelected, isHovered) => (
        <svg
          style={{
            ...styles.icon,
            ...(isSelected || isHovered ? styles.hoverIcon : {}),
          }}
          viewBox="0 0 24 24"
        >
          <path d="M11.336 3.253a1 1 0 011.328 0l9 8a1 1 0 01-1.328 1.494L20 12.45V19a2 2 0 01-2 2H6a2 2 0 01-2-2v-6.55l-.336.297a1 1 0 01-1.328-1.494l9-8zM6 10.67V19h3v-5a1 1 0 011-1h4a1 1 0 011 1v5h3v-8.329l-6-5.333-6 5.333zM13 19v-4h-2v4h2z"></path>
        </svg>
      ),
    },
    {
      key: "Townhouse",
      label: "Townhouse",
      icon: (isSelected, isHovered) => (
        <svg
          style={{
            ...styles.icon,
            ...(isSelected || isHovered ? styles.hoverIcon : {}),
          }}
          viewBox="0 0 24 24"
        >
          <path d="M9 10a1 1 0 11-2 0 1 1 0 012 0zM9 14a1 1 0 11-2 0 1 1 0 012 0zM16 11a1 1 0 100-2 1 1 0 000 2zM16 15a1 1 0 100-2 1 1 0 000 2z"></path>
          <path d="M8.017 2a1 1 0 01.764.375L12 6.4l3.22-4.024a1 1 0 011.54-.026l6 7a1 1 0 01-1.52 1.302L21 10.37V20a2 2 0 01-2 2H5a2 2 0 01-2-2v-9.63l-.24.28a1 1 0 01-1.52-1.3l6-7A1 1 0 018.018 2zM5 8.037V20h2v-2a1 1 0 112 0v2h2V8.35L7.973 4.569 5 8.037zm8 .314V20h2v-2a1 1 0 112 0v2h2V8.037l-2.973-3.47L13 8.352z"></path>
        </svg>
      ),
    },
    {
      key: "Condo",
      label: "Condo",
      icon: (isSelected, isHovered) => (
        <svg
          style={{
            ...styles.icon,
            ...(isSelected || isHovered ? styles.hoverIcon : {}),
          }}
          viewBox="0 0 24 24"
        >
          <path d="M7 9a1 1 0 100 2h3a1 1 0 100-2H7zM7 13a1 1 0 100 2h3a1 1 0 100-2H7zM7 17a1 1 0 100 2h3a1 1 0 100-2H7z"></path>
          <path d="M4.683 1.548A2 2 0 002 3.428V21a2 2 0 002 2h16a2 2 0 002-2V11a2 2 0 00-2-2h-5V6.7a2 2 0 00-1.316-1.88l-9-3.272zM15 17v-2h2a1 1 0 100-2h-2v-2h5v10h-5v-2h2a1 1 0 100-2h-2zM13 6.7V21H4V3.428L13 6.7z"></path>
        </svg>
      ),
    },
    {
      key: "Land",
      label: "Land",
      icon: (isSelected, isHovered) => (
        <svg
          style={{
            ...styles.icon,
            ...(isSelected || isHovered ? styles.hoverIcon : {}),
          }}
          viewBox="0 0 24 24"
        >
          <path d="M11.282 15.602v-4.139l-2.75-2.75a.917.917 0 111.296-1.296l1.454 1.453V7.417a.917.917 0 011.833 0v4.203l1.454-1.453a.917.917 0 111.296 1.296l-2.75 2.75v1.389a6.418 6.418 0 00-.917-12.769 6.417 6.417 0 00-.916 12.769zm0 1.848a8.251 8.251 0 111.833 0v4.633a.917.917 0 11-1.833 0V17.45z"></path>
        </svg>
      ),
    },
    {
      key: "MultiFamily",
      label: "Multi-family",
      icon: (isSelected, isHovered) => (
        <svg
          style={{
            ...styles.icon,
            ...(isSelected || isHovered ? styles.hoverIcon : {}),
          }}
          viewBox="0 0 24 24"
        >
          <path d="M16 10a1 1 0 100 2 1 1 0 000-2zM15 15a1 1 0 112 0 1 1 0 01-2 0zM12 10a1 1 0 100 2 1 1 0 000-2zM7 11a1 1 0 112 0 1 1 0 01-2 0zM16 6a1 1 0 100 2 1 1 0 000-2zM11 7a1 1 0 112 0 1 1 0 01-2 0zM8 6a1 1 0 100 2 1 1 0 000-2z"></path>
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M2 3a1 1 0 011-1h18a1 1 0 110 2v16a2 2 0 01-2 2H5a2 2 0 01-2-2V4a1 1 0 01-1-1zm17 1v16h-6v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4H5V4h14zm-8 16H9v-4h2v4z"
          ></path>
        </svg>
      ),
    },
    {
      key: "Mobile",
      label: "Mobile",
      icon: (isSelected, isHovered) => (
        <svg
          style={{
            ...styles.icon,
            ...(isSelected || isHovered ? styles.hoverIcon : {}),
          }}
          viewBox="0 0 24 24"
        >
          <path d="M16.5 10a1.5 1.5 0 100 3 1.5 1.5 0 000-3z"></path>
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M13.968 3.75a1 1 0 00-1.382-1.161l-11 5A1 1 0 002 9.5V18a2 2 0 001 1.732V21a1 1 0 102 0v-1h7a2 2 0 104 0h1a2 2 0 103.983-.258A2 2 0 0022 18V9.5a1 1 0 00.414-1.91l-8.446-3.84zM20 18H4v-1h16v1zm0-9.31l-8-3.637-8 3.636V15h3v-4.5a1 1 0 011-1h4a1 1 0 011 1V15h7V8.69zM11 15v-3.5H9V15h2z"
          ></path>
        </svg>
      ),
    },
    {
      key: "Coop",
      label: "Co-op",
      icon: (isSelected, isHovered) => (
        <svg
          style={{
            ...styles.icon,
            ...(isSelected || isHovered ? styles.hoverIcon : {}),
          }}
          viewBox="0 0 24 24"
        >
          <path d="M11.875 20a.58.58 0 00.35-.15l8.2-8.2c.2-.2.346-.425.438-.675a2.174 2.174 0 000-1.513 1.657 1.657 0 00-.438-.637l-4.25-4.25a1.657 1.657 0 00-.637-.438 2.143 2.143 0 00-1.513 0c-.25.092-.475.238-.675.438l-.275.275 1.85 1.875c.25.233.433.5.55.8.117.3.175.617.175.95 0 .7-.237 1.287-.712 1.762-.475.475-1.063.713-1.763.713-.333 0-.654-.058-.962-.175a2.274 2.274 0 01-.813-.525L9.525 8.4 5.15 12.775a.473.473 0 00-.15.35c0 .133.05.254.15.362a.444.444 0 00.55.113.582.582 0 00.15-.1l3.4-3.4 1.4 1.4-3.375 3.4a.48.48 0 00-.15.35c0 .133.05.25.15.35.1.1.217.15.35.15a.582.582 0 00.35-.15l3.4-3.375 1.4 1.4-3.375 3.4a.297.297 0 00-.112.15.56.56 0 00-.038.2c0 .133.05.25.15.35a.48.48 0 00.7 0l3.4-3.375 1.4 1.4-3.4 3.4a.47.47 0 00-.15.35c0 .133.054.25.163.35.108.1.229.15.362.15zm-.025 2a2.436 2.436 0 01-1.637-.613 2.384 2.384 0 01-.838-1.537 2.465 2.465 0 01-1.425-.7 2.465 2.465 0 01-.7-1.425 2.373 2.373 0 01-1.412-.712A2.544 2.544 0 015.15 15.6a2.377 2.377 0 01-1.55-.825c-.4-.467-.6-1.017-.6-1.65 0-.333.063-.654.188-.963a2.42 2.42 0 01.537-.812l5.8-5.775L12.8 8.85c.033.05.083.087.15.112a.56.56 0 00.2.038c.15 0 .275-.046.375-.137a.47.47 0 00.15-.363.572.572 0 00-.037-.2.302.302 0 00-.113-.15L9.95 4.575a1.656 1.656 0 00-.638-.438 2.135 2.135 0 00-1.512 0c-.25.092-.475.238-.675.438L3.6 8.125c-.15.15-.275.325-.375.525-.1.2-.167.4-.2.6a1.885 1.885 0 00.2 1.2l-1.45 1.45a3.975 3.975 0 01-.625-1.263 3.925 3.925 0 01.2-2.75c.2-.441.475-.837.825-1.187L5.7 3.175c.4-.383.846-.675 1.338-.875a3.976 3.976 0 014.337.875l.275.275.275-.275c.4-.383.846-.675 1.337-.875.492-.2.996-.3 1.513-.3.517 0 1.021.1 1.513.3.491.2.929.492 1.312.875L21.825 7.4A4.074 4.074 0 0123 10.25c0 .517-.1 1.02-.3 1.512-.2.492-.492.93-.875 1.313l-8.2 8.175a2.591 2.591 0 01-.813.55c-.308.133-.629.2-.962.2z"></path>
        </svg>
      ),
    },
    {
      key: "Other",
      label: "Other",
      icon: (isSelected, isHovered) => (
        <svg
          style={{
            ...styles.icon,
            ...(isSelected || isHovered ? styles.hoverIcon : {}),
          }}
          viewBox="0 0 24 24"
        >
          <path d="M9 11v-1a1 1 0 112 0v1a1 1 0 11-2 0zM13 10v1a1 1 0 102 0v-1a1 1 0 10-2 0z"></path>
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M5 3a1 1 0 00-2 0v3.586A2 2 0 003.586 8L5 9.414v6.172L3.586 17A2 2 0 003 18.414V20a2 2 0 002 2h14a2 2 0 002-2v-1.586A2 2 0 0020.414 17L19 15.586V9.414L20.414 8A2 2 0 0021 6.586V3a1 1 0 10-2 0v1h-2V3a1 1 0 10-2 0v1h-2V3a1 1 0 10-2 0v1H9V3a1 1 0 00-2 0v1H5V3zm14 17v-1.586L17.586 17A2 2 0 0117 15.586V9.414A2 2 0 0117.586 8L19 6.586V6H5v.586L6.414 8A2 2 0 017 9.414v6.172A2 2 0 016.414 17L5 18.414V20h4v-3a3 3 0 116 0v3h4zm-8 0h2v-3a1 1 0 10-2 0v3z"
          ></path>
        </svg>
      ),
    },
  ];

  return (
    <div
      style={{ ...styles.filterContainer }}
      ref={dropdownRef}
      onMouseEnter={() => setIsDropdownHovered(true)}
      onMouseLeave={() => setIsDropdownHovered(false)}
    >
      {/* ปุ่มเปิด Dropdown */}
      <button
        style={{
          ...styles.DropdownButton,
          ...(isHovered || isDropdownHovered ? styles.DropdownButtonHover : {}),
        }}
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        Home Types
        <svg
          style={{
            ...styles.svgIcon,
            fill: isHovered || isDropdownHovered ? "#00828C" : "#585858",
          }}
          viewBox="0 0 24 24"
        >
          <path d="M15.932 10a.5.5 0 01.385.82l-3.933 4.72a.5.5 0 01-.768 0l-3.933-4.72a.5.5 0 01.385-.82h7.864z"></path>
        </svg>
      </button>
      {/* Dropdown */}
      {isOpen && (
        <div style={styles.dropdown}>
          <div style={styles.gridContainer}>
            {homeTypes.map((item) => (
              <div
                key={item.key}
                style={{
                  ...styles.item,
                  ...(selectedTypes.includes(item.key)
                    ? styles.selectedItem
                    : {}),
                  ...(hoveredType === item.key ? styles.selectedItem : {}),
                }}
                onClick={() => handleSelection(item.key)}
                onMouseEnter={() => setHoveredType(item.key)}
                onMouseLeave={() => setHoveredType(null)}
              >
                {item.icon(
                  selectedTypes.includes(item.key),
                  hoveredType === item.key
                )}
                <span
                  style={{
                    ...styles.label,
                    ...(selectedTypes.includes(item.key)
                      ? styles.selectedLabel
                      : {}),
                    ...(hoveredType === item.key ? styles.selectedLabel : {}),
                  }}
                >
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          <div style={styles.buttonRow}>
            <button
              style={{
                ...styles.resetButton,
                ...(isResetHovered
                  ? { backgroundColor: "rgba(21, 114, 122, 0.2)" }
                  : {}),
              }}
              onClick={() => setSelectedTypes([])}
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
  },
  DropdownButtonHover: {
    backgroundColor: "#f1f1f1",
    borderColor: "#00828C",
    color: "#00828C",
  },
  dropdown: {
    position: "absolute",
    background: "white",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    borderRadius: "12px",
    marginTop: "8px",
    width: "max-content",
    padding: "20px",
    zIndex: 1000,
    border: "1px solid #ccc",
  },
  gridContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "10px",
    paddingBottom: "12px",
  },
  item: {
    textAlign: "center",
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #ddd",
    backgroundColor: "#fff",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
  },
  selectedItem: {
    backgroundColor: "rgba(21, 114, 122, 0.2)",
    fontWeight: "bold",
    border: "1px solid #15727A",
  },
  label: {
    fontSize: "14px",
    fontWeight: 500,
  },
  selectedLabel: {
    color: "#00828C",
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
  svgIcon: {
    width: "24px",
    height: "24px",
  },

  icon: {
    width: "32px",
    height: "32px",
    fill: "#131313",
  },
  hoverIcon: {
    fill: "#00828C",
  },
};

export default HomeTypeFilter;
