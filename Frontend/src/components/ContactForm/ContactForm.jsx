import React from 'react';
import './ContactForm.css';

const ContactForm = () => {
    return (
        <div className="contact-form-container">
            <div className="form-header">
                <h2>Talk to a Redfin agent</h2>
                <p>You’ll be connected with an expert local agent—there’s no pressure or obligation.</p>
            </div>
            <form className="contact-form">
                <div className="contact-form-group">
                    <label htmlFor="location">Where are you searching for homes? *</label>
                    <div className="contact-search-box">
                        <input type="text" id="location" placeholder="City, Address, ZIP" required />
                        <button type="button" className="contact-search-button">
                            {/* <span role="img" aria-label="search">🔍</span> */}
                        </button>
                    </div>
                </div>
                <div className="contact-form-group">
                    <label htmlFor="email">Email *</label>
                    <input type="email" id="email" placeholder="redfin@redfin.com" required />
                </div>
                <div className="contact-form-group">
                    <label htmlFor="phone">Phone *</label>
                    <input type="tel" id="phone" placeholder="( ) -" required />
                </div>
                <div className="contact-form-group">
                    <label htmlFor="message">What can we help you with? *</label>
                    <textarea id="message" placeholder="I'm interested in buying, selling or a free consult with a Redfin agent." required></textarea>
                </div>
                <button type="submit" className="contact-submit-button">Submit</button>
                <p className="contact-form-footer">
                    You are creating a Redfin account and agree to our <a href="#">Terms of Use</a> and <a href="#">Privacy Policy</a>.
                </p>
            </form>
        </div>
    );
};

export default ContactForm;
