import React from "react";
import { Helmet } from "react-helmet";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Bell, MessageSquare, Car, CheckCircle, AlertCircle, Info } from "lucide-react";

const Notifications = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Redirect if not logged in
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);
  
  // Mock notifications data
  const notifications = [
    {
      id: "1",
      type: "message",
      title: "New message from John Smith",
      description: "Hi, I'm interested in your 2018 Honda Civic. Is it still available?",
      time: "2 hours ago",
      read: false,
    },
    {
      id: "2",
      type: "price_drop",
      title: "Price drop alert",
      description: "A car on your watchlist has dropped in price by $1,200.",
      time: "Yesterday",
      read: true,
    },
    {
      id: "3",
      type: "system",
      title: "Account verification successful",
      description: "Your account has been successfully verified. You now have full access to all features.",
      time: "2 days ago",
      read: true,
    },
    {
      id: "4",
      type: "listing",
      title: "Your listing has been approved",
      description: "Your 2019 Toyota Camry listing has been approved and is now visible to buyers.",
      time: "3 days ago",
      read: true,
    },
    {
      id: "5",
      type: "service",
      title: "Maintenance reminder",
      description: "Your vehicle is due for regular maintenance service. Schedule an appointment with one of our trusted service providers.",
      time: "5 days ago",
      read: false,
    },
  ];
  
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "message":
        return <MessageSquare className="h-5 w-5 text-blue-600" />;
      case "price_drop":
        return <Info className="h-5 w-5 text-green-600" />;
      case "system":
        return <CheckCircle className="h-5 w-5 text-purple-600" />;
      case "listing":
        return <Car className="h-5 w-5 text-amber-600" />;
      case "service":
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Bell className="h-5 w-5 text-gray-600" />;
    }
  };
  
  const getNotificationBackground = (type: string, read: boolean) => {
    if (read) return "bg-gray-50";
    
    switch (type) {
      case "message":
        return "bg-blue-50";
      case "price_drop":
        return "bg-green-50";
      case "system":
        return "bg-purple-50";
      case "listing":
        return "bg-amber-50";
      case "service":
        return "bg-red-50";
      default:
        return "bg-gray-50";
    }
  };
  
  if (!isAuthenticated) {
    return null; // Will be redirected
  }

  return (
    <>
      <Helmet>
        <title>Notifications | WheelsTrust</title>
      </Helmet>
      
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                <h1 className="text-2xl font-bold">Notifications</h1>
              </div>
              <Button variant="outline" size="sm">
                Mark All as Read
              </Button>
            </div>
            
            <div className="bg-white rounded-lg shadow-md divide-y">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div 
                    key={notification.id}
                    className={`p-4 flex gap-4 items-start ${getNotificationBackground(notification.type, notification.read)}`}
                  >
                    <div className={`rounded-full p-2 ${
                      notification.read ? 'bg-gray-100' : 
                      notification.type === 'message' ? 'bg-blue-100' :
                      notification.type === 'price_drop' ? 'bg-green-100' :
                      notification.type === 'system' ? 'bg-purple-100' :
                      notification.type === 'listing' ? 'bg-amber-100' :
                      'bg-red-100'
                    }`}>
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <h4 className="font-medium">{notification.title}</h4>
                        <span className="text-xs text-gray-500">{notification.time}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {notification.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <Button size="sm" variant="outline">View Details</Button>
                        {!notification.read && (
                          <div className="flex items-center">
                            <div className="w-2 h-2 bg-primary rounded-full mr-1"></div>
                            <span className="text-xs text-primary font-medium">New</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-10 text-center">
                  <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <h3 className="text-lg font-medium mb-1">No notifications</h3>
                  <p className="text-gray-500">You don't have any notifications at the moment.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default Notifications;
