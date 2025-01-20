// src/pages/HomePage.jsx
import React from 'react';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import SearchTabs from '../components/SearchTabs/SearchTabs';
import ServicesSection from '../components/ServicesSection/ServicesSection';
import SearchLinksSection from '../components/SearchLinksSection/SearchLinksSection';
import ContactForm from '../components/ContactForm/ContactForm';
import AppSection from '../components/AppSection/AppSection';

const HomePage = () => {
  return (
    <>
      <Navbar />
      <SearchTabs />
      <ServicesSection />
      <AppSection/>
      <ContactForm/>
      <SearchLinksSection/>
      <Footer />
    </>
  );
};

export default HomePage;
