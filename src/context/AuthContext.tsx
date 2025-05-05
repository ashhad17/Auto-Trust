import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

export type UserRole = "user" | "admin" | "service_provider";

type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  joinedDate?: string;
  address?: string;
  
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isAuthModalOpen: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  updateUser: (userData: Partial<User>) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if there's a stored token and fetch user data
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserData(token);
    }
  }, []);

  const fetchUserData = async (token: string) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/v1/auth/me`, 
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (response.data.success) {
        const userData = response.data.data;
        setUser({
          id: userData._id,
          name: userData.name,
          email: userData.email,
          role: userData.role,
          avatar: userData.avatar,
          phone: userData.phone,
          joinedDate: userData.createdAt ? new Date(userData.createdAt).toISOString().split('T')[0] : undefined
        });
        console.log("Fetched user data:", userData);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      localStorage.removeItem('token');
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/v1/auth/login`, 
        { email, password }
      );
      
      if (response.data.success) {
        console.log("Login response:", response.data);
        
        // Get token and user data from response
        const { token, data: userData } = response.data;
        
        // Save token to localStorage
        localStorage.setItem('token', token);
        
        // Safely handle potentially missing data
        const user = {
          id: userData?._id || "unknown",
          name: userData?.name || "Unknown User",
          email: userData?.email || email,
          role: (userData?.role as UserRole) || "user",
          avatar: userData?.avatar,
          phone: userData?.phone,
          joinedDate: userData?.createdAt ? new Date(userData.createdAt).toISOString().split('T')[0] : undefined
        };
        
        setUser(user);
        console.log("Logged in as:", user);
        
        toast({
          title: "Login Successful",
          description: "Welcome back!"
        });
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: "Login Failed",
        description: error.response?.data?.error || "Invalid credentials",
        variant: "destructive"
      });
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/v1/auth/register`, 
        { name, email, password }
      );
      
      if (response.data.success) {
        const { token, data: userData } = response.data;
        
        // Save token to localStorage
        localStorage.setItem('token', token);
        
        // Safely handle potentially missing data
        const user = {
          id: userData?._id || "unknown",
          name: userData?.name || name,
          email: userData?.email || email,
          role: (userData?.role as UserRole) || "user",
          joinedDate: userData?.createdAt ? new Date(userData.createdAt).toISOString().split('T')[0] : undefined
        };
        
        setUser(user);
        
        toast({
          title: "Registration Successful",
          description: "Welcome to WheelsTrust!"
        });
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      toast({
        title: "Registration Failed",
        description: error.response?.data?.error || "Could not create account",
        variant: "destructive"
      });
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out"
    });
  };

  const openAuthModal = () => {
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({...user, ...userData});
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAuthModalOpen,
        login,
        register,
        logout,
        openAuthModal,
        closeAuthModal,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
