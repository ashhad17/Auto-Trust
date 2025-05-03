import React, { useState, useEffect } from "react";
import { ServiceType } from "@/lib/data";
import ServiceCard from "./ServiceCard";
import ServiceFilters from "./ServiceFilters";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BackendService {
  _id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  category: string;
  status: string;
  serviceProvider: {
    _id: string;
    name: string;
    rating?: number;
    reviewCount?: number;
  };
}

interface ServiceGridProps {
  services?: ServiceType[];
  isPreview?: boolean;
}

const ServiceGrid: React.FC<ServiceGridProps> = ({ services: initialServices, isPreview = false }) => {
  const [services, setServices] = useState<ServiceType[]>(initialServices || []);
  const [filteredServices, setFilteredServices] = useState<ServiceType[]>(initialServices || []);
  const [isLoading, setIsLoading] = useState<boolean>(!initialServices);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!initialServices && !isPreview) {
      fetchServices();
    }
  }, [initialServices, isPreview]);

  const fetchServices = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/v1/services`
      );
      
      if (response.data.success) {
        const backendServices: BackendService[] = response.data.data || [];
        
        // Convert backend services to the format expected by components
        const formattedServices: ServiceType[] = backendServices.map(service => ({
          id: service._id,
          name: service.name,
          description: service.description,
          price: `$${service.price}`,
          duration: `${service.duration} minutes`,
          category: service.category,
          status: service.status,
          provider: {
            id: service.serviceProvider?._id || "",
            name: service.serviceProvider?.name || "Unknown Provider",
            rating: service.serviceProvider?.rating || 4.5,
            reviewCount: service.serviceProvider?.reviewCount || 0
          },
          image: "/placeholder.svg",
          rating: service.serviceProvider?.rating || 4.5
        }));
        
        setServices(formattedServices);
        setFilteredServices(formattedServices);
      } else {
        setError("Failed to fetch services");
        toast({
          title: "Error",
          description: "Failed to fetch services",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching services:", error);
      setError("Failed to fetch services");
      toast({
        title: "Error",
        description: "Failed to fetch services. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading services...</p>
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
          onClick={fetchServices}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <ServiceFilters services={services} onFilterChange={setFilteredServices} />
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
      
      {filteredServices.length === 0 && (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium mb-2">No services found</h3>
          <p className="text-gray-600">
            Try adjusting your search criteria or filters
          </p>
        </div>
      )}
    </div>
  );
};

export default ServiceGrid;
