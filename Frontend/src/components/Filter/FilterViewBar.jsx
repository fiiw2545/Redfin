import React, { useState } from "react";
import { useGlobalEvent } from "../../context/GlobalEventContext";

import StatusFilter from "./StatusFilter";
import PriceFilter from "./PriceFilter";
import BedsBathsFilter from "./BedsBathsFilter";
import HomeTypeFilter from "./HomeTypeFilter";
import ViewOption from "../ViewOption/ViewOption";

const FilterViewBar = ({ setViewOption }) => {
  const { windowSize } = useGlobalEvent();
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isHoveredAllFilters, setIsHoveredAllFilters] = useState(false);
  const [isHoveredSaveSearch, setIsHoveredSaveSearch] = useState(false);

  const toggleDropdown = (filterName) => {
    setActiveDropdown((prev) => (prev === filterName ? null : filterName));
  };

  const shouldShowFilter = (filterName) => {
    if (windowSize.width <= 400 && filterName === "StatusFilter") return false;
    if (windowSize.width <= 800 && filterName === "PriceFilter") return false;
    if (windowSize.width <= 900 && filterName === "BedsBathsFilter")
      return false;
    if (windowSize.width <= 1000 && filterName === "HomeTypeFilter")
      return false;
    return true;
  };

  const isSize500 = windowSize.width <= 500;

  return (
    <div
      style={{
        ...styles.filterContainer,
        flexDirection: isSize500 ? "column" : "row",
        alignItems: isSize500 ? "flex-start" : "center",
      }}
    >
      {/* Group Filter Buttons */}
      <div
        style={{
          ...styles.filterGroup,
          alignSelf: isSize500 ? "flex-start" : "center",
        }}
      >
        {shouldShowFilter("TypeFilter") && (
          <StatusFilter
            isOpen={activeDropdown === "TypeFilter"}
            onToggle={() => toggleDropdown("TypeFilter")}
          />
        )}
        {shouldShowFilter("PriceFilter") && (
          <PriceFilter
            isOpen={activeDropdown === "PriceFilter"}
            onToggle={() => toggleDropdown("PriceFilter")}
          />
        )}
        {shouldShowFilter("BedsBathsFilter") && (
          <BedsBathsFilter
            isOpen={activeDropdown === "BedsBathsFilter"}
            onToggle={() => toggleDropdown("BedsBathsFilter")}
          />
        )}
        {shouldShowFilter("HomeTypeFilter") && (
          <HomeTypeFilter
            isOpen={activeDropdown === "HomeTypeFilter"}
            onToggle={() => toggleDropdown("HomeTypeFilter")}
          />
        )}
        <button
          style={{
            ...styles.button,
            ...(isHoveredAllFilters ? styles.buttonHover : {}),
          }}
          onMouseEnter={() => setIsHoveredAllFilters(true)}
          onMouseLeave={() => setIsHoveredAllFilters(false)}
        >
          <svg
            style={{
              ...styles.svgIcon,
              fill: isHoveredAllFilters ? "#00828C" : "#585858",
            }}
            viewBox="0 0 24 24"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M5.145 9H3a1 1 0 010-2h2.145a3.502 3.502 0 016.71 0H21a1 1 0 110 2h-9.145a3.502 3.502 0 01-6.71 0zM7 8a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM2 16a1 1 0 011-1h9.145a3.502 3.502 0 016.71 0H21a1 1 0 110 2h-2.145a3.502 3.502 0 01-6.71 0H3a1 1 0 01-1-1zm13.5-1.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3z"
            ></path>
          </svg>
          All Filters
        </button>

        <button
          style={{
            ...styles.savebutton,
            ...(isHoveredSaveSearch ? styles.savebuttonHover : {}),
          }}
          onMouseEnter={() => setIsHoveredSaveSearch(true)}
          onMouseLeave={() => setIsHoveredSaveSearch(false)}
        >
          Save Search
        </button>
      </div>

      {/* ViewOption จะย้ายลงล่างแต่ยังชิดขวา */}
      <div
        style={{
          ...styles.viewOptionContainer,
          alignSelf: isSize500 ? "flex-end" : "center",
          width: isSize500 ? "100%" : "auto",
        }}
      >
        <ViewOption onSelect={setViewOption} />
      </div>
    </div>
  );
};

const styles = {
  filterContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "8px",
    padding: "16px",
    backgroundColor: "white",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    width: "100%",
  },
  filterGroup: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
  },
  viewOptionContainer: {
    display: "flex",
    justifyContent: "flex-end",
  },
  button: {
    padding: "8px 12px 8px 8px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    backgroundColor: "white",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    fontSize: "14px",
    fontFamily:
      "Inter,-apple-system,BlinkMacSystemFont,Roboto,Droid Sans,Helvetica,Arial,sans-serif",
    fontWeight: "500",
    color: "#585858",
    borderColor: "#585858",
    whiteSpace: "nowrap",
    lineHeight: "1.5",
    height: "43px",
  },
  buttonHover: {
    backgroundColor: "#f1f1f1",
    borderColor: "#00828C",
    color: "#00828C",
  },
  svgIcon: {
    width: "20px",
    height: "20px",
    marginRight: "4px",
  },

  savebutton: {
    padding: "8px 12px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    backgroundColor: "#c82021",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    fontSize: "14px",
    fontFamily:
      '"Libre Franklin",-apple-system,BlinkMacSystemFont,Roboto,Droid Sans,Helvetica,Arial,sans-serif',
    fontWeight: "700",
    color: "#fff",
    borderColor: "#c82021",
    whiteSpace: "nowrap",
    lineHeight: "1.5",
    height: "43px",
  },
  savebuttonHover: {
    backgroundColor: "#d55656",
    borderColor: "#d55656",
    color: "#fff",
  },
};
export default FilterViewBar;
