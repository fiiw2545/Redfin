import React, { useState } from 'react';
import './SearchLinksSection.css';

const cities = [
    { name: "Albuquerque real estate", url: "#" },
    { name: "Alexandria real estate", url: "#" },
    { name: "Anchorage real estate", url: "#" },
    { name: "Arlington real estate", url: "#" },
    { name: "Ashburn real estate", url: "#" },
    { name: "Atlanta real estate", url: "#" },
    { name: "Aurora real estate", url: "#" },
    { name: "Austin real estate", url: "#" },
    { name: "Bakersfield real estate", url: "#" },
    { name: "Baltimore real estate", url: "#" },
    { name: "Baton Rouge real estate", url: "#" },
    { name: "Beaverton real estate", url: "#" },
    { name: "Bend real estate", url: "#" },
    { name: "Birmingham real estate", url: "#" },
    { name: "Boca Raton real estate", url: "#" },
    { name: "Boise real estate", url: "#" },
    { name: "Boston real estate", url: "#" },
    { name: "Boulder real estate", url: "#" },
    { name: "Bowie real estate", url: "#" },
    { name: "Brentwood real estate", url: "#" },
    { name: "Buffalo real estate", url: "#" },
    { name: "Burlington real estate", url: "#" },
    { name: "Cape Coral real estate", url: "#" },
    { name: "Chandler real estate", url: "#" },
    { name: "Charleston real estate", url: "#" },
    { name: "Charlotte real estate", url: "#" },
    { name: "Chattanooga real estate", url: "#" },
    { name: "Chicago real estate", url: "#" },
    { name: "Cincinnati real estate", url: "#" },
    { name: "Colorado Springs real estate", url: "#" },
    { name: "Columbia real estate", url: "#" },
    { name: "Columbus real estate", url: "#" },
    { name: "Dallas real estate", url: "#" },
    { name: "Denver real estate", url: "#" },
    { name: "Des Moines real estate", url: "#" },
    { name: "Detroit real estate", url: "#" },
    { name: "El Paso real estate", url: "#" },
    { name: "Elk Grove real estate", url: "#" },
    { name: "Eugene real estate", url: "#" },
    { name: "Fairfax real estate", url: "#" },
    { name: "Flagstaff real estate", url: "#" },
    { name: "Fort Collins real estate", url: "#" },
    { name: "Fort Lauderdale real estate", url: "#" },
    { name: "Fort Myers real estate", url: "#" },
    { name: "Fort Worth real estate", url: "#" },
    { name: "Frederick real estate", url: "#" },
    { name: "Fremont real estate", url: "#" },
    { name: "Fresno real estate", url: "#" },
    { name: "Frisco real estate", url: "#" },
    { name: "Gilbert real estate", url: "#" },
    { name: "Glenview real estate", url: "#" },
    { name: "Henderson real estate", url: "#" },
    { name: "Honolulu real estate", url: "#" },
    { name: "Houston real estate", url: "#" },
    { name: "Indianapolis real estate", url: "#" },
    { name: "Irvine real estate", url: "#" },
    { name: "Jacksonville real estate", url: "#" },
    { name: "Jersey City real estate", url: "#" },
    { name: "Kansas City real estate", url: "#" },
    { name: "Knoxville real estate", url: "#" },
    { name: "Lake Tahoe real estate", url: "#" },
    { name: "Las Vegas real estate", url: "#" },
    { name: "Little Rock real estate", url: "#" },
    { name: "Long Island real estate", url: "#" },
    { name: "Los Angeles real estate", url: "#" },
    { name: "Louisville real estate", url: "#" },
    { name: "Madison real estate", url: "#" },
    { name: "Manhattan real estate", url: "#" },
    { name: "Manteca real estate", url: "#" },
    { name: "Memphis real estate", url: "#" },
    { name: "Mesa real estate", url: "#" },
    { name: "Miami real estate", url: "#" },
    { name: "Milwaukee real estate", url: "#" },
    { name: "Minneapolis real estate", url: "#" },
    { name: "Modesto real estate", url: "#" },
    { name: "Myrtle Beach real estate", url: "#" },
    { name: "Naperville real estate", url: "#" },
    { name: "Naples real estate", url: "#" },
    { name: "Nashua real estate", url: "#" },
    { name: "Nashville real estate", url: "#" },
    { name: "New Orleans real estate", url: "#" },
    { name: "New York real estate", url: "#" },
    { name: "Newton real estate", url: "#" },
    { name: "Oakland real estate", url: "#" },
    { name: "Oklahoma City real estate", url: "#" },
    { name: "Omaha real estate", url: "#" },
    { name: "Orland Park real estate", url: "#" },
    { name: "Orlando real estate", url: "#" },
    { name: "Palm Springs real estate", url: "#" },
    { name: "Philadelphia real estate", url: "#" },
    { name: "Phoenix real estate", url: "#" },
    { name: "Pittsburgh real estate", url: "#" },
    { name: "Plainfield real estate", url: "#" },
    { name: "Plano real estate", url: "#" },
    { name: "Portland real estate", url: "#" },
    { name: "Providence real estate", url: "#" },
    { name: "Quincy real estate", url: "#" },
    { name: "Raleigh real estate", url: "#" },
    { name: "Rancho Cucamonga real estate", url: "#" },
    { name: "Reno real estate", url: "#" },
    { name: "Richmond real estate", url: "#" },
    { name: "Riverside real estate", url: "#" },
    { name: "Rochester real estate", url: "#" },
    { name: "Sacramento real estate", url: "#" },
    { name: "Salem real estate", url: "#" },
    { name: "Salt Lake City real estate", url: "#" },
    { name: "San Antonio real estate", url: "#" },
    { name: "San Diego real estate", url: "#" },
    { name: "San Francisco real estate", url: "#" },
    { name: "San Jose real estate", url: "#" },
    { name: "San Luis Obispo real estate", url: "#" },
    { name: "Santa Clarita real estate", url: "#" },
    { name: "Santa Fe real estate", url: "#" },
    { name: "Sarasota real estate", url: "#" },
    { name: "Savannah real estate", url: "#" },
    { name: "Schaumburg real estate", url: "#" },
    { name: "Scottsdale real estate", url: "#" },
    { name: "Seattle real estate", url: "#" },
    { name: "Silver Spring real estate", url: "#" },
    { name: "Sioux Falls real estate", url: "#" },
    { name: "St. Louis real estate", url: "#" },
    { name: "Stamford real estate", url: "#" },
    { name: "Stockton real estate", url: "#" },
    { name: "Tacoma real estate", url: "#" },
    { name: "Tampa real estate", url: "#" },
    { name: "Temecula real estate", url: "#" },
    { name: "Tucson real estate", url: "#" },
    { name: "Tulsa real estate", url: "#" },
    { name: "Virginia Beach real estate", url: "#" },
    { name: "Washington, DC real estate", url: "#" },
    { name: "West Palm Beach real estate", url: "#" },
    { name: "Wilmington real estate", url: "#" },
    { name: "Woodbridge real estate", url: "#" },
    { name: "Worcester real estate", url: "#" }
];

