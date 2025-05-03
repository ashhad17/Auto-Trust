import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";

interface ServiceProvider {
  _id: string;
  name: string;
  description: string;
  image: string;
  rating: number;
  reviewCount: number;
  services: any[];
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

interface ServiceFiltersProps {
  services: ServiceProvider[];
  onFilterChange: (filteredServices: ServiceProvider[]) => void;
}

const ServiceFilters: React.FC<ServiceFiltersProps> = ({ services, onFilterChange }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");
  const [rating, setRating] = useState("");
  const [specialty, setSpecialty] = useState("");

  useEffect(() => {
    filterServices();
  }, [searchTerm, location, rating, specialty, services]);

  const filterServices = () => {
    let filtered = [...services];

    if (searchTerm) {
      filtered = filtered.filter(
        (provider) =>
          provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          provider.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (location) {
      filtered = filtered.filter(
        (provider) =>
          provider.location.city.toLowerCase().includes(location.toLowerCase()) ||
          provider.location.state.toLowerCase().includes(location.toLowerCase())
      );
    }

    if (rating && rating !== "any") {
      const minRating = parseFloat(rating);
      filtered = filtered.filter((provider) => provider.rating >= minRating);
    }

    if (specialty && specialty !== "all") {
      filtered = filtered.filter((provider) =>
        provider.specialties.some((s) =>
          s.toLowerCase().includes(specialty.toLowerCase())
        )
      );
    }

    onFilterChange(filtered);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setLocation("");
    setRating("any");
    setSpecialty("all");
  };

  return (
    <div className="mb-8 space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search service providers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Location (city or state)"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Select value={rating} onValueChange={setRating}>
            <SelectTrigger>
              <SelectValue placeholder="Minimum Rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any Rating</SelectItem>
              <SelectItem value="4.5">4.5+ Stars</SelectItem>
              <SelectItem value="4">4+ Stars</SelectItem>
              <SelectItem value="3">3+ Stars</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1">
          <Select value={specialty} onValueChange={setSpecialty}>
            <SelectTrigger>
              <SelectValue placeholder="Specialty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Specialties</SelectItem>
              <SelectItem value="European Cars">European Cars</SelectItem>
              <SelectItem value="Electrical Systems">Electrical Systems</SelectItem>
              <SelectItem value="Diagnostics">Diagnostics</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          variant="outline"
          onClick={clearFilters}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Clear Filters
        </Button>
      </div>
    </div>
  );
};

export default ServiceFilters; 