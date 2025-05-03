import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Search } from "lucide-react";
import { CarType } from "@/lib/data";

interface CarFiltersProps {
  cars: CarType[];
  onFilterChange: (filteredCars: CarType[]) => void;
}

const CarFilters: React.FC<CarFiltersProps> = ({ cars, onFilterChange }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState<number[]>([0, 100000]);
  const [yearRange, setYearRange] = useState<number[]>([1990, new Date().getFullYear()]);
  const [mileageRange, setMileageRange] = useState<number[]>([0, 200000]);
  const [selectedMake, setSelectedMake] = useState<string>("all");
  const [selectedCondition, setSelectedCondition] = useState<string>("all");
  const [selectedTransmission, setSelectedTransmission] = useState<string>("all");
  const [selectedFuelType, setSelectedFuelType] = useState<string>("all");

  // Get unique values for filters
  const makes = Array.from(new Set(cars.map(car => car.make)));
  const conditions = Array.from(new Set(cars.map(car => car.condition).filter(Boolean)));
  const transmissions = Array.from(new Set(cars.map(car => car.transmission).filter(Boolean)));
  const fuelTypes = Array.from(new Set(cars.map(car => car.fuelType).filter(Boolean)));

  const applyFilters = () => {
    const filteredCars = cars.filter(car => {
      const matchesSearch = 
        car.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
        car.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
        car.title?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesPrice = 
        car.price >= priceRange[0] && car.price <= priceRange[1];

      const matchesYear = 
        car.year >= yearRange[0] && car.year <= yearRange[1];

      const matchesMileage = 
        car.mileage >= mileageRange[0] && car.mileage <= mileageRange[1];

      const matchesMake = 
        selectedMake === "all" || car.make === selectedMake;

      const matchesCondition = 
        selectedCondition === "all" || car.condition === selectedCondition;

      const matchesTransmission = 
        selectedTransmission === "all" || car.transmission === selectedTransmission;

      const matchesFuelType = 
        selectedFuelType === "all" || car.fuelType === selectedFuelType;

      return matchesSearch && matchesPrice && matchesYear && matchesMileage && 
             matchesMake && matchesCondition && matchesTransmission && matchesFuelType;
    });

    onFilterChange(filteredCars);
  };

  const resetFilters = () => {
    setSearchQuery("");
    setPriceRange([0, 100000]);
    setYearRange([1990, new Date().getFullYear()]);
    setMileageRange([0, 200000]);
    setSelectedMake("all");
    setSelectedCondition("all");
    setSelectedTransmission("all");
    setSelectedFuelType("all");
    onFilterChange(cars);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
          <Input
            placeholder="Search cars..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Make Filter */}
        <Select value={selectedMake} onValueChange={setSelectedMake}>
          <SelectTrigger>
            <SelectValue placeholder="Select Make" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Makes</SelectItem>
            {makes.map(make => (
              <SelectItem key={make} value={make}>{make}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Condition Filter */}
        <Select value={selectedCondition} onValueChange={setSelectedCondition}>
          <SelectTrigger>
            <SelectValue placeholder="Select Condition" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Conditions</SelectItem>
            {conditions.map(condition => (
              <SelectItem key={condition} value={condition}>{condition}</SelectItem>
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
            max={100000}
            step={1000}
          />
          <div className="flex justify-between text-sm text-gray-500">
            <span>${priceRange[0].toLocaleString()}</span>
            <span>${priceRange[1].toLocaleString()}</span>
          </div>
        </div>

        {/* Year Range */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Year Range</label>
          <Slider
            value={yearRange}
            onValueChange={setYearRange}
            min={1990}
            max={new Date().getFullYear()}
            step={1}
          />
          <div className="flex justify-between text-sm text-gray-500">
            <span>{yearRange[0]}</span>
            <span>{yearRange[1]}</span>
          </div>
        </div>

        {/* Mileage Range */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Mileage Range</label>
          <Slider
            value={mileageRange}
            onValueChange={setMileageRange}
            min={0}
            max={200000}
            step={1000}
          />
          <div className="flex justify-between text-sm text-gray-500">
            <span>{mileageRange[0].toLocaleString()} mi</span>
            <span>{mileageRange[1].toLocaleString()} mi</span>
          </div>
        </div>

        {/* Transmission Filter */}
        <Select value={selectedTransmission} onValueChange={setSelectedTransmission}>
          <SelectTrigger>
            <SelectValue placeholder="Select Transmission" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Transmissions</SelectItem>
            {transmissions.map(transmission => (
              <SelectItem key={transmission} value={transmission}>{transmission}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Fuel Type Filter */}
        <Select value={selectedFuelType} onValueChange={setSelectedFuelType}>
          <SelectTrigger>
            <SelectValue placeholder="Select Fuel Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Fuel Types</SelectItem>
            {fuelTypes.map(fuelType => (
              <SelectItem key={fuelType} value={fuelType}>{fuelType}</SelectItem>
            ))}
          </SelectContent>
        </Select>
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

export default CarFilters; 