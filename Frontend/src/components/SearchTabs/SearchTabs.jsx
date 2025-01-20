import React from 'react';
import './SearchTabs.css';

const SearchTab = () => {
  return (
    <div className="search-tab">
      <div className="overlay">
        <h1 className="hero-title">Find the right home <br /> at the right price</h1>
        <div className="tabs">
          <a href="#" className="tab active">Buy</a>
          <a href="#" className="tab">Rent</a>
          <a href="#" className="tab">Sell</a>
          <a href="#" className="tab">Mortgage</a>
          <a href="#" className="tab">Home Estimate</a>
        </div>
        <div className="search-bar">
          <input
            type="text"
            className="search-input"
            placeholder="City, Address, School, Agent, ZIP"
          />
          <button className="search-button">
            <svg className="search-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M23.884 21.763l-7.554-7.554a8.976 8.976 0 001.526-6.835C17.203 3.68 14.204.72 10.502.122a9.01 9.01 0 00-10.38 10.38c.598 3.702 3.558 6.7 7.252 7.354a8.976 8.976 0 006.835-1.526l7.554 7.554a.25.25 0 00.353 0l1.768-1.768a.25.25 0 000-.353zM2 9c0-3.86 3.14-7 7-7s7 3.14 7 7-3.14 7-7 7-7-3.14-7-7z" fill="#ffffff"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchTab;
