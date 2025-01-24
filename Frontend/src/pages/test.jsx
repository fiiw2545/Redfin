import React, { useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import "./styles/test.css";
import NavbarUser from "../components/NavbarUser/NavbarUser";
const Test = () => {
  const [selectedFilter, setSelectedFilter] = useState("For sale"); // Default filter
  const [showDropdown, setShowDropdown] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    forSale: true,
    sold: false,
  });
  const [subFilters, setSubFilters] = useState({
    comingSoon: true,
    active: true,
    underContract: false,
  });
  const [soldTimeframe, setSoldTimeframe] = useState("Last 1 week"); // Default timeframe for "Sold"

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
  };

  const handleSubFilterChange = (key) => {
    setSubFilters((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <>
      <Navbar />
      <NavbarUser />
      <div className="filters-container">
        {/* Main Dropdown */}
        <div className="dropdown-wrapper">
          <button className="filters-dropdown" onClick={toggleDropdown}>
            {selectedFilter} ▾
          </button>
          {showDropdown && (
            <div className="dropdown-menu">
              {/* For Sale Section */}
              <div>
                <div className="section-header">
                  <input
                    type="radio"
                    id="forSale"
                    name="filter"
                    checked={selectedFilter === "For sale"}
                    onChange={() => handleFilterChange("For sale")}
                  />
                  <label htmlFor="forSale">For sale</label>
                  <span
                    className="toggle-arrow"
                    onClick={() => toggleSection("forSale")}
                  >
                    ▾
                  </span>
                </div>
                {expandedSections.forSale && (
                  <div className="subcategory-options">
                    <div>
                      <input
                        type="checkbox"
                        id="comingSoon"
                        checked={subFilters.comingSoon}
                        onChange={() => handleSubFilterChange("comingSoon")}
                      />
                      <label htmlFor="comingSoon">Coming soon</label>
                    </div>
                    <div>
                      <input
                        type="checkbox"
                        id="active"
                        checked={subFilters.active}
                        onChange={() => handleSubFilterChange("active")}
                      />
                      <label htmlFor="active">Active</label>
                    </div>
                    <div>
                      <input
                        type="checkbox"
                        id="underContract"
                        checked={subFilters.underContract}
                        onChange={() => handleSubFilterChange("underContract")}
                      />
                      <label htmlFor="underContract">
                        Under contract/pending
                      </label>
                    </div>
                  </div>
                )}
              </div>

              {/* For Rent Section */}
              <div>
                <input
                  type="radio"
                  id="forRent"
                  name="filter"
                  checked={selectedFilter === "For rent"}
                  onChange={() => handleFilterChange("For rent")}
                />
                <label htmlFor="forRent">For rent</label>
              </div>

              {/* Sold Section */}
              <div>
                <div className="section-header">
                  <input
                    type="radio"
                    id="sold"
                    name="filter"
                    checked={selectedFilter === "Sold"}
                    onChange={() => handleFilterChange("Sold")}
                  />
                  <label htmlFor="sold">Sold</label>
                  <span
                    className="toggle-arrow"
                    onClick={() => toggleSection("sold")}
                  >
                    ▾
                  </span>
                </div>
                {expandedSections.sold && (
                  <div className="subcategory-options">
                    <div>
                      <input
                        type="radio"
                        id="last1Week"
                        name="soldTimeframe"
                        checked={soldTimeframe === "Last 1 week"}
                        onChange={() => setSoldTimeframe("Last 1 week")}
                      />
                      <label htmlFor="last1Week">Last 1 week</label>
                    </div>
                    <div>
                      <input
                        type="radio"
                        id="last1Month"
                        name="soldTimeframe"
                        checked={soldTimeframe === "Last 1 month"}
                        onChange={() => setSoldTimeframe("Last 1 month")}
                      />
                      <label htmlFor="last1Month">Last 1 month</label>
                    </div>
                    <div>
                      <input
                        type="radio"
                        id="last6Months"
                        name="soldTimeframe"
                        checked={soldTimeframe === "Last 6 months"}
                        onChange={() => setSoldTimeframe("Last 6 months")}
                      />
                      <label htmlFor="last6Months">Last 6 months</label>
                    </div>
                    <div>
                      <input
                        type="radio"
                        id="last1Year"
                        name="soldTimeframe"
                        checked={soldTimeframe === "Last 1 year"}
                        onChange={() => setSoldTimeframe("Last 1 year")}
                      />
                      <label htmlFor="last1Year">Last 1 year</label>
                    </div>
                    <div>
                      <input
                        type="radio"
                        id="last3Years"
                        name="soldTimeframe"
                        checked={soldTimeframe === "Last 3 years"}
                        onChange={() => setSoldTimeframe("Last 3 years")}
                      />
                      <label htmlFor="last3Years">Last 3 years</label>
                    </div>
                  </div>
                )}
              </div>

              {/* Done Button */}
              <button className="done-button" onClick={toggleDropdown}>
                Done
              </button>
            </div>
          )}
        </div>

        {/* Other Buttons */}
        <button className="filters-button">All filters</button>
        <button className="save-search-button">Save search</button>
      </div>
    </>
  );
};

export default Test;