const states = [
    { name: "Alabama • Homes for sale", url: "#" },
    { name: "Alaska • Homes for sale", url: "#" },
    { name: "Arizona • Homes for sale", url: "#" },
    { name: "Arkansas • Homes for sale", url: "#" },
    { name: "California • Homes for sale", url: "#" },
    { name: "Colorado • Homes for sale", url: "#" },
    { name: "Connecticut • Homes for sale", url: "#" },
    { name: "Delaware • Homes for sale", url: "#" },
    { name: "Florida • Homes for sale", url: "#" },
    { name: "Georgia • Homes for sale", url: "#" },
    { name: "Hawaii • Homes for sale", url: "#" },
    { name: "Idaho • Homes for sale", url: "#" },
    { name: "Illinois • Homes for sale", url: "#" },
    { name: "Indiana • Homes for sale", url: "#" },
    { name: "Iowa • Homes for sale", url: "#" },
    { name: "Kansas • Homes for sale", url: "#" },
    { name: "Kentucky • Homes for sale", url: "#" },
    { name: "Louisiana • Homes for sale", url: "#" },
    { name: "Maine • Homes for sale", url: "#" },
    { name: "Maryland • Homes for sale", url: "#" },
    { name: "Massachusetts • Homes for sale", url: "#" },
    { name: "Michigan • Homes for sale", url: "#" },
    { name: "Minnesota • Homes for sale", url: "#" },
    { name: "Mississippi • Homes for sale", url: "#" },
    { name: "Missouri • Homes for sale", url: "#" },
    { name: "Montana • Homes for sale", url: "#" },
    { name: "Nebraska • Homes for sale", url: "#" },
    { name: "Nevada • Homes for sale", url: "#" },
    { name: "New Hampshire • Homes for sale", url: "#" },
    { name: "New Jersey • Homes for sale", url: "#" },
    { name: "New Mexico • Homes for sale", url: "#" },
    { name: "New York • Homes for sale", url: "#" },
    { name: "North Carolina • Homes for sale", url: "#" },
    { name: "North Dakota • Homes for sale", url: "#" },
    { name: "Ohio • Homes for sale", url: "#" },
    { name: "Oklahoma • Homes for sale", url: "#" },
    { name: "Oregon • Homes for sale", url: "#" },
    { name: "Pennsylvania • Homes for sale", url: "#" },
    { name: "Rhode Island • Homes for sale", url: "#" },
    { name: "South Carolina • Homes for sale", url: "#" },
    { name: "South Dakota • Homes for sale", url: "#" },
    { name: "Tennessee • Homes for sale", url: "#" },
    { name: "Texas • Homes for sale", url: "#" },
    { name: "Utah • Homes for sale", url: "#" },
    { name: "Vermont • Homes for sale", url: "#" },
    { name: "Virginia • Homes for sale", url: "#" },
    { name: "Washington • Homes for sale", url: "#" },
    { name: "West Virginia • Homes for sale", url: "#" },
    { name: "Wisconsin • Homes for sale", url: "#" },
    { name: "Wyoming • Homes for sale", url: "#" }
];

