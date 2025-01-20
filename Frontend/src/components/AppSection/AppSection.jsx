// AppSection.jsx
import React from 'react';
import './AppSection.css';

const AppSection = () => {
    return (
        <div className="app-section">

            
            <div className="app-download">
                <div className="text-content">
                    <h2>Get the Redfin app</h2>
                    <p>
                        Download our top-rated real estate app for iOS or Android to get alerts
                        the moment your dream home hits the market.
                    </p>
                </div>
                <div className="qr-content">
                    <img src="https://ssl.cdn-redfin.com/v554.4.0/images/homepage/banners/download.jpg" alt="QR code to download the app" className="qr-code" />
                </div>
            </div>

            
            <div className="tour-section">
                <div className="tour-image">
                    <img src="https://ssl.cdn-redfin.com/cop-assets/prod/hpwidget/tour_updated.jpg" alt="People touring a house" />
                </div>
                <div className="tour-content">
                    <h2>Start touring homes, no strings attached</h2>
                    <p>
                        Unlike many other agents, Redfin agents won’t ask you to sign an
                        exclusive commitment before they’ll take you on a first tour.
                    </p>
                    <button className="search-button">Search for homes</button>
                </div>
            </div>
        </div>
    );
};

export default AppSection;
