import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import CoreCapabilities from "@/components/CoreCapabilities";
import LanguageSection from "@/components/LanguageSection";
import BuiltForIndia from "@/components/BuiltForIndia";
import TrustSafety from "@/components/TrustSafety";
import Footer from "@/components/Footer";
import SplashScreen from "@/components/SplashScreen";

const Index = () => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 1400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <SplashScreen show={showSplash} />
      <div className="min-h-screen bg-background">
        <Navbar />
        <Hero />
        <HowItWorks />
        <CoreCapabilities />
        <LanguageSection />
        <BuiltForIndia />
        <TrustSafety />
        <Footer />
      </div>
    </>
  );
};

export default Index;
