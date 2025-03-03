import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar/Navbar";
import FilterViewBar from "../components/Filter/FilterViewBar";
import PropertyHeader from "../components/PropertyHeader/PropertyHeader";
import PropertyList from "../components/PropertyList/PropertyList";
import Map from "../components/Map";
import Footer from "../components/Footer/Footer";

const Test = () => {
  const savedViewOption = localStorage.getItem("viewOption") || "List";
  const [viewOption, setViewOption] = useState(savedViewOption);
  const [displayedProperties, setDisplayedProperties] = useState([]); // ใช้เก็บ properties ที่ดึงมา
  const [totalHomes, setTotalHomes] = useState(0); // จำนวนบ้านทั้งหมด
  const [sortBy, setSortBy] = useState("Recommended");
  const [currentPage, setCurrentPage] = useState(1);
  const homesPerPage = 8;

  // ตรวจสอบให้มั่นใจว่า displayedProperties เป็น array
  const totalProperties = Array.isArray(displayedProperties)
    ? displayedProperties
    : [];

  // คำนวณ startIndex และ endIndex ให้ถูกต้อง
  const startIndex = (currentPage - 1) * homesPerPage;
  const endIndex = Math.min(startIndex + homesPerPage, totalHomes); // อย่าให้ endIndex เกินจำนวนทั้งหมด

  // ใช้ slice เพื่อแสดงข้อมูลบ้านเฉพาะในหน้าปัจจุบัน
  const paginatedProperties = totalProperties.slice(startIndex, endIndex);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleViewChange = (newView) => {
    setViewOption(newView);
  };

  useEffect(() => {
    localStorage.setItem("viewOption", viewOption);
  }, [viewOption]);

  useEffect(() => {
    // ดึงข้อมูลจาก API ที่ URL http://localhost:5000/api/homes/
    fetch("http://localhost:5000/api/homes/")
      .then((res) => res.json())
      .then((data) => {
        setDisplayedProperties(data); // เก็บข้อมูลบ้านที่ดึงมา
        setTotalHomes(data.length); // อัปเดตจำนวนบ้านทั้งหมดจากข้อมูลที่ดึงมา
      })
      .catch((error) => {
        console.error("Error fetching properties:", error);
      });
  }, []); // ดึงข้อมูลเมื่อ component โหลดครั้งแรก

  // กำหนดให้หน้าปัจจุบันแสดงผลถูกต้อง
  useEffect(() => {
    if (startIndex > totalHomes) {
      setCurrentPage(1); // รีเซ็ตเป็นหน้าที่ 1 หาก startIndex เกินจำนวนบ้านทั้งหมด
    }
  }, [currentPage, totalHomes]); // คำนวณใหม่เมื่อ currentPage หรือ totalHomes เปลี่ยนแปลง

  return (
    <>
      <Navbar />
      <FilterViewBar setViewOption={setViewOption} />
      {viewOption === "Map" ? (
        <Map />
      ) : (
        <>
          <PropertyHeader
            displayedProperties={paginatedProperties}
            onSortChange={setSortBy}
            onViewChange={handleViewChange}
            currentPage={currentPage}
            totalHomes={totalHomes} // ส่ง totalHomes ที่ดึงมาจาก API
          />

          <PropertyList
            sortBy={sortBy}
            onPropertiesChange={setDisplayedProperties}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            displayedProperties={paginatedProperties}
          />
          <Footer />
        </>
      )}
    </>
  );
};

export default Test;
