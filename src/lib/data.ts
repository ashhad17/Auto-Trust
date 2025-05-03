export interface CarType {
  id: string;
  title: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  condition: string;
  location: string;
  description: string;
  images: string[];
  seller: string;
  features: string[];
  status: string;
  color: string;
  image: string;
  rating: number;
  reviewCount: number;
  fuelType: string;
  transmission: string;
  sellerType: string;
}

export interface ServiceType {
  id: string;
  name: string;
  description: string;
  price: string;
  duration: string;
  category: string;
  status: string;
  provider: {
    id: string;
    name: string;
    rating: number;
    reviewCount: number;
  };
  image: string;
  rating: number;
}

export interface ServiceProviderType {
  id: number;
  name: string;
  image: string;
  location: string;
  rating: number;
  reviewCount: number;
  specialties: string[];
  description: string;
  verified?: boolean;
}

export const cars: CarType[] = [
  {
    id: "1",
    title: "Toyota Camry 2021",
    make: "Toyota",
    model: "Camry",
    year: 2021,
    price: 24500,
    mileage: 34000,
    condition: "Excellent",
    location: "New York, NY",
    description:
      "Reliable and fuel-efficient sedan, perfect for daily commutes.",
    images: [],
    seller: "John Doe",
    features: ["Automatic", "Bluetooth", "Backup Camera"],
    status: "",
    color: "Silver",
    image: "/placeholder.svg",
    rating: 4.5,
    reviewCount: 50,
    fuelType: "Gasoline",
    transmission: "automatic",
    sellerType: "dealer",
  },
  {
    id: "2",
    title: "Honda Civic 2022",
    make: "Honda",
    model: "Civic",
    year: 2022,
    price: 22000,
    mileage: 22000,
    condition: "Excellent",
    location: "Los Angeles, CA",
    description: "Compact and sporty, great for city driving.",
    images: [],
    seller: "Jane Smith",
    features: ["Sunroof", "Alloy Wheels", "Apple CarPlay"],
    status: "",
    color: "Blue",
    image: "/placeholder.svg",
    rating: 4.7,
    reviewCount: 75,
    fuelType: "Gasoline",
    transmission: "automatic",
    sellerType: "private",
  },
  {
    id: "3",
    title: "Ford F-150 2020",
    make: "Ford",
    model: "F-150",
    year: 2020,
    price: 32000,
    mileage: 45000,
    condition: "Good",
    location: "Chicago, IL",
    description: "Powerful and versatile truck, ready for any job.",
    images: [],
    seller: "Mike Johnson",
    features: ["4x4", "Towing Package", "Crew Cab"],
    status: "",
    color: "White",
    image: "/placeholder.svg",
    rating: 4.3,
    reviewCount: 60,
    fuelType: "Diesel",
    transmission: "manual",
    sellerType: "dealer",
  },
  {
    id: "4",
    title: "Tesla Model 3 2023",
    make: "Tesla",
    model: "Model 3",
    year: 2023,
    price: 45000,
    mileage: 15000,
    condition: "Excellent",
    location: "Houston, TX",
    description: "Electric and eco-friendly, with advanced technology.",
    images: [],
    seller: "Emily Brown",
    features: ["Autopilot", "Premium Interior", "Long Range"],
    status: "",
    color: "Red",
    image: "/placeholder.svg",
    rating: 4.9,
    reviewCount: 90,
    fuelType: "Electric",
    transmission: "automatic",
    sellerType: "dealer",
  },
];

export const features = [
  {
    title: "Extensive Vehicle Database",
    description:
      "Browse through thousands of listings with detailed information and verified history reports.",
    icon: "search",
  },
  {
    title: "Transparent Seller Information",
    description:
      "View seller ratings, reviews, and transaction history for confident buying and selling.",
    icon: "info",
  },
  {
    title: "Advanced Search Filters",
    description:
      "Narrow down your options with precise search filters for make, model, year, price, and more.",
    icon: "settings",
  },
  {
    title: "User-Friendly Dashboard",
    description:
      "Manage your listings, track your favorite vehicles, and communicate with sellers in one central location.",
    icon: "dashboard",
  },
];

