import React from 'react';
import './styles/houses-for-sale.css';
import Navbar from '../components/Navbar/Navbar';
import houseNearMeImage from '../img/housenearme.png';
import PropertyCard from '../helpers/Cards/PropertyCard';
import propertyData from '../data/properties';
import Slider from "react-slick";
import Footer from '../components/Footer/Footer';

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const HousesForSale = () => {
  const settings = {
    infinite: true,
    speed: 300,
    slidesToShow: 4,  // จำนวนการ์ดที่จะแสดงเมื่อหน้าจอกว้าง
    slidesToScroll: 1,
    centerMode: false,
    prevArrow: (
      <div className="CarouselArrow CarouselArrow--prev clickable" role="button" aria-label="prev" tabIndex="0">
        <svg className="SvgIcon breadcrumb size-tiny">
          <svg viewBox="0 0 8 12">
            <path d="M6.786 0.079l1.135 1.135a.268.268 0 010 .379L3.514 5.81 7.929 10.214a.268.268 0 010 .38L6.786 11.92a.268.268 0 01-.379 0L.675 5.81a.268.268 0 010-.38L6.407 0.08a.268.268 0 01.38 0z" fill-rule="evenodd"></path>
          </svg>
        </svg>
      </div>
    ),
    nextArrow: (
      <div className="CarouselArrow CarouselArrow--next clickable" role="button" aria-label="next" tabIndex="0">
        <svg className="SvgIcon breadcrumb size-tiny">
          <svg viewBox="0 0 8 12">
            <path d="M1.214 11.921L.079 10.786a.268.268 0 010-.379L4.486 6 .079 1.593a.268.268 0 010-.38L1.214.08a.268.268 0 01.379 0L7.325 5.81a.268.268 0 010 .38L1.593 11.92a.268.268 0 01-.38 0" fill-rule="evenodd"></path>
          </svg>
        </svg>
      </div>
    ),
    responsive: [
      {
        breakpoint: 1450,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1449,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1120,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 815,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  return (
    <>
      <Navbar />
      <div className="houses-for-sale">
        <div className="houses-for-sale__top">
          <div className="houses-for-sale__content">
            <h1>Houses for sale near me</h1>
            <p>
              Find houses for sale near you. View photos, open house information, and property details for nearby real estate.
            </p>
          </div>
          <div className="houses-for-sale__image">
            <img src={houseNearMeImage} alt="House Illustration" />
          </div>
        </div>

        <div className="houses-for-sale__form">
          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input type="text" id="location" placeholder="City, Address, School, Agent, ZIP" />
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

export default HousesForSale;
