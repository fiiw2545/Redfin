import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar/Navbar";
import FilterViewBar from "../components/Filter/FilterViewBar";
import PropertyHeader from "../components/PropertyHeader/PropertyHeader";
import PropertyList from "../components/PropertyList/PropertyList";
import Map from "../components/Map";
import Footer from "../components/Footer/Footer";

const Test = () => {
  // ดึงค่า viewOption จาก localStorage หากมีค่า ถ้าไม่มีให้ใช้ 'List' เป็นค่าเริ่มต้น
  const savedViewOption = localStorage.getItem("viewOption") || "List";
  const [viewOption, setViewOption] = useState(savedViewOption);
  const [displayedProperties, setDisplayedProperties] = useState([]);
  const [sortBy, setSortBy] = useState("Recommended");

  // เมื่อมีการเปลี่ยนแปลง viewOption ให้เก็บค่าลงใน localStorage
  useEffect(() => {
    localStorage.setItem("viewOption", viewOption);
  }, [viewOption]);

  return (
    <>
      <Navbar />
      <FilterViewBar setViewOption={setViewOption} />
      {viewOption === "Map" ? (
        <Map />
      ) : (
        <>
          <PropertyHeader
            displayedProperties={displayedProperties}
            onSortChange={setSortBy}
          />
          <PropertyList
            sortBy={sortBy}
            onPropertiesChange={setDisplayedProperties}
          />
          <Footer />
        </>
      )}
    </>
  );
};

export default Test;
