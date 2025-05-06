
import React, { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/context/AuthContext";
import { Navigate, Link } from "react-router-dom";
import { 
  Car, 
  Users, 
  Settings, 
  User, 
  LogOut, 
  Home, 
  Menu,
  Bell
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import AdminNotifications from "@/components/admin/AdminNotifications";
import UserManagement from "@/components/admin/UserManagement";
import ServiceProviderManagement from "@/components/admin/ServiceProviderManagement";
import CarListingManagement from "@/components/admin/CarListingManagement";
import { Input } from "@/components/ui/input"; // Adding this import
import axios from "axios";

// Dashboard stats interface
interface DashboardStats {
  userCount: number;
  carListingsCount: number;
  serviceProvidersCount: number;
  totalRevenue: number;
}

const AdminDashboard = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<"dashboard" | "users" | "listings" | "providers" | "settings" | "notifications">("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { toast } = useToast();
  const [stats, setStats] = useState<DashboardStats>({
    userCount: 0,
    carListingsCount: 0,
    serviceProvidersCount: 0,
    totalRevenue: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Get token from localStorage
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);
    
    fetchDashboardStats(storedToken);
  }, []);

  const fetchDashboardStats = async (authToken: string | null) => {
    if (!authToken) {
      console.error("No auth token available");
      toast({
        title: "Authentication Error",
        description: "Please login again to access the dashboard",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    try {
      // Fetch user count
      const usersResponse = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/v1/users`, {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
      
      // Fetch car listings count
      const carsResponse = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/v1/cars`, {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
      
      // Fetch service providers count
      const providersResponse = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/v1/service-providers`, {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
      
      // Calculate total revenue (mockup for now)
      const totalRevenue = 24530; // This would come from a real API in production

      setStats({
        userCount: usersResponse.data.data.length,
        carListingsCount: carsResponse.data.data.length,
        serviceProvidersCount: providersResponse.data.data.serviceProviders.length,
        totalRevenue: totalRevenue
      });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      toast({
        title: "Error",
        description: "Failed to fetch dashboard statistics",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Redirect if not authenticated or not admin
  if (!isAuthenticated || user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out"
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow pt-16 bg-gray-50">
        <div className="flex">
          {/* Sidebar */}
          <div 
            className={`fixed top-16 left-0 bottom-0 z-30 transition-all duration-300 ${
              sidebarOpen ? "w-64" : "w-0"
            } bg-white shadow-lg overflow-hidden`}
          >
            <div className="p-4">
              <div className="flex items-center gap-3 mb-8">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{user?.name}</p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
              </div>
              
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab("dashboard")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === "dashboard"
                      ? "bg-primary text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <Home className="h-5 w-5" />
                  Dashboard
                </button>
                <button
                  onClick={() => setActiveTab("users")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === "users"
                      ? "bg-primary text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <Users className="h-5 w-5" />
                  Users
                </button>
                <button
                  onClick={() => setActiveTab("listings")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === "listings"
                      ? "bg-primary text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <Car className="h-5 w-5" />
                  Car Listings
                </button>
                <button
                  onClick={() => setActiveTab("providers")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === "providers"
                      ? "bg-primary text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <Settings className="h-5 w-5" />
                  Service Providers
                </button>
                <button
                  onClick={() => setActiveTab("notifications")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === "notifications"
                      ? "bg-primary text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <Bell className="h-5 w-5" />
                  Notifications
                  <Badge className="ml-auto bg-red-500 text-white">3</Badge>
                </button>
                <button
                  onClick={() => setActiveTab("settings")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === "settings"
                      ? "bg-primary text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <Settings className="h-5 w-5" />
                  Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors mt-4"
                >
                  <LogOut className="h-5 w-5" />
                  Logout
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div 
            className={`transition-all duration-300 ${
              sidebarOpen ? "ml-64" : "ml-0"
            } flex-1`}
          >
            <div className="p-6">
              <div className="flex items-center mb-6">
                <button 
                  onClick={toggleSidebar}
                  className="mr-4 p-2 rounded-lg hover:bg-gray-200"
                >
                  <Menu className="h-5 w-5" />
                </button>
                <h1 className="text-2xl font-bold">
                  {activeTab === "dashboard" && "Admin Dashboard"}
                  {activeTab === "users" && "User Management"}
                  {activeTab === "listings" && "Car Listings"}
                  {activeTab === "providers" && "Service Providers"}
                  {activeTab === "settings" && "Settings"}
                  {activeTab === "notifications" && "Notifications"}
                </h1>
              </div>

              {/* Dashboard Content */}
              {activeTab === "dashboard" && (
                <div className="space-y-6">
                  {/* Stats */}
                  {isLoading ? (
                    <div className="flex justify-center py-10">
                      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-gray-500 text-sm">Total Users</p>
                            <p className="text-2xl font-bold">{stats.userCount}</p>
                          </div>
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Users className="h-5 w-5 text-primary" />
                          </div>
                        </div>
                        <p className="mt-2 text-xs text-green-600">
                          <span className="font-medium">↑ 12%</span> since last month
                        </p>
                      </div>
                      <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-gray-500 text-sm">Active Listings</p>
                            <p className="text-2xl font-bold">{stats.carListingsCount}</p>
                          </div>
                          <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
                            <Car className="h-5 w-5 text-blue-600" />
                          </div>
                        </div>
                        <p className="mt-2 text-xs text-green-600">
                          <span className="font-medium">↑ 5%</span> since last week
                        </p>
                      </div>
                      <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-gray-500 text-sm">Service Providers</p>
                            <p className="text-2xl font-bold">{stats.serviceProvidersCount}</p>
                          </div>
                          <div className="h-10 w-10 rounded-full bg-green-50 flex items-center justify-center">
                            <Settings className="h-5 w-5 text-green-600" />
                          </div>
                        </div>
                        <p className="mt-2 text-xs text-green-600">
                          <span className="font-medium">↑ 8%</span> since last month
                        </p>
                      </div>
                      <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-gray-500 text-sm">Total Revenue</p>
                            <p className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</p>
                          </div>
                          <div className="h-10 w-10 rounded-full bg-purple-50 flex items-center justify-center">
                            <svg className="h-5 w-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                          </div>
                        </div>
                        <p className="mt-2 text-xs text-green-600">
                          <span className="font-medium">↑ 15%</span> since last month
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Recent Activity */}
                  <div className="bg-white rounded-lg shadow">
                    <div className="px-6 py-4 border-b">
                      <h3 className="text-lg font-medium">Recent Activity</h3>
                    </div>
                    <div className="px-6 py-4">
                      <div className="space-y-4">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                            <User className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm">
                              <span className="font-medium">Michael Chen</span> registered a new account
                            </p>
                            <p className="text-xs text-gray-500">2 hours ago</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                            <Car className="h-4 w-4 text-green-600" />
                          </div>
                          <div>
                            <p className="text-sm">
                              <span className="font-medium">Sarah Johnson</span> added a new car listing
                            </p>
                            <p className="text-xs text-gray-500">5 hours ago</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                            <Settings className="h-4 w-4 text-purple-600" />
                          </div>
                          <div>
                            <p className="text-sm">
                              <span className="font-medium">AutoCare Express</span> joined as a service provider
                            </p>
                            <p className="text-xs text-gray-500">Yesterday</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center mr-3">
                            <Bell className="h-4 w-4 text-yellow-600" />
                          </div>
                          <div>
                            <p className="text-sm">
                              <span className="font-medium">Jessica Rodriguez</span> left a new review
                            </p>
                            <p className="text-xs text-gray-500">Yesterday</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Users Tab */}
              {activeTab === "users" && (
                <div className="bg-white rounded-lg shadow p-6">
                  <UserManagement />
                </div>
              )}

              {/* Car Listings Tab */}
              {activeTab === "listings" && (
                <div className="bg-white rounded-lg shadow p-6">
                  <CarListingManagement />
                </div>
              )}

              {/* Service Providers Tab */}
              {activeTab === "providers" && (
                <div className="bg-white rounded-lg shadow p-6">
                  <ServiceProviderManagement />
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === "notifications" && (
                <AdminNotifications />
              )}

              {/* Settings Tab */}
              {activeTab === "settings" && (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="px-6 py-4 border-b">
                    <h3 className="text-lg font-medium">Platform Settings</h3>
                  </div>
                  <div className="p-6 space-y-6">
                    <div>
                      <h4 className="text-md font-medium mb-4">General Settings</h4>
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="siteName" className="block text-sm font-medium text-gray-700 mb-1">
                            Site Name
                          </label>
                          <Input
                            id="siteName"
                            name="siteName"
                            defaultValue="WheelsTrust"
                            className="max-w-md"
                          />
                        </div>
                        <div>
                          <label htmlFor="siteDescription" className="block text-sm font-medium text-gray-700 mb-1">
                            Site Description
                          </label>
                          <textarea
                            id="siteDescription"
                            name="siteDescription"
                            rows={3}
                            className="max-w-md w-full rounded-md border border-gray-300 shadow-sm p-3 focus:outline-none focus:ring-primary focus:border-primary"
                            defaultValue="Your trusted platform for buying, selling, and servicing vehicles with complete transparency."
                          />
                        </div>
                        <div>
                          <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-1">
                            Contact Email
                          </label>
                          <Input
                            id="contactEmail"
                            name="contactEmail"
                            type="email"
                            defaultValue="info@wheelstrust.com"
                            className="max-w-md"
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-md font-medium mb-4">Security Settings</h4>
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id="twoFactor"
                              name="twoFactor"
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                              defaultChecked
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="twoFactor" className="font-medium text-gray-700">
                              Enable Two-Factor Authentication
                            </label>
                            <p className="text-gray-500">
                              Increase security by requiring a second authentication method.
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id="loginNotifications"
                              name="loginNotifications"
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                              defaultChecked
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="loginNotifications" className="font-medium text-gray-700">
                              Email Notifications for New Logins
                            </label>
                            <p className="text-gray-500">
                              Receive email notifications when a new login is detected.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="pt-4 border-t">
                      <Button onClick={() => toast({ title: "Settings Saved", description: "Your settings have been saved successfully." })}>
                        Save Settings
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* <Footer /> */}
    </div>
  );
};

export default AdminDashboard;