const apartments = [
    { name: "Albuquerque apartments for rent", url: "#" },
    { name: "Alexandria apartments for rent", url: "#" },
    { name: "Arlington apartments for rent", url: "#" },
    { name: "Atlanta apartments for rent", url: "#" },
    { name: "Augusta apartments for rent", url: "#" },
    { name: "Austin apartments for rent", url: "#" },
    { name: "Bakersfield apartments for rent", url: "#" },
    { name: "Baltimore apartments for rent", url: "#" },
    { name: "Barnegat apartments for rent", url: "#" },
    { name: "Baton Rouge apartments for rent", url: "#" },
    { name: "Birmingham apartments for rent", url: "#" },
    { name: "Boston apartments for rent", url: "#" },
    { name: "Charlotte apartments for rent", url: "#" },
    { name: "Chattanooga apartments for rent", url: "#" },
    { name: "Chicago apartments for rent", url: "#" },
    { name: "Cincinnati apartments for rent", url: "#" },
    { name: "Cleveland apartments for rent", url: "#" },
    { name: "Columbia apartments for rent", url: "#" },
    { name: "Columbus apartments for rent", url: "#" },
    { name: "Dallas apartments for rent", url: "#" },
    { name: "Dayton apartments for rent", url: "#" },
    { name: "Denver apartments for rent", url: "#" },
    { name: "Detroit apartments for rent", url: "#" },
    { name: "Durham apartments for rent", url: "#" },
    { name: "Fayetteville apartments for rent", url: "#" },
    { name: "Fort Worth apartments for rent", url: "#" },
    { name: "Fresno apartments for rent", url: "#" },
    { name: "Greensboro apartments for rent", url: "#" },
    { name: "Houston apartments for rent", url: "#" },
    { name: "Huntsville apartments for rent", url: "#" },
    { name: "Indianapolis apartments for rent", url: "#" },
    { name: "Irving apartments for rent", url: "#" },
    { name: "Jacksonville apartments for rent", url: "#" },
    { name: "Kansas City apartments for rent", url: "#" },
    { name: "Knoxville apartments for rent", url: "#" },
    { name: "Las Vegas apartments for rent", url: "#" },
    { name: "Los Angeles apartments for rent", url: "#" },
    { name: "Louisville apartments for rent", url: "#" },
    { name: "Macon apartments for rent", url: "#" },
    { name: "Marietta apartments for rent", url: "#" },
    { name: "Melbourne apartments for rent", url: "#" },
    { name: "Memphis apartments for rent", url: "#" },
    { name: "Mesa apartments for rent", url: "#" },
    { name: "Miami apartments for rent", url: "#" },
    { name: "Milwaukee apartments for rent", url: "#" },
    { name: "Minneapolis apartments for rent", url: "#" },
    { name: "Mobile apartments for rent", url: "#" },
    { name: "Murfreesboro apartments for rent", url: "#" },
    { name: "Nashville apartments for rent", url: "#" },
    { name: "New York apartments for rent", url: "#" },
    { name: "Norfolk apartments for rent", url: "#" },
    { name: "Oklahoma City apartments for rent", url: "#" },
    { name: "Omaha apartments for rent", url: "#" },
    { name: "Orlando apartments for rent", url: "#" },
    { name: "Pensacola apartments for rent", url: "#" },
    { name: "Philadelphia apartments for rent", url: "#" },
    { name: "Phoenix apartments for rent", url: "#" },
    { name: "Pittsburgh apartments for rent", url: "#" },
    { name: "Plano apartments for rent", url: "#" },
    { name: "Portland apartments for rent", url: "#" },
    { name: "Raleigh apartments for rent", url: "#" },
    { name: "Reno apartments for rent", url: "#" },
    { name: "Richmond apartments for rent", url: "#" },
    { name: "Riverside apartments for rent", url: "#" },
    { name: "Rochester apartments for rent", url: "#" },
    { name: "Sacramento apartments for rent", url: "#" },
    { name: "Saint Louis apartments for rent", url: "#" },
    { name: "Saint Petersburg apartments for rent", url: "#" },
    { name: "San Antonio apartments for rent", url: "#" },
    { name: "San Diego apartments for rent", url: "#" },
    { name: "Savannah apartments for rent", url: "#" },
    { name: "Seattle apartments for rent", url: "#" },
    { name: "Springfield apartments for rent", url: "#" },
    { name: "Tampa apartments for rent", url: "#" },
    { name: "Tempe apartments for rent", url: "#" },
    { name: "Tucson apartments for rent", url: "#" },
    { name: "Tulsa apartments for rent", url: "#" },
    { name: "Virginia Beach apartments for rent", url: "#" },
    { name: "Washington apartments for rent", url: "#" }
];

