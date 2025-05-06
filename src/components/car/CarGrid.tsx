import React, { useState, useEffect } from "react";
import { CarType } from "@/lib/data";
import CarCard from "./CarCard";
import CarFilters from "./CarFilters";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CarGridProps {
  cars?: CarType[]; // Make this optional as we'll fetch from the backend
  isPreview?: boolean;
}

interface BackendCar {
  _id: string;
  title: string;
  make: string;
  model: string;
  year: string;
  price: string;
  mileage: string;
  condition: string;
  location: string;
  description: string;
  images: Array<{
    url: string;
    publicId: string;
  }>;
  seller: {
    _id: string;
    name: string;
  };
  status: string;
  createdAt: string;
  features?: string[];
  exteriorColor?: string;
  interiorColor?: string;
  fuelType?: string;
  transmission?: string;
}

const CarGrid: React.FC<CarGridProps> = ({ cars: initialCars, isPreview = false }) => {
  const [cars, setCars] = useState<CarType[]>(initialCars || []);
  const [filteredCars, setFilteredCars] = useState<CarType[]>(initialCars || []);
  const [isLoading, setIsLoading] = useState<boolean>(!initialCars);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!initialCars && !isPreview) {
      fetchCars();
    }
  }, [initialCars, isPreview]);

  const fetchCars = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/v1/cars`
      );

      console.log("Cars API response:", response.data.data[0].status);

      if (response.data.success) {
        // Extract cars from response - handle both pagination and direct data formats
        const backendCars: BackendCar[] = response.data.data.cars || response.data.data || [];
        
        // Convert backend cars to the format expected by the components
        const formattedCars: CarType[] = backendCars.map(car => ({
          id: car._id,
          title: car.title || `${car.year} ${car.make} ${car.model}`,
          make: car.make,
          model: car.model,
          year: parseInt(car.year) || new Date().getFullYear(),
          price: parseFloat(car.price),
          mileage: parseInt(car.mileage),
          condition: car.condition,
          location: car.location,
          description: car.description,
          // Handle images - map Cloudinary URLs
          images: car.images?.map(img => img.url) || [],
          // Use first image as main image or fallback to placeholder
          image: car.images && car.images.length > 0 ? car.images[0].url : "/placeholder.svg",
          seller: car.seller?.name || "Unknown",
          features: car.features || [],
          status: car.status,
          // Add additional properties with proper fallbacks
          color: car.exteriorColor || "Not specified",
          rating: 4.5, // Default value
          reviewCount: 0, // Default value
          fuelType: car.fuelType || "Not specified",
          transmission: car.transmission?.toLowerCase() === 'manual' ? 'manual' : 'automatic',
          sellerType: "private" // Default to private seller
        }));
        
        // Only include active cars
const activeCars = formattedCars.filter(car => car.status === "active");

setCars(activeCars);
setFilteredCars(activeCars);

      } else {
        setError("Failed to fetch car listings");
        toast({
          title: "Error",
          description: "Failed to fetch car listings",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching cars:", error);
      setError("Failed to fetch car listings");
      toast({
        title: "Error", 
        description: "Failed to fetch cars. Please try again later.",
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
          <p className="text-muted-foreground">Loading cars...</p>
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
          onClick={fetchCars}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <CarFilters cars={cars} onFilterChange={setFilteredCars} />
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCars.map((car) => (
          <CarCard 
            key={car.id} 
            car={{
              ...car,
              // Ensure the image prop is properly set
              image: car.images && car.images.length > 0 ? car.images[0] : "/placeholder.svg"
            }} 
          />
        ))}
      </div>
      
      {filteredCars.length === 0 && (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium mb-2">No cars found</h3>
          <p className="text-gray-600">
            Try adjusting your search criteria or filters
          </p>
        </div>
      )}
    </div>
  );
};

export default CarGrid;