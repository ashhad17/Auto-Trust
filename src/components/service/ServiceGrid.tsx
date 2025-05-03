import React, { useState, useEffect } from "react";
import { ServiceType } from "@/lib/data";
import ServiceCard from "./ServiceCard";
import ServiceFilters from "./ServiceFilters";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface Service {
  _id: string;
  name: string;
  description: string;
  price: number;
}

interface ServiceProvider {
  _id: string;
  name: string;
  description: string;
  image: string;
  rating: number;
  reviewCount: number;
  services: Service[];
  status: string;
  verified: boolean;
  specialties: string[];
  location: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

interface ServiceGridProps {
  services?: ServiceType[];
  isPreview?: boolean;
}

const ServiceGrid: React.FC<ServiceGridProps> = ({ isPreview = false }) => {
  const [providers, setProviders] = useState<ServiceProvider[]>([]);
  const [filteredProviders, setFilteredProviders] = useState<ServiceProvider[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isPreview) {
      fetchServiceProviders();
    }
  }, [isPreview]);

  const fetchServiceProviders = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get<{ 
        success: boolean; 
        data: {
          serviceProviders: ServiceProvider[];
          pagination: {
            total: number;
            pages: number;
            currentPage: number;
            limit: number;
          }
        }
      }>(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/v1/service-providers`
      );
      
      if (response.data.success && Array.isArray(response.data.data.serviceProviders)) {
        const serviceProviders = response.data.data.serviceProviders;
        setProviders(serviceProviders);
        setFilteredProviders(serviceProviders);
      } else {
        const errorMessage = !response.data.success 
          ? "Server returned unsuccessful response" 
          : "Response data is not in the expected format";
        setError(errorMessage);
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Detailed error:", error);
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.message || error.message
        : "Failed to fetch service providers";
      
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = (providerId: string) => {
    navigate(`/services/${providerId}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading service providers...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-medium mb-2 text-destructive">{error}</h3>
        <p className="text-gray-600 mb-4">Please try again later</p>
        <button 
          onClick={fetchServiceProviders}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <ServiceFilters services={providers} onFilterChange={setFilteredProviders} />
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProviders.map((provider) => (
          <div 
            key={provider._id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <img 
              src={provider.image} 
              alt={provider.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">{provider.name}</h3>
              <p className="text-gray-600 text-sm mb-2">{provider.description}</p>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-yellow-500">★</span>
                <span>{provider.rating.toFixed(1)}</span>
                <span className="text-gray-500">({provider.reviewCount} reviews)</span>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {provider.specialties.map((specialty, index) => (
                  <span 
                    key={index}
                    className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
              <div className="mt-2 text-sm text-gray-600 mb-4">
                <p>{provider.location.city}, {provider.location.state}</p>
              </div>
              <Button 
                onClick={() => handleViewDetails(provider._id)}
                className="w-full"
              >
                View Details
              </Button>
            </div>
          </div>
        ))}
      </div>
      
      {filteredProviders.length === 0 && (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium mb-2">No service providers found</h3>
          <p className="text-gray-600">
            Try adjusting your search criteria or filters
          </p>
        </div>
      )}
    </div>
  );
};

export default ServiceGrid;
