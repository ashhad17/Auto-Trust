import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import { cars } from "@/lib/data";
import { Car, Calendar, MapPin, Info, MessageSquare } from "lucide-react";
import Modal from "@/components/ui/modal";

const CarDetails = () => {
  const { id } = useParams();
  const { isAuthenticated, openAuthModal } = useAuth();
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  
  // Find the car with the matching ID - convert string id to number for comparison
  const car = cars.find(c => c.id === parseInt(id as string));
  
  if (!car) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 pt-32 pb-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Car Not Found</h1>
          <p className="mb-6">The car you're looking for doesn't exist or has been removed.</p>
          <Link to="/cars/buy">
            <Button>Browse All Cars</Button>
          </Link>
        </div>
        <Footer />
      </>
    );
  }
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price);
  };
  
  const formatMileage = (mileage: number) => {
    return new Intl.NumberFormat("en-US").format(mileage);
  };

  const handleContactClick = () => {
    if (!isAuthenticated) {
      openAuthModal();
    } else {
      setIsContactModalOpen(true);
    }
  };
  
  const handleSubmitMessage = () => {
    // In a real app, this would send the message to the backend
    alert("Your message has been sent to the seller!");
    setMessage("");
    setIsContactModalOpen(false);
  };
  
  const carImages = [
    car.image,
    "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop",
  ];
  
  const [activeImage, setActiveImage] = useState(carImages[0]);

  return (
    <>
      <Helmet>
        <title>{car.title || `${car.year} ${car.make} ${car.model}`} | WheelsTrust</title>
      </Helmet>
      
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Link to="/cars/buy" className="text-sm text-gray-500 hover:text-primary">
                Cars
              </Link>
              <span className="text-gray-400">/</span>
              <Link to="/cars/buy" className="text-sm text-gray-500 hover:text-primary">
                {car.make}
              </Link>
              <span className="text-gray-400">/</span>
              <span className="text-sm text-gray-500">
                {car.model}
              </span>
            </div>
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <h1 className="text-3xl font-bold">
                {car.title || `${car.year} ${car.make} ${car.model}`}
              </h1>
              <div className="text-xl md:text-2xl font-semibold text-primary">
                {formatPrice(car.price)}
              </div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
                <div className="relative h-64 md:h-96 overflow-hidden">
                  <img 
                    src={activeImage} 
                    alt={car.title || `${car.year} ${car.make} ${car.model}`}
                    className="w-full h-full object-cover"
                  />
                  
                  {car.condition && (
                    <Badge
                      variant="default"
                      className={`absolute top-4 right-4 ${
                        car.condition === "Excellent"
                          ? "bg-green-600"
                          : car.condition === "Good"
                          ? "bg-blue-600"
                          : "bg-amber-600"
                      }`}
                    >
                      {car.condition} Condition
                    </Badge>
                  )}
                </div>
                
                <div className="p-4">
                  <div className="grid grid-cols-4 gap-2">
                    {carImages.map((img, idx) => (
                      <div 
                        key={idx}
                        className={`cursor-pointer border-2 rounded overflow-hidden ${
                          activeImage === img ? 'border-primary' : 'border-transparent'
                        }`}
                        onClick={() => setActiveImage(img)}
                      >
                        <img 
                          src={img} 
                          alt={`Car view ${idx + 1}`} 
                          className="w-full h-16 object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <Tabs defaultValue="overview">
                  <TabsList className="mb-6">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="features">Features</TabsTrigger>
                    <TabsTrigger value="history">History</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="overview" className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-3">Description</h3>
                      <p className="text-gray-700">
                        This {car.year} {car.make} {car.model} is in {car.condition?.toLowerCase() || 'good'} condition with {formatMileage(car.mileage)} miles.
                        It features a {car.transmission} transmission and {car.fuelType} engine.
                        The car has been well maintained and is ready for its next owner.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-3">Specifications</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="bg-gray-50 p-3 rounded">
                          <div className="text-xs text-gray-500">Year</div>
                          <div className="font-medium">{car.year}</div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded">
                          <div className="text-xs text-gray-500">Make</div>
                          <div className="font-medium">{car.make}</div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded">
                          <div className="text-xs text-gray-500">Model</div>
                          <div className="font-medium">{car.model}</div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded">
                          <div className="text-xs text-gray-500">Mileage</div>
                          <div className="font-medium">{formatMileage(car.mileage)} mi</div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded">
                          <div className="text-xs text-gray-500">Fuel Type</div>
                          <div className="font-medium">{car.fuelType}</div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded">
                          <div className="text-xs text-gray-500">Transmission</div>
                          <div className="font-medium">
                            {car.transmission?.charAt(0).toUpperCase() + car.transmission?.slice(1) || "N/A"}
                          </div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded">
                          <div className="text-xs text-gray-500">Body Type</div>
                          <div className="font-medium">Sedan</div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded">
                          <div className="text-xs text-gray-500">Exterior Color</div>
                          <div className="font-medium">Blue</div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded">
                          <div className="text-xs text-gray-500">Interior Color</div>
                          <div className="font-medium">Black</div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="features">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium mb-3">Vehicle Features</h3>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center">
                          <svg className="h-4 w-4 text-primary mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                          <span>Bluetooth</span>
                        </div>
                        <div className="flex items-center">
                          <svg className="h-4 w-4 text-primary mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                          <span>Backup Camera</span>
                        </div>
                        <div className="flex items-center">
                          <svg className="h-4 w-4 text-primary mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                          <span>Navigation System</span>
                        </div>
                        <div className="flex items-center">
                          <svg className="h-4 w-4 text-primary mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                          <span>Heated Seats</span>
                        </div>
                        <div className="flex items-center">
                          <svg className="h-4 w-4 text-primary mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                          <span>Sunroof</span>
                        </div>
                        <div className="flex items-center">
                          <svg className="h-4 w-4 text-primary mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                          <span>Lane Departure Warning</span>
                        </div>
                        <div className="flex items-center">
                          <svg className="h-4 w-4 text-primary mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                          <span>Apple CarPlay</span>
                        </div>
                        <div className="flex items-center">
                          <svg className="h-4 w-4 text-primary mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                          <span>Android Auto</span>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="history">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium mb-3">Vehicle History</h3>
                      
                      <div className="space-y-4">
                        <div className="bg-green-50 border border-green-200 rounded-md p-4 flex items-start">
                          <div className="mr-3 bg-green-100 rounded-full p-1">
                            <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                          </div>
                          <div>
                            <h4 className="font-medium">Clean Title</h4>
                            <p className="text-sm text-gray-600">This vehicle has a clean title history with no reported accidents or damage.</p>
                          </div>
                        </div>
                        
                        <div className="bg-blue-50 border border-blue-200 rounded-md p-4 flex items-start">
                          <div className="mr-3 bg-blue-100 rounded-full p-1">
                            <Info className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-medium">Service Records</h4>
                            <p className="text-sm text-gray-600">Complete maintenance history available. All scheduled services performed at authorized dealers.</p>
                          </div>
                        </div>
                        
                        <div className="border border-gray-200 rounded-md">
                          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                            <h4 className="font-medium">Owner History</h4>
                          </div>
                          <div className="p-4">
                            <div className="flex items-center mb-4">
                              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white mr-3">
                                1
                              </div>
                              <div>
                                <div className="font-medium">First Owner</div>
                                <div className="text-sm text-gray-600">2018-2021 • Personal Use</div>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 mr-3">
                                2
                              </div>
                              <div>
                                <div className="font-medium">Current Seller</div>
                                <div className="text-sm text-gray-600">2021-Present • Personal Use</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
            
            <div className="md:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 mb-6 sticky top-24">
                <h3 className="text-lg font-bold mb-4">Seller Information</h3>
                
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full mr-3 overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop"
                      alt="Seller" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-medium">John Smith</div>
                    <div className="text-sm text-gray-600">
                      {car.sellerType === 'dealer' ? 'Dealer' : 'Private Seller'}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-sm">
                    <MapPin className="h-4 w-4 text-gray-500 mr-2" />
                    <span>{car.location}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                    <span>Listed 2 weeks ago</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Info className="h-4 w-4 text-gray-500 mr-2" />
                    <span>ID: {car.id}</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Button 
                    className="w-full button-gradient text-white"
                    onClick={handleContactClick}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Contact Seller
                  </Button>
                  
                  <Button variant="outline" className="w-full">
                    Save to Favorites
                  </Button>
                  
                  <Button variant="outline" className="w-full">
                    Schedule Test Drive
                  </Button>
                </div>
              </div>
              
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium mb-2">Buyer Protection</h4>
                <p className="text-sm text-gray-600 mb-4">
                  All transactions on WheelsTrust are protected by our buyer guarantee.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center text-xs">
                    <svg className="h-4 w-4 text-primary mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Verified Sellers</span>
                  </div>
                  <div className="flex items-center text-xs">
                    <svg className="h-4 w-4 text-primary mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Secure Payments</span>
                  </div>
                  <div className="flex items-center text-xs">
                    <svg className="h-4 w-4 text-primary mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Vehicle History Reports</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
      
      {/* Contact Modal */}
      <Modal 
        isOpen={isContactModalOpen} 
        onClose={() => setIsContactModalOpen(false)} 
        title="Contact Seller"
      >
        <div className="space-y-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gray-200 rounded-full mr-3 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop"
                alt="Seller" 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="font-medium">John Smith</div>
              <div className="text-xs text-gray-600">Usually responds within 1 day</div>
            </div>
          </div>
          
          <div className="p-3 bg-gray-50 rounded-md">
            <span className="text-sm">
              Regarding: <strong>{car.year} {car.make} {car.model}</strong>
            </span>
          </div>
          
          <div>
            <label htmlFor="message" className="block text-sm font-medium mb-1">Message</label>
            <textarea 
              id="message"
              className="w-full border border-gray-300 rounded-md p-3 min-h-[120px] focus:ring-primary focus:border-primary"
              placeholder="Hi, I'm interested in your car. Is it still available?"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <Button 
              className="flex-1 button-gradient text-white"
              onClick={handleSubmitMessage}
              disabled={!message.trim()}
            >
              Send Message
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setIsContactModalOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default CarDetails;
