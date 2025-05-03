
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Car, Menu, User, LogOut, Bell } from "lucide-react";

const Navbar = () => {
  const { user, isAuthenticated, logout, openAuthModal } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Function to determine if a link is active
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white bg-opacity-80 backdrop-blur-md shadow-md py-2"
          : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <Car className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">WheelsTrust</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link
            to="/"
            className={`transition-colors ${
              isActive("/") 
                ? "text-primary font-medium" 
                : "text-gray-800 hover:text-primary"
            }`}
          >
            Home
          </Link>
          <Link
            to="/cars/buy"
            className={`transition-colors ${
              isActive("/cars/buy") 
                ? "text-primary font-medium" 
                : "text-gray-800 hover:text-primary"
            }`}
          >
            Buy Car
          </Link>
          <Link
            to="/cars/sell"
            className={`transition-colors ${
              isActive("/cars/sell") 
                ? "text-primary font-medium" 
                : "text-gray-800 hover:text-primary"
            }`}
          >
            Sell Car
          </Link>
          <Link
            to="/services"
            className={`transition-colors ${
              isActive("/services") 
                ? "text-primary font-medium" 
                : "text-gray-800 hover:text-primary"
            }`}
          >
            Services
          </Link>
          <Link
            to="/about"
            className={`transition-colors ${
              isActive("/about") 
                ? "text-primary font-medium" 
                : "text-gray-800 hover:text-primary"
            }`}
          >
            About
          </Link>
        </nav>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <Link to="/profile" className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors">
                <User className="h-4 w-4" />
                {user?.name}
                <span className="ml-2 text-xs bg-primary text-white px-2 py-0.5 rounded-full">
                  {user?.role === "admin"
                    ? "Admin"
                    : user?.role === "service_provider"
                    ? "Service Provider"
                    : "User"}
                </span>
              </Link>
              
              <Link to="/notifications">
                <Button size="sm" variant="outline" className="relative">
                  <Bell className="h-4 w-4" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 text-[10px] flex items-center justify-center">
                    2
                  </span>
                </Button>
              </Link>
              
              {user?.role === "admin" ? (
                <Link to="/admin-dashboard">
                  <Button size="sm" variant="outline">
                    Dashboard
                  </Button>
                </Link>
              ) : user?.role === "service_provider" ? (
                <Link to="/service-provider-dashboard">
                  <Button size="sm" variant="outline">
                    Dashboard
                  </Button>
                </Link>
              ) : null}
              <Button size="sm" variant="ghost" onClick={logout}>
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </Button>
            </div>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={openAuthModal}
                className="text-gray-800 hover:text-primary"
              >
                Login
              </Button>
              <Button
                onClick={openAuthModal}
                size="sm"
                className="button-gradient text-white"
              >
                Sign Up
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-700"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg animate-fade-in absolute top-full left-0 w-full">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <Link
              to="/"
              className="text-gray-800 py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/cars/buy"
              className="text-gray-800 py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Buy Car
            </Link>
            <Link
              to="/cars/sell"
              className="text-gray-800 py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Sell Car
            </Link>
            <Link
              to="/services"
              className="text-gray-800 py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Services
            </Link>
            <Link
              to="/about"
              className="text-gray-800 py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            
            <hr className="my-2" />
            
            {isAuthenticated ? (
              <div className="space-y-3">
                <Link 
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2"
                >
                  <User className="h-5 w-5" />
                  <span className="font-medium">{user?.name}</span>
                </Link>
                
                <Link 
                  to="/notifications"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2"
                >
                  <Bell className="h-5 w-5" />
                  <span className="font-medium">Notifications</span>
                  <span className="bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                    2
                  </span>
                </Link>
                
                {user?.role === "admin" ? (
                  <Link 
                    to="/admin-dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button size="sm" className="w-full">Dashboard</Button>
                  </Link>
                ) : user?.role === "service_provider" ? (
                  <Link 
                    to="/service-provider-dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button size="sm" className="w-full">Dashboard</Button>
                  </Link>
                ) : null}
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    openAuthModal();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full"
                >
                  Login
                </Button>
                <Button 
                  size="sm" 
                  className="button-gradient text-white w-full"
                  onClick={() => {
                    openAuthModal();
                    setMobileMenuOpen(false);
                  }}
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
