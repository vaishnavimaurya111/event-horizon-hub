import { useState } from "react";
import IntroAnimation from "@/components/IntroAnimation";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturedEvents from "@/components/FeaturedEvents";
import FeaturesSection from "@/components/FeaturesSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Index = () => {
  const [introComplete, setIntroComplete] = useState(false);

  return (
    <>
      {!introComplete && <IntroAnimation onComplete={() => setIntroComplete(true)} />}
      <div className={introComplete ? "animate-fade-in" : "opacity-0"}>
        <Navbar />
        <HeroSection />
        <FeaturedEvents />
        <FeaturesSection />
        <CTASection />
        <Footer />
      </div>
    </>
  );
};

export default Index;
