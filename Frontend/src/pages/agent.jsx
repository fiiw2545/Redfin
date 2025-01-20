import React, { useState } from 'react';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import NavbarSub from '../components/NavbarSub/NavbarSub';
const Agent = () => {
    return (
        <>
            <Navbar />
            <NavbarSub/>
            <div className="agent-container">
                <h1 className="agent-header">
                Work with the best agents in your neighborhood
                </h1>
                <p className="agent-description">
                Redfin agents are among the most experienced in the industry, so we know how to help you win in today's market.
                </p>
                <div className="agent-search-box">
                    <input
                        type="text"
                        placeholder="Find an agent in your area"
                        className="agent-input"
                    />
                    <button className="agent-button">
                        Search
                    </button>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Agent;