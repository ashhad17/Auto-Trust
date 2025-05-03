
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { CarType } from "@/lib/data";
import CarCard from "@/components/car/CarCard";
import CarGrid from "@/components/car/CarGrid";

interface CarListingPreviewProps {
  cars: CarType[];
}

const CarListingPreview: React.FC<CarListingPreviewProps> = ({ cars }) => {
  // Only show the first 3 cars in the preview
  const previewCars = cars.slice(0, 3);

  return (
    <section className="section-padding bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">Featured Vehicles</h2>
            <p className="text-gray-600 max-w-2xl">
              Discover our curated selection of verified vehicles for sale. Each listing
              comes with transparent pricing and detailed history.
            </p>
          </div>
          <Link to="/cars">
            <Button variant="outline" className="mt-4 md:mt-0">
              View All Listings
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Use CarGrid component with isPreview flag */}
        <CarGrid cars={previewCars} isPreview={true} />
        
        <div className="mt-12 bg-blue-50 rounded-xl p-8 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-2xl font-bold mb-4">Ready to sell your car?</h3>
            <p className="text-gray-600 mb-6">
              List your vehicle on WheelsTrust and connect with serious buyers. Our transparent 
              process ensures you get fair market value with no hidden fees.
            </p>
            <Link to="/cars/sell">
              <Button className="button-gradient text-white">
                Start Selling
              </Button>
            </Link>
          </div>
          <div className="order-first md:order-last">
            <img
              src="https://images.unsplash.com/photo-1560253414-f65d1f5a1a37?q=80&w=2070&auto=format&fit=crop"
              alt="Selling a car"
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CarListingPreview;