export const testimonials = [
  {
    name: "Alice Johnson",
    title: "Happy Car Buyer",
    quote:
      "I found my dream car on WheelsTrust! The transparent seller information and detailed vehicle history gave me the confidence to make a great purchase.",
    image: "/placeholder.svg",
    rating: 5,
  },
  {
    name: "Bob Williams",
    title: "Satisfied Seller",
    quote:
      "Selling my car on WheelsTrust was a breeze. The platform is user-friendly, and I quickly found a buyer at a fair price.",
    image: "/placeholder.svg",
    rating: 4,
  },
  {
    name: "Charlie Brown",
    title: "First Time Car Owner",
    quote:
      "As a first-time car owner, I was nervous about the buying process. WheelsTrust provided all the information and support I needed to make an informed decision.",
    image: "/placeholder.svg",
    rating: 5,
  },
];

export const serviceProviders: ServiceProviderType[] = [
  {
    id: 1,
    name: "Premium Auto Care",
    image: "/placeholder.svg",
    location: "New York, NY",
    rating: 4.9,
    reviewCount: 120,
    specialties: ["Maintenance", "Repairs", "Diagnostics"],
    description:
      "Premium Auto Care offers comprehensive vehicle maintenance and repair services with certified mechanics and state-of-the-art equipment.",
    verified: true,
  },
  {
    id: 2,
    name: "Elite Automotive Solutions",
    image: "/placeholder.svg",
    location: "Los Angeles, CA",
    rating: 4.8,
    reviewCount: 95,
    specialties: ["Performance Upgrades", "Custom Work", "Electrical Systems"],
    description:
      "Specializing in performance enhancements and custom automotive solutions, Elite Automotive provides expert service for enthusiasts and everyday drivers alike.",
    verified: true,
  },
  {
    id: 3,
    name: "Trusty Mechanics",
    image: "/placeholder.svg",
    location: "Chicago, IL",
    rating: 4.7,
    reviewCount: 88,
    specialties: ["Engine Repair", "Transmission Service", "Brake Systems"],
    description:
      "Family-owned business with over 25 years of experience providing honest, reliable mechanical repairs at fair prices.",
    verified: false,
  },
  {
    id: 4,
    name: "Precision Auto Inspection",
    image: "/placeholder.svg",
    location: "Houston, TX",
    rating: 4.9,
    reviewCount: 105,
    specialties: ["Pre-purchase Inspection", "Safety Checks", "Diagnostics"],
    description:
      "Our detailed inspection services help buyers make informed decisions and ensure vehicles are in top condition before purchase.",
    verified: true,
  },
];

export const services: ServiceType[] = [
  {
    id: "1",
    name: "Vehicle Inspection",
    description: "Comprehensive pre-purchase inspection with detailed report",
    price: "$149",
    duration: "2 hours",
    category: "Inspection",
    status: "Completed",
    provider: {
      id: "4",
      name: "Precision Auto Inspection",
      rating: 4.9,
      reviewCount: 105,
    },
    image: "/placeholder.svg",
    rating: 4.9,
  },
  {
    id: "2",
    name: "Regular Maintenance",
    description: "Oil change, filter replacement, and safety check",
    price: "$89",
    duration: "1 hour",
    category: "Maintenance",
    status: "Completed",
    provider: {
      id: "1",
      name: "Premium Auto Care",
      rating: 4.9,
      reviewCount: 120,
    },
    image: "/placeholder.svg",
    rating: 4.8,
  },
  {
    id: "3",
    name: "Performance Tuning",
    description: "Engine tuning and performance optimization",
    price: "$299",
    duration: "3 hours",
    category: "Performance",
    status: "Completed",
    provider: {
      id: "2",
      name: "Elite Automotive Solutions",
      rating: 4.7,
      reviewCount: 95,
    },
    image: "/placeholder.svg",
    rating: 4.7,
  },
  {
    id: "4",
    name: "Brake System Service",
    description: "Complete brake inspection and pad replacement",
    price: "$189",
    duration: "2 hours",
    category: "Repair",
    status: "Completed",
    provider: {
      id: "3",
      name: "Trusty Mechanics",
      rating: 4.7,
      reviewCount: 88,
    },
    image: "/placeholder.svg",
    rating: 4.8,
  },
];
