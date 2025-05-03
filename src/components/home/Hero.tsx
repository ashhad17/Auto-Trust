
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Search, Car as CarIcon, Settings } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const Hero = () => {
  const { openAuthModal, isAuthenticated } = useAuth();
  const [searchType, setSearchType] = useState<"buy" | "sell" | "service">("buy");

  const handleActionClick = () => {
    if (!isAuthenticated) {
      openAuthModal();
    } else {
      // Redirect to relevant page based on action
      window.location.href = 
        searchType === "buy" ? "/cars" :
        searchType === "sell" ? "/sell" : "/services";
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center pt-16 overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-20 right-0 w-3/4 h-3/4 opacity-10">
        <div className="absolute rounded-full bg-primary w-96 h-96 blur-3xl -top-20 -right-20"></div>
        <div className="absolute rounded-full bg-accent w-64 h-64 blur-3xl bottom-10 left-10"></div>
      </div>

      <div className="container mx-auto px-4 py-20 z-10">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="max-w-xl md:mr-auto animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight">
              <span className="text-gradient">The smarter way</span>
              <br />
              to buy, sell & service your car
            </h1>
            <p className="text-lg text-gray-700 mb-8">
              A transparent marketplace built on trust, connecting vehicle owners with reliable buyers and trusted service providers.
            </p>
            
            <div className="bg-white shadow-xl rounded-xl p-4 mb-8">
              <div className="flex space-x-2 mb-4">
                <Button
                  variant={searchType === "buy" ? "default" : "outline"}
                  className={searchType === "buy" ? "button-gradient text-white" : ""}
                  onClick={() => setSearchType("buy")}
                >
                  <CarIcon className="h-4 w-4 mr-2" />
                  Buy a Car
                </Button>
                <Button
                  variant={searchType === "sell" ? "default" : "outline"}
                  className={searchType === "sell" ? "button-gradient text-white" : ""}
                  onClick={() => setSearchType("sell")}
                >
                  <CarIcon className="h-4 w-4 mr-2" />
                  Sell a Car
                </Button>
                <Button
                  variant={searchType === "service" ? "default" : "outline"}
                  className={searchType === "service" ? "button-gradient text-white" : ""}
                  onClick={() => setSearchType("service")}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Find Service
                </Button>
              </div>
              
              <div className="relative">
                <input
                  type="text"
                  className="w-full p-3 pr-12 border rounded-lg"
                  placeholder={
                    searchType === "buy"
                      ? "Search by make, model, year..."
                      : searchType === "sell"
                      ? "Enter your car details..."
                      : "Search for services or providers..."
                  }
                />
                <Button 
                  className="absolute right-1 top-1 button-gradient text-white" 
                  onClick={handleActionClick}
                >
                  <Search className="h-4 w-4 mr-1" />
                  {searchType === "buy" ? "Search" : searchType === "sell" ? "List Now" : "Find"}
                </Button>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <div className="flex -space-x-2">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&h=50&auto=format&fit=crop&crop=face"
                  className="w-8 h-8 rounded-full border-2 border-white"
                  alt="User"
                />
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&auto=format&fit=crop&crop=face"
                  className="w-8 h-8 rounded-full border-2 border-white"
                  alt="User"
                />
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=50&h=50&auto=format&fit=crop&crop=face"
                  className="w-8 h-8 rounded-full border-2 border-white"
                  alt="User"
                />
              </div>
              <p>Trusted by over <span className="font-semibold">50,000</span> happy customers</p>
            </div>
          </div>
          
          <div className="hidden md:block relative">
            <img
              src="https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=2070&auto=format&fit=crop"
              alt="Car hero"
              className="rounded-lg shadow-2xl transform hover-scale animate-scale-in"
            />
            
            <div className="absolute -bottom-5 -left-5 bg-white p-4 rounded-lg shadow-lg animate-slide-in-bottom">
              <div className="flex items-center">
                <div className="bg-green-100 p-2 rounded-full mr-3">
                  <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <div>
                  <p className="font-medium">Verified Sellers</p>
                  <p className="text-sm text-gray-600">100% transparency & trust</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
