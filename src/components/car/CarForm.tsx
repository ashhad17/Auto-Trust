
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Car, ChevronDown, Plus, Upload, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import axios from 'axios';
import AuthModal from "@/components/auth/AuthModal";
const makes = ["Toyota", "Honda", "Ford", "Chevrolet", "BMW", "Mercedes-Benz", "Audi", "Nissan", "Hyundai", "Kia"];

const uploadToCloudinary = async (file: File): Promise<{ url: string; publicId: string }> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'auto_trust'); // Your upload preset here

  try {
    const response = await axios.post('https://api.cloudinary.com/v1_1/dquspyuhw/upload', formData);

    // Axios automatically parses the response, so you can directly access `data`
    const { secure_url, public_id } = response.data;

    return {
      url: secure_url,
      publicId: public_id,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error uploading to Cloudinary:', error.response?.data || error.message);
    } else {
      console.error('Unexpected error uploading to Cloudinary:', error);
    }
    throw new Error('An error occurred while uploading the file to Cloudinary.');
  }
};


const CarForm = () => {
  
  const [activeTab, setActiveTab] = useState("sell-form");
  const [currentStep, setCurrentStep] = useState(1);
  const { toast } = useToast();
  const { isAuthenticated, openAuthModal } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    make: "",
    model: "",
    year: "",
    mileage: "",
    price: "",
    description: "",
    condition: "Good",
    exteriorColor: "",
    interiorColor: "",
    fuelType: "Gasoline",
    transmission: "Automatic",
    bodyType: "Sedan",
    features: [] as string[],
    images: [] as (string | File)[],
    contactName: "",
    contactPhone: "",
    contactEmail: "",
    location: "",
    rcDocument: null as File | null,
    insuranceDocument: null as File | null,
    pucDocument: null as File | null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDocumentUpload = (name: string, file: File) => {
    setFormData({ ...formData, [name]: file });
  };

  const handleRemoveDocument = (name: string) => {
    setFormData({ ...formData, [name]: null });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleAddImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newImages = [...formData.images];
      for (let i = 0; i < e.target.files.length; i++) {
        newImages.push(e.target.files[i]);
      }
      setFormData({ ...formData, images: newImages });
    }
  };
  
  const handleRemoveImage = (index: number) => {
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    setFormData({ ...formData, images: newImages });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Upload images to Cloudinary
      const imageUploads = formData.images.map(async (image) => {
        if (typeof image === 'string') {
          // Skip if it's already a URL (demo placeholder)
          return { url: image, publicId: `demo-${Date.now()}` };
        }
        
        // Upload the actual file
        return await uploadToCloudinary(image);
      });

      // Upload documents to Cloudinary
      const documentUploads = [];
      
      if (formData.rcDocument) {
        documentUploads.push(uploadToCloudinary(formData.rcDocument)
          .then(result => ({ type: 'rcDocument', ...result })));
      }
      
      if (formData.insuranceDocument) {
        documentUploads.push(uploadToCloudinary(formData.insuranceDocument)
          .then(result => ({ type: 'insuranceDocument', ...result })));
      }
      
      if (formData.pucDocument) {
        documentUploads.push(uploadToCloudinary(formData.pucDocument)
          .then(result => ({ type: 'pucDocument', ...result })));
      }

      // Wait for all uploads to complete
      const [uploadedImages, ...uploadedDocuments] = await Promise.all([
        Promise.all(imageUploads),
        ...documentUploads,
      ]);

      // Prepare the data for backend
      const carData = {
        title: `${formData.year} ${formData.make} ${formData.model}`,
        make: formData.make,
        model: formData.model,
        year: formData.year,
        mileage: formData.mileage,
        price: formData.price,
        description: formData.description,
        condition: formData.condition,
        exteriorColor: formData.exteriorColor,
        interiorColor: formData.interiorColor,
        fuelType: formData.fuelType,
        transmission: formData.transmission,
        bodyType: formData.bodyType,
        features: formData.features,
        images: uploadedImages,
        contactName: formData.contactName,
        contactPhone: formData.contactPhone,
        contactEmail: formData.contactEmail,
        location: formData.location,
        rcDocument: uploadedDocuments.find(doc => doc?.type === 'rcDocument') || null,
        insuranceDocument: uploadedDocuments.find(doc => doc?.type === 'insuranceDocument') || null,
        pucDocument: uploadedDocuments.find(doc => doc?.type === 'pucDocument') || null,
        status: 'active',
      };
console.log("Car Data "+carData);
      // Send to your backend API
      const response = await fetch('http://localhost:5000/api/v1/cars', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(carData),
      });

      if (!response.ok) {
        throw new Error('Failed to create listing');
      }

      // Success
      toast({
        title: "Listing Created!",
        description: "Your vehicle listing has been submitted successfully.",
      });
      
      setCurrentStep(4);
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Error",
        description: "There was an error submitting your listing. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const features = [
    "Bluetooth", "Backup Camera", "Navigation", "Heated Seats", 
    "Sunroof", "Leather Seats", "Apple CarPlay", "Android Auto",
    "Blind Spot Monitor", "Lane Departure Warning", "Cruise Control",
    "Remote Start", "Keyless Entry", "Premium Audio", "Third Row Seating"
  ];
  
  const handleFeatureToggle = (feature: string) => {
    const newFeatures = formData.features.includes(feature) 
      ? formData.features.filter(f => f !== feature) 
      : [...formData.features, feature];
      
    setFormData({ ...formData, features: newFeatures });
  };
  
  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };
  
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Vehicle Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Make*</label>
                <Select 
                  value={formData.make} 
                  onValueChange={(value) => handleSelectChange("make", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select make" />
                  </SelectTrigger>
                  <SelectContent>
                    {makes.map((make) => (
                      <SelectItem key={make} value={make}>{make}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Model*</label>
                <Input
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  placeholder="e.g. Camry"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Year*</label>
                <Input
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  placeholder="e.g. 2020"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Mileage*</label>
                <Input
                  name="mileage"
                  value={formData.mileage}
                  onChange={handleChange}
                  placeholder="e.g. 35000"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Exterior Color</label>
                <Input
                  name="exteriorColor"
                  value={formData.exteriorColor}
                  onChange={handleChange}
                  placeholder="e.g. Blue"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Interior Color</label>
                <Input
                  name="interiorColor"
                  value={formData.interiorColor}
                  onChange={handleChange}
                  placeholder="e.g. Black"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Fuel Type</label>
                <Select 
                  value={formData.fuelType} 
                  onValueChange={(value) => handleSelectChange("fuelType", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select fuel type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Gasoline">Gasoline</SelectItem>
                    <SelectItem value="Diesel">Diesel</SelectItem>
                    <SelectItem value="Hybrid">Hybrid</SelectItem>
                    <SelectItem value="Electric">Electric</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Transmission</label>
                <Select 
                  value={formData.transmission} 
                  onValueChange={(value) => handleSelectChange("transmission", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select transmission" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Automatic">Automatic</SelectItem>
                    <SelectItem value="Manual">Manual</SelectItem>
                    <SelectItem value="CVT">CVT</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Body Type</label>
                <Select 
                  value={formData.bodyType} 
                  onValueChange={(value) => handleSelectChange("bodyType", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select body type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sedan">Sedan</SelectItem>
                    <SelectItem value="SUV">SUV</SelectItem>
                    <SelectItem value="Truck">Truck</SelectItem>
                    <SelectItem value="Coupe">Coupe</SelectItem>
                    <SelectItem value="Hatchback">Hatchback</SelectItem>
                    <SelectItem value="Convertible">Convertible</SelectItem>
                    <SelectItem value="Wagon">Wagon</SelectItem>
                    <SelectItem value="Van">Van</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Condition</label>
                <Select 
                  value={formData.condition} 
                  onValueChange={(value) => handleSelectChange("condition", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Excellent">Excellent</SelectItem>
                    <SelectItem value="Good">Good</SelectItem>
                    <SelectItem value="Fair">Fair</SelectItem>
                    <SelectItem value="Poor">Poor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="col-span-1 md:col-span-2 lg:col-span-3 space-y-2">
                <label className="text-sm font-medium">Price ($)*</label>
                <Input
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="e.g. 25000"
                />
              </div>
              
              <div className="col-span-1 md:col-span-2 lg:col-span-3 space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your vehicle condition, history, and any other important details..."
                  className="min-h-[150px]"
                />
              </div>
            </div>
            
            <div className="pt-4 flex justify-end">
              <Button onClick={nextStep}>
                Next Step
              </Button>
            </div>
          </div>
        );
     
      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Vehicle Photos, Features & Documents</h3>
            
            {/* <div className="space-y-4">
              <label className="text-sm font-medium">Photos</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {formData.images.map((img, index) => (
                  <div key={index} className="relative aspect-square bg-gray-100 rounded-md overflow-hidden">
                    <img 
                      src={img} 
                      alt={`Car photo ${index + 1}`} 
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={handleAddImage}
                  className="flex flex-col items-center justify-center aspect-square bg-gray-100 border-2 border-dashed border-gray-300 rounded-md hover:bg-gray-50"
                >
                  <Upload className="h-8 w-8 text-gray-400 mb-1" />
                  <span className="text-sm text-gray-500">Add Photo</span>
                </button>
              </div>
              <p className="text-xs text-gray-500">Upload up to 10 photos. First photo will be used as the main image.</p>
            </div> */}
            {
    /* Photos section in step 2 */
    <div className="space-y-4">
      <label className="text-sm font-medium">Photos</label>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {formData.images.map((img, index) => {
          const imgSrc = typeof img === 'string' ? img : URL.createObjectURL(img);
          return (
            <div key={index} className="relative aspect-square bg-gray-100 rounded-md overflow-hidden">
              <img 
                src={imgSrc} 
                alt={`Car photo ${index + 1}`} 
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          );
        })}
        
        <label className="flex flex-col items-center justify-center aspect-square bg-gray-100 border-2 border-dashed border-gray-300 rounded-md hover:border-gray-400 cursor-pointer">
          <Upload className="h-8 w-8 text-gray-400 mb-1" />
          <span className="text-sm text-gray-500">Add Photo</span>
          <input
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleAddImage}
          />
        </label>
      </div>
      <p className="text-xs text-gray-500">Upload up to 10 photos. First photo will be used as the main image.</p>
    </div>
  }


            {/* New Documents Upload Section */}
            <div className="space-y-4">
              <label className="text-sm font-medium">Vehicle Documents</label>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* RC Document Upload */}
                <div className="border rounded-md p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">RC Document</span>
                    {formData.rcDocument && (
                      <button
                        type="button"
                        onClick={() => handleRemoveDocument("rcDocument")}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  {formData.rcDocument ? (
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="h-5 w-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {formData.rcDocument.name}
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md p-4 hover:border-gray-400 cursor-pointer">
                      <Upload className="h-6 w-6 text-gray-400 mb-1" />
                      <span className="text-sm text-gray-500">Upload RC</span>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="hidden"
                        onChange={(e) => e.target.files && handleDocumentUpload("rcDocument", e.target.files[0])}
                      />
                    </label>
                  )}
                </div>
                
                {/* Insurance Document Upload */}
                <div className="border rounded-md p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Insurance</span>
                    {formData.insuranceDocument && (
                      <button
                        type="button"
                        onClick={() => handleRemoveDocument("insuranceDocument")}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  {formData.insuranceDocument ? (
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="h-5 w-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {formData.insuranceDocument.name}
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md p-4 hover:border-gray-400 cursor-pointer">
                      <Upload className="h-6 w-6 text-gray-400 mb-1" />
                      <span className="text-sm text-gray-500">Upload Insurance</span>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="hidden"
                        onChange={(e) => e.target.files && handleDocumentUpload("insuranceDocument", e.target.files[0])}
                      />
                    </label>
                  )}
                </div>
                
                {/* PUC Document Upload */}
                <div className="border rounded-md p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">PUC Certificate</span>
                    {formData.pucDocument && (
                      <button
                        type="button"
                        onClick={() => handleRemoveDocument("pucDocument")}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  {formData.pucDocument ? (
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="h-5 w-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {formData.pucDocument.name}
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md p-4 hover:border-gray-400 cursor-pointer">
                      <Upload className="h-6 w-6 text-gray-400 mb-1" />
                      <span className="text-sm text-gray-500">Upload PUC</span>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="hidden"
                        onChange={(e) => e.target.files && handleDocumentUpload("pucDocument", e.target.files[0])}
                      />
                    </label>
                  )}
                </div>
              </div>
              <p className="text-xs text-gray-500">Upload clear scans or photos of your vehicle documents (PDF, JPG, PNG).</p>
            </div>
            
            {/* Features section remains the same */}
            <div className="space-y-4">
              <label className="text-sm font-medium">Features</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {features.map((feature) => (
                  <div 
                    key={feature}
                    onClick={() => handleFeatureToggle(feature)}
                    className={`px-3 py-2 rounded-md cursor-pointer border text-sm ${
                      formData.features.includes(feature) 
                        ? 'bg-primary/10 border-primary text-primary' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center">
                      {formData.features.includes(feature) && (
                        <svg className="h-4 w-4 mr-1.5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                      {feature}
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500">Select all features that apply to your vehicle.</p>
            </div>
            
            <div className="pt-4 flex justify-between">
              <Button variant="outline" onClick={prevStep}>
                Previous Step
              </Button>
              <Button onClick={nextStep}>
                Next Step
              </Button>
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Contact Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Your Name*</label>
                <Input
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleChange}
                  placeholder="Full name"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Phone Number*</label>
                <Input
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleChange}
                  placeholder="e.g. (123) 456-7890"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Email Address*</label>
                <Input
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleChange}
                  type="email"
                  placeholder="e.g. your.email@example.com"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Location*</label>
                <Input
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. San Francisco, CA"
                />
              </div>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <div className="flex">
                <Info className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-blue-800 mb-1">Privacy Note</h4>
                  <p className="text-sm text-blue-700">
                    Your contact information will be visible to potential buyers. We recommend using a phone number you're comfortable sharing.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="pt-4 flex justify-between">
              <Button variant="outline" onClick={prevStep}>
                Previous Step
              </Button>
              <Button onClick={handleSubmit} disabled={isSubmitting}>
    {isSubmitting ? "Submitting..." : "Submit Listing"}
  </Button>
            </div>
          </div>
        );
        
      case 4:
        return (
          <div className="text-center py-8">
            <div className="bg-green-100 text-green-800 rounded-full mx-auto w-16 h-16 flex items-center justify-center mb-6">
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-2">Listing Submitted!</h3>
            <p className="text-gray-600 mb-6 max-w-lg mx-auto">
              Your vehicle listing has been submitted successfully. Our team will review it shortly, and it will be live on our marketplace soon.
            </p>
            <div className="space-y-3">
              <Link to="/profile">
                <Button className="w-full sm:w-auto">
                  View My Listings
                </Button>
              </Link>
              <div className="block sm:inline-block sm:ml-3">
                <Link to="/cars/buy">
                  <Button variant="outline" className="w-full sm:w-auto">
                    Browse Cars
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <>
     
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          
                  <div className="p-6">
                    <form>
                      {renderStep()}
                    </form>
                  </div>
          </div>
      </main>
      <AuthModal />
      <Footer />
    </>
  );
};

export default CarForm;
