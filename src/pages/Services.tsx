
import React from "react";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ServiceGrid from "@/components/service/ServiceGrid";
import AuthModal from "@/components/auth/AuthModal";

const Services = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Vehicle Services | WheelsTrust</title>
      </Helmet>
      <Navbar />
      <main className="flex-grow pt-24 pb-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Vehicle Services
            </h1>
            <p className="text-gray-600 max-w-3xl">
              Find trusted service providers for maintenance, repairs, and 
              inspections. All service providers are vetted and reviewed by 
              our community of car owners.
            </p>
          </div>
          
          {/* Use ServiceGrid without providing services - it will fetch them from API */}
          <ServiceGrid />
        </div>
      </main>
      <Footer />
      <AuthModal />
    </div>
  );
};

export default Services;
