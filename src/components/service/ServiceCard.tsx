import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ServiceType } from "@/lib/data";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";

interface ServiceCardProps {
  service: ServiceType;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  const { isAuthenticated, openAuthModal } = useAuth();
  const navigate = useNavigate();

  const handleBookClick = () => {
    if (!isAuthenticated) {
      openAuthModal();
    } else {
      // In a real app, this would open a booking modal or redirect to a booking page
      alert("Booking feature would open here");
    }
  };

  const handleViewDetails = () => {
    navigate(`/services/${service.id}`);
  };

  return (
    <Card className="overflow-hidden hover-scale transition-all duration-300 shadow-md h-full flex flex-col">
      <div className="relative">
        <img
          src={service.image}
          alt={service.name}
          className="w-full h-48 object-cover"
        />
        <Badge
          variant="default"
          className="absolute top-3 right-3 bg-primary"
        >
          {service.category.charAt(0).toUpperCase() + service.category.slice(1)}
        </Badge>
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="font-bold text-lg mb-2">{service.name}</h3>
        <p className="text-gray-600 text-sm mb-4 flex-grow">
          {service.description}
        </p>
        
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(service.rating) ? "text-yellow-400" : "text-gray-300"
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 15.585l-5.958 3.153 1.14-6.632L.36 7.368l6.652-.965L10 .585l2.988 5.818 6.652.965-4.822 4.738 1.14 6.632z"
                  clipRule="evenodd"
                />
              </svg>
            ))}
            <span className="ml-1 text-sm text-gray-600">{service.rating}</span>
          </div>
          <span className="font-medium text-primary">{service.price}</span>
        </div>
        
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <img
              src={service.provider.image}
              alt={service.provider.name}
              className="h-8 w-8 rounded-full"
            />
            <div>
              <p className="text-sm font-medium flex items-center">
                {service.provider.name}
                {service.provider.verified && (
                  <CheckCircle className="h-3 w-3 ml-1 text-green-600" />
                )}
              </p>
              <p className="text-xs text-gray-500">{service.provider.location}</p>
            </div>
          </div>
        </div>
        
        <Button 
          onClick={handleViewDetails}
          className="w-full button-gradient text-white"
        >
          View Details
        </Button>
      </div>
    </Card>
  );
};

export default ServiceCard;
