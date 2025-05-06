import React, { useState,useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Edit, Eye, Plus, Trash, Car } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
//how do i make it to get data from backend and display real data in component
import axios from "axios";
import { CarFormModal } from "./CarFormModal";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  id: string;
  // add more fields if needed
}

const getUserIdFromToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const decoded = jwtDecode<JwtPayload>(token);
    console.log(decoded.id);
    return decoded.id;
  } catch (error) {
    console.error("Invalid token", error);
    return null;
  }
};

interface CarListing {
  id: string;
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

const CarListingManagement: React.FC = () => {
  const [listings, setListings] = useState<CarListing[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editListing, setEditListing] = useState<CarListing | null>(null);
  const { toast } = useToast();

  const statusColors: Record<string, string> = {
    active: "bg-green-100 text-green-800",
    sold: "bg-blue-100 text-blue-800",
    pending: "bg-yellow-100 text-yellow-800",
    draft: "bg-gray-100 text-gray-800"
  };
  useEffect(() => {
    
  
    fetchListings();
  }, []);
  
  // const handleAddListing = (newListing: Partial<CarListing>) => {
  //   const listing: CarListing = {
  //     id: Date.now().toString(),
  //     title: `${newListing.year} ${newListing.make} ${newListing.model}`,
  //     year: newListing.year || "",
  //     make: newListing.make || "",
  //     model: newListing.model || "",
  //     price: newListing.price || "",
  //     mileage: newListing.mileage || "",
  //     description: newListing.description || "",
  //     condition: newListing.condition as "Excellent" | "Good" | "Fair" | "Poor" || "Good",
  //     location: newListing.location || "",
  //     status: "pending",
  //     images: newListing.images || []
  //   };

  //   setListings([...listings, listing]);
  //   setIsAddDialogOpen(false);
    
  //   toast({
  //     title: "Listing Created",
  //     description: "Your car listing has been created successfully."
  //   });
  // };

  // const handleEditListing = (updatedListing: CarListing) => {
  //   setListings(listings.map(listing => 
  //     listing.id === updatedListing.id ? updatedListing : listing
  //   ));
  //   setEditListing(null);
    
  //   toast({
  //     title: "Listing Updated",
  //     description: "Your car listing has been updated successfully."
  //   });
  // };

  // const handleDeleteListing = (id: string) => {
  //   setListings(listings.filter(listing => listing.id !== id));
    
  //   toast({
  //     title: "Listing Deleted",
  //     description: "The car listing has been deleted successfully."
  //   });
  // };
  const fetchListings = async () => {
    try {
      const userId = getUserIdFromToken();
      console.log(userId);
      const response =
      await axios.get(
        `http://localhost:5000/api/v1/cars/seller/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // <<<< Add this line
          },
        }
      );
      // replace with your real API endpoint
      const normalizedData = response.data.data.map((item: any) => ({
        ...item,
        id: item._id, // normalize MongoDB _id
      }));

      setListings(normalizedData);
    } catch (error) {
      console.error("Error fetching listings:", error);
      toast({
        title: "Failed to load listings",
        description: "Please check your connection or try again later.",
        variant: "destructive",
      });
    }
  };
  const getToken = () => localStorage.getItem("token");

const handleAddListing = async (newListing: CarListing) => {
  const token = getToken();
  try {
    await axios.post("http://localhost:5000/api/v1/cars", newListing, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    toast({ title: "Listing added successfully." });
    setIsAddDialogOpen(false);
    fetchListings(); // refresh data
  } catch (error) {
    toast({ title: "Failed to add listing", variant: "destructive" });
  }
};

const handleEditListing = async (updatedListing: CarListing) => {
  const token = getToken();
  try {
    await axios.put(
      `http://localhost:5000/api/v1/cars/${updatedListing.id}`,
      updatedListing,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    toast({ title: "Listing updated." });
    setEditListing(null);
    fetchListings(); // refresh data
  } catch (error) {
    toast({ title: "Failed to update", variant: "destructive" });
  }
};

const handleDeleteListing = async (id: string) => {
  const token = getToken();
  try {
    await axios.delete(`http://localhost:5000/api/v1/cars/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    toast({ title: "Listing deleted." });
    fetchListings(); // refresh data
  } catch (error) {
    toast({ title: "Failed to delete", variant: "destructive" });
  }
};

const handleStatusChange = (id: string, status: CarListing["status"]) => {
  setListings(
    listings.map((listing) =>
      listing.id === id ? { ...listing, status } : listing
    )
  );

  toast({
    title: "Status Updated",
    description: `Listing status has been changed to ${status}.`,
  });
};

  // Form component for add/edit
  const ListingForm = ({ initialData, onSave, onCancel }: { 
    initialData?: Partial<CarListing>, 
    onSave: (data: Partial<CarListing>) => void,
    onCancel: () => void
  }) => {
    const [formData, setFormData] = useState<Partial<CarListing>>(initialData || {
      year: "",
      make: "",
      model: "",
      price: "",
      mileage: "",
      description: "",
      condition: "Good",
      location: "",
      images: []
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    };

    const handleSelectChange = (name: string, value: string) => {
      if (name === "condition") {
        setFormData({ 
          ...formData, 
          [name]: value as "Excellent" | "Good" | "Fair" | "Poor" 
        });
      } else {
        setFormData({ ...formData, [name]: value });
      }
    };

    const handleImageAdd = () => {
      // This would normally open a file picker or URL input
      // For demo purposes, we'll just add a placeholder image URL
      const images = formData.images || [];
      setFormData({ 
        ...formData, 
        images: [...images, {url: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=300&h=200", publicId: "123"}] 
      });
      
      toast({
        title: "Image Added",
        description: "Sample image has been added to the listing."
      });
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!formData.year || !formData.make || !formData.model || !formData.price) {
        toast({
          title: "Missing Fields",
          description: "Please fill in all required fields.",
          variant: "destructive"
        });
        return;
      }
      
      onSave(formData);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Year*</label>
            <Input 
              name="year"
              value={formData.year}
              onChange={handleChange}
              placeholder="e.g. 2021"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Make*</label>
            <Input 
              name="make"
              value={formData.make}
              onChange={handleChange}
              placeholder="e.g. Toyota"
            />
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
            <label className="text-sm font-medium">Price ($)*</label>
            <Input 
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="e.g. 25000"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Mileage</label>
            <Input 
              name="mileage"
              value={formData.mileage}
              onChange={handleChange}
              placeholder="e.g. 15000"
            />
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
          <div className="md:col-span-3 space-y-2">
            <label className="text-sm font-medium">Location</label>
            <Input 
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. San Francisco, CA"
            />
          </div>
          <div className="md:col-span-3 space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the vehicle..."
              rows={3}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">Images</label>
            <Button type="button" variant="outline" size="sm" onClick={handleImageAdd}>
              <Plus className="h-4 w-4 mr-1" /> Add Image
            </Button>
          </div>
          {formData.images && formData.images.length > 0 ? (
            <div className="flex gap-2 flex-wrap">
              {formData.images.map((img, index) => (
                <div key={index} className="relative w-20 h-20 bg-gray-100 rounded overflow-hidden">
                  <img src={img.url} alt={`Car ${index + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No images added yet</p>
          )}
        </div>
        
        <div className="flex gap-2 justify-end pt-4 border-t">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {initialData?.id ? 'Update Listing' : 'Create Listing'}
          </Button>
        </div>
      </form>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Car Listings</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            {/* <Button>
              <Plus className="h-4 w-4 mr-2" /> Add Listing
            </Button> */}
          </DialogTrigger>
          <DialogContent className="sm:max-w-[800px]">
            <DialogHeader>
              <DialogTitle>Add New Car Listing</DialogTitle>
              <DialogDescription>
                Create a new car listing to sell a vehicle.
              </DialogDescription>
            </DialogHeader>
            <ListingForm 
              onSave={handleAddListing} 
              onCancel={() => setIsAddDialogOpen(false)} 
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit listing dialog */}
      <Dialog open={!!editListing} onOpenChange={(open) => !open && setEditListing(null)}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Edit Car Listing</DialogTitle>
            <DialogDescription>
              Update your car listing details.
            </DialogDescription>
          </DialogHeader>
          {editListing && (
            <ListingForm 
              initialData={editListing} 
              onSave={handleEditListing} 
              onCancel={() => setEditListing(null)} 
            />
          )}
        </DialogContent>
      </Dialog>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Listings</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="sold">Sold</TabsTrigger>
          <TabsTrigger value="draft">Drafts</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          <div className="grid grid-cols-1 gap-4">
            {listings.map((listing) => (
              <Card key={listing.id}>
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/4 h-48 md:h-auto bg-gray-100">
                      {listing.images && listing.images.length > 0 ? (
                        console.log(listing.images[0].url),
                        <img 
                        //can you fix this error

                          src={listing.images[0].url} 
                          alt={listing.title} 
                          className="w-full h-full object-cover"
                        />

                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          No Image
                        </div>
                      )}
                    </div>
                    <div className="md:w-3/4 p-6">
                      <div className="flex justify-between mb-2">
                        <h3 className="text-xl font-semibold">{listing.title}</h3>
                        <Badge className={statusColors[listing.status]}>
                          {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-500">Price</p>
                          <p className="font-medium">${Number(listing.price).toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Mileage</p>
                          <p className="font-medium">{Number(listing.mileage).toLocaleString()} mi</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Condition</p>
                          <p className="font-medium">{listing.condition}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Location</p>
                          <p className="font-medium">{listing.location}</p>
                        </div>
                      </div>
                      <p className="text-gray-700 mb-4 line-clamp-2">{listing.description}</p>
                      <div className="flex flex-wrap gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/cars/details/${listing.id}`}>
                            <Eye className="h-4 w-4 mr-1" /> View
                          </Link>
                        </Button>
                        {/* <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setEditListing(listing)}
                        >
                          <Edit className="h-4 w-4 mr-1" /> Edit
                        </Button> */}
                        
                        {/* <Button onClick={() => setIsModalOpen(true)}>
                        <Edit className="h-4 w-4 mr-1" /> Edit
                          <CarFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
                        </Button> */}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm" className="text-destructive border-destructive">
                              <Trash className="h-4 w-4 mr-1" /> Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently delete the listing for "{listing.title}". This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDeleteListing(listing.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                        
                        {/* {listing.status !== "sold" && (
                          <Select 
                            value={listing.status} 
                            onValueChange={(value) => handleStatusChange(listing.id, value as CarListing['status'])}
                          >
                            <SelectTrigger className="h-9 w-32">
                              <SelectValue placeholder="Change Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="sold">Sold</SelectItem>
                              <SelectItem value="draft">Draft</SelectItem>
                            </SelectContent>
                          </Select>
                        )} */}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {listings.length === 0 && (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <Car className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-1">No Listings Yet</h3>
                <p className="text-gray-500 mb-4">You haven't created any car listings yet.</p>
                <Button onClick={() => setIsAddDialogOpen(true)}>Create Your First Listing</Button>
              </div>
            )}
          </div>
        </TabsContent>
        
        {/* Other tabs would filter the listings by status */}
        {["active", "pending", "sold", "draft"].map((status) => (
          <TabsContent key={status} value={status} className="mt-4">
            <div className="grid grid-cols-1 gap-4">
              {listings.filter(listing => listing.status === status).length > 0 ? (
                listings
                  .filter(listing => listing.status === status)
                  .map((listing) => (
                    <Card key={listing.id}>
                      <CardContent className="p-0">
                        <div className="flex flex-col md:flex-row">
                          <div className="md:w-1/4 h-48 md:h-auto bg-gray-100">
                            {listing.images && listing.images.length > 0 ? (
                              <img 
                                src={listing.images[0].url} 
                                alt={listing.title} 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                No Image
                              </div>
                            )}
                          </div>
                          <div className="md:w-3/4 p-6">
                            <div className="flex justify-between mb-2">
                              <h3 className="text-xl font-semibold">{listing.title}</h3>
                              <Badge className={statusColors[listing.status]}>
                                {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                              <div>
                                <p className="text-sm text-gray-500">Price</p>
                                <p className="font-medium">${Number(listing.price).toLocaleString()}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Mileage</p>
                                <p className="font-medium">{Number(listing.mileage).toLocaleString()} mi</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Condition</p>
                                <p className="font-medium">{listing.condition}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Location</p>
                                <p className="font-medium">{listing.location}</p>
                              </div>
                            </div>
                            <p className="text-gray-700 mb-4 line-clamp-2">{listing.description}</p>
                            <div className="flex flex-wrap gap-2">
                              <Button variant="outline" size="sm" asChild>
                                <Link to={`/cars/details/${listing.id}`}>
                                  <Eye className="h-4 w-4 mr-1" /> View
                                </Link>
                              </Button>
                              {/* <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => setEditListing(listing)}
                              >
                                <Edit className="h-4 w-4 mr-1" /> Edit
                              </Button> */}
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="outline" size="sm" className="text-destructive border-destructive">
                                    <Trash className="h-4 w-4 mr-1" /> Delete
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This will permanently delete the listing for "{listing.title}". This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction 
                                      onClick={() => handleDeleteListing(listing.id)}
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                              
                              {/* {listing.status !== "sold" && (
                                <Select 
                                  value={listing.status} 
                                  onValueChange={(value) => handleStatusChange(listing.id, value as CarListing['status'])}
                                >
                                  <SelectTrigger className="h-9 w-32">
                                    <SelectValue placeholder="Change Status" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="sold">Sold</SelectItem>
                                    <SelectItem value="draft">Draft</SelectItem>
                                  </SelectContent>
                                </Select>
                              )} */}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <Car className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-1">No {status.charAt(0).toUpperCase() + status.slice(1)} Listings</h3>
                  <p className="text-gray-500 mb-4">You don't have any {status} car listings at the moment.</p>
                  <Button onClick={() => setIsAddDialogOpen(true)}>Create New Listing</Button>
                </div>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default CarListingManagement;
