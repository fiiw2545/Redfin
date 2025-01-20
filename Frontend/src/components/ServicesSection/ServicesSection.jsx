import React from 'react';
import './ServicesSection.css';
import { Link } from 'react-router-dom';
const ServicesSection = () => {
  return (
    <div className="services-section">
      <div className="service-card">
        <img
          // src="https://via.placeholder.com/128x128?text=128x128"
          src="https://ssl.cdn-redfin.com/cop-assets/prod/hpwidget/redfinagent.png"
          alt="Buy"
          className="service-icon"
        />
        <h3>Buy</h3>
        <p>
          Redfin agents are among the most experienced in the industry and can
          help you win in today’s market.
        </p>
        <Link to="/Agent">
          <button className="service-button">Find an agent</button>
        </Link>
      </div>
      <div className="service-card">
        <img
          // src="https://via.placeholder.com/128x128?text=128x128"
          src="https://ssl.cdn-redfin.com/cop-assets/prod/hpwidget/Sell.png"
          alt="Sell"
          className="service-icon"
        />
        <h3>Sell</h3>
        <p>
          We know how to price, market, and sell your home for top dollar. And
          we do it all for half the listing fee others often charge.
        </p>
        <button className="service-button">Learn more</button>
      </div>
      <div className="service-card">
        <img
          // src="https://via.placeholder.com/128x128?text=128x128"
          src="https://ssl.cdn-redfin.com/cop-assets/prod/hpwidget/Rent.png"
          alt="Rent"
          className="service-icon"
        />
        <h3>Rent</h3>
        <p>
          Whether you’re searching for apartments, condos, or rental homes, we
          make it easy to find a place you’ll love.
        </p>
        <button className="service-button">Explore rentals</button>
      </div>
    </div>
  );
};

export default ServicesSection;
