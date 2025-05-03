
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { ServiceType } from "@/lib/data";
import ServiceCard from "@/components/service/ServiceCard";

interface ServiceSectionProps {
  services: ServiceType[];
}

const ServiceSection: React.FC<ServiceSectionProps> = ({ services }) => {
  // Only show the first 3 services in the preview
  const previewServices = services.slice(0, 3);

  return (
    <section className="section-padding bg-blue-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">Vehicle Services</h2>
            <p className="text-gray-600 max-w-2xl">
              Connect with trusted service providers for routine maintenance, repairs, and
              inspections with transparent pricing and verified reviews.
            </p>
          </div>
          <Link to="/services">
            <Button variant="outline" className="mt-4 md:mt-0">
              Browse All Services
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {previewServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>

        <div className="mt-12 bg-white rounded-xl p-8 grid md:grid-cols-2 gap-8 items-center">
          <div className="order-first">
            <img
              src="https://images.unsplash.com/photo-1599256621730-535171e28b8e?q=80&w=1932&auto=format&fit=crop"
              alt="Service provider"
              className="rounded-lg shadow-lg"
            />
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-4">Are you a service provider?</h3>
            <p className="text-gray-600 mb-6">
              Join our network of trusted automotive professionals. Increase your visibility,
              connect with customers, and grow your business with transparent pricing.
            </p>
            <Link to="/services">
              <Button className="button-gradient text-white">
                Partner With Us
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceSection;
