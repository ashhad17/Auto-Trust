import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Search } from "lucide-react";
import { ServiceType } from "@/lib/data";

interface ServiceFiltersProps {
  services: ServiceType[];
  onFilterChange: (filteredServices: ServiceType[]) => void;
}

const ServiceFilters: React.FC<ServiceFiltersProps> = ({ services, onFilterChange }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState<number[]>([0, 1000]);
  const [ratingRange, setRatingRange] = useState<number[]>([0, 5]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(false);

  // Get unique values for filters
  const categories = Array.from(new Set(services.map(service => service.category)));
  const locations = Array.from(new Set(services.map(service => service.provider.location)));

  const applyFilters = () => {
    const filteredServices = services.filter(service => {
      const matchesSearch = 
        service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.provider.name.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesPrice = 
        parseFloat(service.price.replace(/[^0-9.-]+/g, "")) >= priceRange[0] &&
        parseFloat(service.price.replace(/[^0-9.-]+/g, "")) <= priceRange[1];

      const matchesRating = 
        service.rating >= ratingRange[0] && service.rating <= ratingRange[1];

      const matchesCategory = 
        selectedCategory === "all" || service.category === selectedCategory;

      const matchesLocation = 
        selectedLocation === "all" || service.provider.location === selectedLocation;

      const matchesVerification = 
        !verifiedOnly || service.provider.verified;

      return matchesSearch && matchesPrice && matchesRating && matchesCategory && 
             matchesLocation && matchesVerification;
    });

    onFilterChange(filteredServices);
  };

  const resetFilters = () => {
    setSearchQuery("");
    setPriceRange([0, 1000]);
    setRatingRange([0, 5]);
    setSelectedCategory("all");
    setSelectedLocation("all");
    setVerifiedOnly(false);
    onFilterChange(services);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
          <Input
            placeholder="Search services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Category Filter */}
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(category => (
              <SelectItem key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Price Range */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Price Range</label>
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            min={0}
            max={1000}
            step={10}
          />
          <div className="flex justify-between text-sm text-gray-500">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </div>

        {/* Rating Range */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Rating Range</label>
          <Slider
            value={ratingRange}
            onValueChange={setRatingRange}
            min={0}
            max={5}
            step={0.5}
          />
          <div className="flex justify-between text-sm text-gray-500">
            <span>{ratingRange[0]} stars</span>
            <span>{ratingRange[1]} stars</span>
          </div>
        </div>

        {/* Location Filter */}
        <Select value={selectedLocation} onValueChange={setSelectedLocation}>
          <SelectTrigger>
            <SelectValue placeholder="Select Location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            {locations.map(location => (
              <SelectItem key={location} value={location}>{location}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Verified Only Toggle */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="verifiedOnly"
            checked={verifiedOnly}
            onChange={(e) => setVerifiedOnly(e.target.checked)}
            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
          />
          <label htmlFor="verifiedOnly" className="text-sm font-medium">
            Verified Providers Only
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-4 mt-6">
        <Button variant="outline" onClick={resetFilters}>
          Reset Filters
        </Button>
        <Button onClick={applyFilters}>
          Apply Filters
        </Button>
      </div>
    </div>
  );
};

export default ServiceFilters; 