const housesForRent = [
    { name: "Abilene houses for rent", url: "#" },
    { name: "Albany houses for rent", url: "#" },
    { name: "Amarillo houses for rent", url: "#" },
    { name: "Arlington houses for rent", url: "#" },
    { name: "Atlanta houses for rent", url: "#" },
    { name: "Augusta houses for rent", url: "#" },
    { name: "Austin houses for rent", url: "#" },
    { name: "Bakersfield houses for rent", url: "#" },
    { name: "Birmingham houses for rent", url: "#" },
    { name: "Charlotte houses for rent", url: "#" },
    { name: "Chesapeake houses for rent", url: "#" },
    { name: "Chicago houses for rent", url: "#" },
    { name: "Clarksville houses for rent", url: "#" },
    { name: "Columbia houses for rent", url: "#" },
    { name: "Columbus houses for rent", url: "#" },
    { name: "Columbus houses for rent", url: "#" },
    { name: "Concord houses for rent", url: "#" },
    { name: "Dallas houses for rent", url: "#" },
    { name: "Dayton houses for rent", url: "#" },
    { name: "Denver houses for rent", url: "#" },
    { name: "Destin houses for rent", url: "#" },
    { name: "Dothan houses for rent", url: "#" },
    { name: "El Paso houses for rent", url: "#" },
    { name: "Eugene houses for rent", url: "#" },
    { name: "Fayetteville houses for rent", url: "#" },
    { name: "Fort Wayne houses for rent", url: "#" },
    { name: "Fresno houses for rent", url: "#" },
    { name: "Greensboro houses for rent", url: "#" },
    { name: "Greenville houses for rent", url: "#" },
    { name: "Griffin houses for rent", url: "#" },
    { name: "Hampton houses for rent", url: "#" },
    { name: "Henderson houses for rent", url: "#" },
    { name: "Houston houses for rent", url: "#" },
    { name: "Huntsville houses for rent", url: "#" },
    { name: "Indianapolis houses for rent", url: "#" },
    { name: "Jackson houses for rent", url: "#" },
    { name: "Jacksonville houses for rent", url: "#" },
    { name: "Kissimmee houses for rent", url: "#" },
    { name: "Knoxville houses for rent", url: "#" },
    { name: "Lafayette houses for rent", url: "#" },
    { name: "Lakeland houses for rent", url: "#" },
    { name: "Lancaster houses for rent", url: "#" },
    { name: "Lansing houses for rent", url: "#" },
    { name: "Lawton houses for rent", url: "#" },
    { name: "Macon houses for rent", url: "#" },
    { name: "Marietta houses for rent", url: "#" },
    { name: "Memphis houses for rent", url: "#" },
    { name: "Mesa houses for rent", url: "#" },
    { name: "Mobile houses for rent", url: "#" },
    { name: "Montgomery houses for rent", url: "#" },
    { name: "Murfreesboro houses for rent", url: "#" },
    { name: "Nashville houses for rent", url: "#" },
    { name: "Orlando houses for rent", url: "#" },
    { name: "Pensacola houses for rent", url: "#" },
    { name: "Phoenix houses for rent", url: "#" },
    { name: "Port Saint Lucie houses for rent", url: "#" },
    { name: "Portland houses for rent", url: "#" },
    { name: "Raleigh houses for rent", url: "#" },
    { name: "Reno houses for rent", url: "#" },
    { name: "Richmond houses for rent", url: "#" },
    { name: "Riverside houses for rent", url: "#" },
    { name: "Roanoke houses for rent", url: "#" },
    { name: "Sacramento houses for rent", url: "#" },
    { name: "Saint Petersburg houses for rent", url: "#" },
    { name: "Salem houses for rent", url: "#" },
    { name: "San Antonio houses for rent", url: "#" },
    { name: "Savannah houses for rent", url: "#" },
    { name: "Spokane houses for rent", url: "#" },
    { name: "Springfield houses for rent", url: "#" },
    { name: "Stockton houses for rent", url: "#" },
    { name: "Tampa houses for rent", url: "#" },
    { name: "Toledo houses for rent", url: "#" },
    { name: "Tucson houses for rent", url: "#" },
    { name: "Tyler houses for rent", url: "#" },
    { name: "Valdosta houses for rent", url: "#" },
    { name: "Vancouver houses for rent", url: "#" },
    { name: "Waco houses for rent", url: "#" },
    { name: "Warner Robins houses for rent", url: "#" },
    { name: "Wichita houses for rent", url: "#" },
    { name: "Wilmington houses for rent", url: "#" }
];

