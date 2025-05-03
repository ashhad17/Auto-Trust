
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import CarListingPreview from "@/components/home/CarListingPreview";
import ServiceSection from "@/components/home/ServiceSection";
import Testimonials from "@/components/home/Testimonials";
import AuthModal from "@/components/auth/AuthModal";
import { cars, services } from "@/lib/data";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <Features />
        <CarListingPreview cars={cars} />
        <ServiceSection services={services} />
        <Testimonials />
        <AuthModal />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
