import React, { useState, useEffect } from "react";
import { useGlobalEvent } from "../../context/GlobalEventContext";
import StatusFilter from "./StatusFilter";
import PriceFilter from "./PriceFilter";
import BedsBathsFilter from "./BedsBathsFilter";
import HomeTypeFilter from "./HomeTypeFilter";
import ViewOption from "../ViewOption/ViewOption";
import axios from "axios";

const FilterViewBar = ({ setViewOption }) => {
  const { windowSize } = useGlobalEvent();
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isHoveredAllFilters, setIsHoveredAllFilters] = useState(false);
  const [isHoveredSaveSearch, setIsHoveredSaveSearch] = useState(false);
  const [homes, setHomes] = useState([]);
  const [filters, setFilters] = useState({
    status: {
      selectedFilter: "For sale",
      subFilters: {
        comingSoon: true,
        active: true,
        underContract: false,
      },
      soldTimeframe: "Last 3 months",
    },
    price: {
      min: 50000,
      max: 10000000,
    },
    bedsBaths: {
      beds: "Any",
      baths: "Any",
    },
    homeType: [],
  });

  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleBedsBathsChange = (value) => {
    console.log("ค่าที่ได้รับจาก BedsBathsFilter:", value);

    // รวมค่าของ beds และ baths เข้าด้วยกัน
    const combinedValue = {
      beds: value.beds.join(", "), // รวม beds ที่เป็นอาร์เรย์เป็นสตริง
      baths: value.baths, // baths ไว้เหมือนเดิม
    };

    setFilters((prevFilters) => ({
      ...prevFilters,
      bedsBaths: combinedValue, // อัพเดตค่า bedsBaths ให้รวมกัน
    }));
  };

  const handlePriceChange = (value) => {
    console.log("ค่าที่ได้รับจาก PriceFilter:", value);
    setFilters((prevFilters) => ({
      ...prevFilters,
      price: value,
    }));
  };

  const handleHomeTypeChange = (value) => {
    console.log("ค่าที่ได้รับจาก HomeTypeFilter:", value);
    setFilters((prevFilters) => ({
      ...prevFilters,
      homeType: value,
    }));
  };

  const handleStatusChange = (value) => {
    console.log("ค่าที่ได้รับจาก StatusFilter:", value);
    setFilters((prevFilters) => ({
      ...prevFilters,
      status: value,
    }));
  };

  const searchHomes = async () => {
    try {
      setIsLoading(true);

      const queryParams = new URLSearchParams();

      // ส่งค่าของ status (For Sale, Sold, ฯลฯ)
      queryParams.append("status", filters.status.selectedFilter);

      // ส่งค่าของ subFilters (comingSoon, active, underContract)
      queryParams.append("comingSoon", filters.status.subFilters.comingSoon);
      queryParams.append("active", filters.status.subFilters.active);
      queryParams.append(
        "underContract",
        filters.status.subFilters.underContract
      );

      // ส่งค่าของราคา
      queryParams.append("minPrice", filters.price.min);
      queryParams.append("maxPrice", filters.price.max);

      // ส่งค่าของ beds และ baths
      if (filters.bedsBaths.beds && filters.bedsBaths.beds !== "Any") {
        queryParams.append("beds", filters.bedsBaths.beds);
      }
      if (filters.bedsBaths.baths && filters.bedsBaths.baths !== "Any") {
        queryParams.append("baths", filters.bedsBaths.baths);
      }

      // ส่งค่าของ homeType
      if (filters.homeType && filters.homeType.length > 0) {
        queryParams.append("homeTypes", filters.homeType.join(","));
      }

      const queryString = queryParams.toString();
      console.log(
        `Calling API: http://localhost:5000/api/homes/search?${queryString}`
      );

      const response = await axios.get(
        `http://localhost:5000/api/homes/search?${queryString}`
      );

      if (response.data && response.data.length > 0) {
        console.log("Homes found:", response.data);
        setSearchResults(response.data);
      } else {
        console.log("No homes found for the selected filters.");
        setSearchResults([]);
      }

      // Save filters to localStorage
      localStorage.setItem("savedSearch", JSON.stringify(filters));
    } catch (error) {
      console.error("Error searching homes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSearch = async () => {
    await searchHomes(); // เรียก API ค้นหาบ้านตามตัวกรอง
  };

  useEffect(() => {
    const savedSearch = localStorage.getItem("savedSearch");
    if (savedSearch) {
      setFilters(JSON.parse(savedSearch));
    }
  }, []);

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
      <div
        style={{
          ...styles.filterGroup,
          alignSelf: isSize500 ? "flex-start" : "center",
        }}
      >
        {shouldShowFilter("StatusFilter") && (
          <StatusFilter value={filters.status} onChange={handleStatusChange} />
        )}
        {shouldShowFilter("PriceFilter") && (
          <PriceFilter value={filters.price} onChange={handlePriceChange} />
        )}
        {shouldShowFilter("BedsBathsFilter") && (
          <BedsBathsFilter
            value={filters.bedsBaths}
            onChange={handleBedsBathsChange}
          />
        )}
        {shouldShowFilter("HomeTypeFilter") && (
          <HomeTypeFilter
            value={filters.homeType}
            onChange={handleHomeTypeChange}
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
          onClick={handleSaveSearch}
          disabled={isLoading}
        >
          {isLoading ? "Searching..." : "Save Search"}
        </button>
      </div>

      <div
        style={{
          ...styles.viewOptionContainer,
          alignSelf: isSize500 ? "flex-end" : "center",
          width: isSize500 ? "100%" : "auto",
        }}
      >
        <ViewOption onSelect={setViewOption} />
      </div>

      {searchResults.length > 0 && (
        <div style={styles.resultsContainer}>
          Found {searchResults.length} homes matching your criteria
        </div>
      )}
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
  resultsContainer: {
    marginTop: "16px",
    padding: "8px",
    backgroundColor: "#f0f0f0",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "500",
  },
};
export default FilterViewBar;