// ฟังก์ชันช่วยในการแยกข้อมูลเป็นคอลัมน์
const splitIntoColumns = (items, columnCount) => {
    const itemsPerColumn = Math.ceil(items.length / columnCount);
    return Array.from({ length: columnCount }, (_, index) =>
        items.slice(index * itemsPerColumn, (index + 1) * itemsPerColumn)
    );
};

// Component หลักที่สามารถแสดงหมวดหมู่การค้นหาได้หลายหมวดหมู่
const SearchCategory = ({ title, links, columnCount, showFullListLink = true }) => {
    const [showMore, setShowMore] = useState(false);

    const toggleShowMore = () => setShowMore(!showMore);
    const displayedLinks = showMore ? links : links.slice(0, 25);

    const columns = splitIntoColumns(displayedLinks, columnCount);

    return (
        <div className="search-category">
            <h3>{title} {showFullListLink && <a href="#">View full list</a>}</h3>
            <div className={`link-columns ${showMore ? 'show' : ''}`}>
                {columns.map((column, colIndex) => (
                    <div key={colIndex} className="column">
                        {column.map((link, index) => (
                            <a key={index} href={link.url}>
                                {link.name}
                            </a>
                        ))}
                    </div>
                ))}
            </div>
            <button className="show-more" onClick={toggleShowMore}>
                {showMore ? (
                    <>
                        Show less
                        <svg className="expand-arrow" viewBox="0 0 24 24" width="16" height="16">
                            <path d="M8.3 15.4l4.1-4.1 4.1 4.1c.1.1.3.1.4 0l1-1.1c.1-.1.1-.2 0-.3l-5.4-5.4c-.1-.1-.3-.1-.4 0L7 14c-.1.1-.1.3 0 .4l1.1 1.1c.1.1.3.1.5 0z"></path>
                        </svg>
                    </>
                ) : (
                    <>
                        Show more
                        <svg className="expand-arrow" viewBox="0 0 24 24" width="16" height="16">
                            <path d="M15.7 8.6l-4.1 4.1-4.1-4.1c-.1-.1-.3-.1-.4 0l-1 1.1c-.1.1-.1.2 0 .3l5.4 5.4c.1.1.3.1.4 0l5.4-5.4c.1-.1.1-.3 0-.4l-1.1-1.1c-.2 0-.4 0-.5.1"></path>
                        </svg>
                    </>
                )}
            </button>
        </div>
    );
};


// Component หลักในการแสดงหมวดหมู่ทั้งหมด
const SearchLinksSection = () => {
    return (
        <div className="search-links-section">
            <SearchCategory title="Search for homes by city" links={cities} columnCount={5} showFullListLink={false} />
            <SearchCategory title="Search for homes by state" links={states} columnCount={5} showFullListLink={true} />
            <SearchCategory title="Search for apartments by city" links={apartments} columnCount={5} showFullListLink={true} />
            <SearchCategory title="Search for houses for rent by city" links={housesForRent} columnCount={5} showFullListLink={true} />
            <p className="info-text">
                *Listing fee subject to change, minimums apply. Any buyer’s agent fee the seller chooses to cover not included. Listing fee increased by 1% of sale price if buyer is unrepresented. Sell for a 1% listing fee only if you also buy with Redfin within 365 days of closing on your Redfin listing. We will charge a 1.5% listing fee, then send you a check for the 0.5% difference after you buy your next home with us. <a href="#">Learn more.</a>
            </p>
        </div>
        
    );
};

export default SearchLinksSection;