import React from "react";
import "./SearchSection.css";
import houseImage from "../../img/house-image.png"; // Import your house illustration

const SearchSection = () => {
  return (
    <div className="search-section">
      <div className="search-content">
        <h1 className="search-title">Houses for sale near me</h1>
        <p className="search-subtitle">
          Find houses for sale near you. View photos, open house information,
          and property details for nearby real estate.
        </p>
        <form className="search-form">
          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input
              type="text"
              id="location"
              className="form-control"
              placeholder="City, Address, School, Agent, ZIP"
            />
          </div>
          <div className="form-group">
            <label htmlFor="price-range">Price range</label>
            <div className="price-range-group">
              <select id="price-min" className="form-control">
                <option>No min</option>
                <option>$50,000</option>
                <option>$100,000</option>
                <option>$200,000</option>
              </select>
              <select id="price-max" className="form-control">
                <option>No max</option>
                <option>$500,000</option>
                <option>$1,000,000</option>
                <option>$2,000,000</option>
              </select>
            </div>
          </div>
          <button type="submit" className="btn btn-danger search-button">
            Search
          </button>
        </form>
      </div>
      <div className="search-image">
        <img src={houseImage} alt="House illustration" />
      </div>
    </div>
  );
};

export default SearchSection;
