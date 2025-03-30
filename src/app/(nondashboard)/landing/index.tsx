import React from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from './HeroSection';
import FeaturedSection from './FeaturesSection'; // Adjust the path as needed

const LandingPage = () => {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <FeaturedSection />
    </div>
  );
};

export default LandingPage;
