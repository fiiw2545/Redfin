import React from "react";
import Navbar from "../components/Navbar/Navbar";
import houseNearMeImage from "../img/housenearme.png";
import Footer from "../components/Footer/Footer";
const Buy = () => {
  return (
    <>
      <Navbar />
      <div className="houses-for-sale">
        <div className="houses-for-sale__top">
          <div className="houses-for-sale__content">
            <h1>Houses for sale near me</h1>
            <p>
              Find houses for sale near you. View photos, open house
              information, and property details for nearby real estate.
            </p>
          </div>
          <div className="houses-for-sale__image">
            <img src={houseNearMeImage} alt="House Illustration" />
          </div>
        </div>

        <div className="houses-for-sale__form">
          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input
              type="text"
              id="location"
              placeholder="City, Address, School, Agent, ZIP"
            />
          </div>

          <div className="form-group">
            <label htmlFor="price-range">Price range</label>
            <div className="price-group">
              <select id="price-min">
                <option>No min</option>
                <option>$50k</option>
                <option>$100k</option>
              </select>
              <select id="price-max">
                <option>No max</option>
                <option>$9M</option>
                <option>$10M</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <button>Search</button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Buy;
