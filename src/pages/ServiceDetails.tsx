
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Star, MessageSquare, Calendar as CalendarIcon, User } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface ServiceData {
  id: string;
  name: string;
  provider: string;
  description: string;
  price: number;
  duration: string;
  rating: number;
  reviewCount: number;
  coverImage: string;
  images: string[];
  features: string[];
  location: {
    address: string;
    city: string;
    state: string;
    zip: string;
    lat: number;
    lng: number;
  };
  availability: { day: string; hours: string }[];
}

// In the mock data, ensure rating is a number
const serviceData: ServiceData = {
  id: "1",
  name: "Premium Car Detailing",
  provider: "AutoCare Express",
  description: "Our premium detailing service includes exterior wash, wax, interior cleaning, and protection treatments to keep your vehicle looking its best.",
  price: 149.99,
  duration: "3 hours",
  rating: 4.8, 
  reviewCount: 24,
  coverImage: "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&w=1200&h=600",
  images: [
    "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&w=800&h=600",
    "https://images.unsplash.com/photo-1635260107979-45760253f518?auto=format&fit=crop&w=800&h=600",
    "https://images.unsplash.com/photo-1676122565108-d642ae67b4c4?auto=format&fit=crop&w=800&h=600",
  ],
  features: [
    "Exterior hand wash and dry",
    "Paint decontamination",
    "High-quality wax application",
    "Interior vacuum and cleaning",
    "Dashboard and trim conditioning",
    "Tire and wheel detailing",
    "Window cleaning inside and out",
  ],
  location: {
    address: "123 Auto Avenue",
    city: "San Francisco",
    state: "CA",
    zip: "94107",
    lat: 37.7749,
    lng: -122.4194
  },
  availability: [
    { day: "Monday", hours: "9:00 AM - 5:00 PM" },
    { day: "Tuesday", hours: "9:00 AM - 5:00 PM" },
    { day: "Wednesday", hours: "9:00 AM - 5:00 PM" },
    { day: "Thursday", hours: "9:00 AM - 5:00 PM" },
    { day: "Friday", hours: "9:00 AM - 5:00 PM" },
    { day: "Saturday", hours: "10:00 AM - 4:00 PM" },
    { day: "Sunday", hours: "Closed" }
  ]
};

const ServiceDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated, openAuthModal } = useAuth();
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const { toast } = useToast();
  
  // In a real app, you would fetch this data based on the ID
  // For now, we'll just use our mock data
  
  const handleBookNow = () => {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }
    setIsBookingModalOpen(true);
  };
  
  const handleContactProvider = () => {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }
    setIsMessageModalOpen(true);
  };
  
  const handleBookingSubmit = () => {
    if (!selectedDate || !selectedTime) {
      toast({
        title: "Missing Information",
        description: "Please select both a date and time.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Booking Successful!",
      description: `Your appointment has been booked for ${selectedDate} at ${selectedTime}.`,
    });
    
    setIsBookingModalOpen(false);
    setSelectedDate("");
    setSelectedTime("");
  };
  
  const handleMessageSubmit = () => {
    if (!message.trim()) {
      toast({
        title: "Empty Message",
        description: "Please enter a message to send.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Message Sent",
      description: "Your message has been sent to the service provider.",
    });
    
    setIsMessageModalOpen(false);
    setMessage("");
  };
  
  // Available time slots
  const availableTimeSlots = [
    "09:00 AM", "10:00 AM", "11:00 AM", 
    "12:00 PM", "01:00 PM", "02:00 PM", 
    "03:00 PM", "04:00 PM"
  ];
  
  // Available dates (next 7 days)
  const availableDates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  });

  return (
    <>
      <Helmet>
        <title>{serviceData.name} | WheelsTrust</title>
      </Helmet>
      
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="relative rounded-lg overflow-hidden shadow-xl">
            <img 
              src={serviceData.coverImage} 
              alt={serviceData.name} 
              className="w-full h-80 object-cover object-center" 
            />
            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-gray-900 to-transparent p-6">
              <h1 className="text-3xl font-bold text-white">{serviceData.name}</h1>
              <div className="flex items-center text-yellow-400 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-5 w-5 ${i < Math.floor(serviceData.rating) ? '' : 'opacity-50'}`} />
                ))}
                <span className="text-white ml-2 text-sm">
                  {serviceData.rating} ({serviceData.reviewCount} reviews)
                </span>
              </div>
              <p className="text-gray-300">{serviceData.description}</p>
            </div>
          </div>
          
          {/* Details Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            {/* Gallery */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Gallery</h2>
              <div className="mb-4">
                <img 
                  src={serviceData.images[activeImageIndex]} 
                  alt={`Service ${activeImageIndex + 1}`} 
                  className="w-full h-80 object-cover rounded-lg shadow-md" 
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                {serviceData.images.map((image, index) => (
                  <img 
                    key={index} 
                    src={image} 
                    alt={`Service ${index + 1}`} 
                    onClick={() => setActiveImageIndex(index)}
                    className={`w-full h-24 object-cover rounded-lg shadow-md cursor-pointer ${
                      activeImageIndex === index ? 'ring-2 ring-primary' : ''
                    }`} 
                  />
                ))}
              </div>
            </div>
            
            {/* Features */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Key Features</h2>
              <ul className="list-disc list-inside text-gray-700">
                {serviceData.features.map((feature, index) => (
                  <li key={index} className="mb-2">{feature}</li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Provider Info */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Service Provider</h2>
            <div className="bg-gray-50 rounded-lg shadow-md p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-medium">{serviceData.provider}</h3>
                  <p className="text-gray-600 mb-2">
                    Professional auto care services since 2010.
                  </p>
                  <div className="flex items-center text-gray-700 mb-2">
                    <MapPin className="h-4 w-4 mr-2" />
                    {serviceData.location.address}, {serviceData.location.city}, {serviceData.location.state} {serviceData.location.zip}
                  </div>
                  <Link to="/about" className="text-primary hover:underline">
                    Learn more about {serviceData.provider}
                  </Link>
                </div>
                
                <Button 
                  variant="outline" 
                  onClick={handleContactProvider}
                  className="flex items-center"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Contact Provider
                </Button>
              </div>
            </div>
          </div>
          
          {/* Reviews and Availability Tabs */}
          <div className="mt-8">
            <Tabs defaultValue="availability">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="availability">Availability</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>
              
              <TabsContent value="availability" className="mt-4">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-medium mb-4">Service Hours</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {serviceData.availability.map((item, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center text-gray-700 mb-1">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span className="font-medium">{item.day}</span>
                        </div>
                        <div className="flex items-center text-gray-700">
                          <Clock className="h-4 w-4 mr-2" />
                          <span>{item.hours}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="reviews" className="mt-4">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-medium">Customer Reviews</h3>
                    <div className="flex items-center">
                      <div className="flex items-center text-yellow-400 mr-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-4 w-4 ${i < Math.floor(serviceData.rating) ? '' : 'opacity-50'}`} />
                        ))}
                      </div>
                      <span className="text-gray-700">
                        {serviceData.rating} ({serviceData.reviewCount} reviews)
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    {/* Sample reviews */}
                    <div className="border-b pb-4">
                      <div className="flex items-center mb-2">
                        <div className="w-10 h-10 rounded-full bg-gray-200 mr-3 flex items-center justify-center">
                          <User className="h-6 w-6 text-gray-500" />
                        </div>
                        <div>
                          <div className="font-medium">John D.</div>
                          <div className="text-gray-500 text-xs">1 week ago</div>
                        </div>
                      </div>
                      <div className="flex items-center text-yellow-400 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-3 w-3 ${i < 5 ? '' : 'opacity-50'}`} />
                        ))}
                      </div>
                      <p className="text-gray-700 text-sm">
                        Excellent service! My car looks brand new after the detailing. The team was very professional and thorough.
                      </p>
                    </div>
                    
                    <div className="border-b pb-4">
                      <div className="flex items-center mb-2">
                        <div className="w-10 h-10 rounded-full bg-gray-200 mr-3 flex items-center justify-center">
                          <User className="h-6 w-6 text-gray-500" />
                        </div>
                        <div>
                          <div className="font-medium">Sarah M.</div>
                          <div className="text-gray-500 text-xs">2 weeks ago</div>
                        </div>
                      </div>
                      <div className="flex items-center text-yellow-400 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-3 w-3 ${i < 4 ? '' : 'opacity-50'}`} />
                        ))}
                      </div>
                      <p className="text-gray-700 text-sm">
                        Good service overall. They took great care of the interior, though I would have liked a bit more attention to the wheels.
                      </p>
                    </div>
                    
                    <Button variant="outline" className="w-full">
                      View All {serviceData.reviewCount} Reviews
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Booking Section */}
          <div className="mt-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Book This Service</h2>
              <div className="flex items-center justify-between mb-4">
                <div className="text-2xl font-bold text-primary">
                  ${serviceData.price.toFixed(2)}
                </div>
                <div className="text-gray-600 flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {serviceData.duration}
                </div>
              </div>
              <Button 
                className="w-full"
                onClick={handleBookNow}
              >
                Book Appointment
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
      
      {/* Booking Modal */}
      <Dialog open={isBookingModalOpen} onOpenChange={setIsBookingModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Book Appointment</DialogTitle>
            <DialogDescription>
              Select a date and time for your {serviceData.name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Select Date</label>
              <div className="grid grid-cols-3 gap-2">
                {availableDates.map((date, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setSelectedDate(date)}
                    className={`p-2 text-sm rounded-md border ${
                      selectedDate === date 
                        ? 'border-primary bg-primary/10' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {date}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Select Time</label>
              <div className="grid grid-cols-4 gap-2">
                {availableTimeSlots.map((time, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setSelectedTime(time)}
                    className={`p-2 text-sm rounded-md border ${
                      selectedTime === time 
                        ? 'border-primary bg-primary/10' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="bg-gray-50 p-3 rounded-md">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Service</span>
                <span className="font-medium">{serviceData.name}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Duration</span>
                <span>{serviceData.duration}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span className="text-primary">${serviceData.price.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleBookingSubmit}>Confirm Booking</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Message Modal */}
      <Dialog open={isMessageModalOpen} onOpenChange={setIsMessageModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Contact Service Provider</DialogTitle>
            <DialogDescription>
              Send a message to {serviceData.provider}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Your Message</label>
              <textarea 
                className="w-full border border-gray-300 rounded-md p-2 min-h-[120px]"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter your message here..."
              />
            </div>
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleMessageSubmit}>Send Message</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ServiceDetails;
