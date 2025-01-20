import React from 'react';
import './NavbarSub.css';

const NavbarSub = () => {
    return (
        <div className="navbar-sub">
            <ul>
                <li><a href="#">Our Mission</a></li>
                <li><a href="#">Our Agents</a></li>
                <li><a href="#">Buy With Redfin</a></li>
                <li><a href="#">Sell With Redfin</a></li>
                <li><a href="#">Concierge Service</a></li>
            </ul>
            <div className='Button'>
                Talk to a Redfin agent
            </div>
        </div>
    );
};

export default NavbarSub;
