
import React from 'react';
import { 
  Bell, 
  Car, 
  User, 
  Settings,
  AlertTriangle,
  CheckCircle,
  Clock
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

const notifications = [
  {
    id: "1",
    title: "New user registration",
    description: "Michael Chen has registered a new account",
    time: "2 hours ago",
    read: false,
    type: "user",
    priority: "normal"
  },
  {
    id: "2",
    title: "New car listing",
    description: "Sarah Johnson added a new car listing: 2019 Honda Accord",
    time: "5 hours ago", 
    read: false,
    type: "car",
    priority: "normal"
  },
  {
    id: "3",
    title: "Service provider verification",
    description: "AutoCare Express is requesting verification",
    time: "Yesterday",
    read: false,
    type: "provider",
    priority: "high"
  },
  {
    id: "4",
    title: "System alert",
    description: "Unusual login activity detected from IP 192.168.1.1",
    time: "Yesterday",
    read: true,
    type: "security",
    priority: "high"
  },
  {
    id: "5",
    title: "New review submitted",
    description: "Jessica Rodriguez left a 5-star review for Bay Area Auto Shop",
    time: "2 days ago",
    read: true,
    type: "review",
    priority: "normal"
  },
];

const AdminNotifications = () => {
  const { toast } = useToast();

  const markAsRead = (id: string) => {
    toast({
      title: "Notification marked as read",
      description: "The notification has been marked as read"
    });
  };

  const markAllRead = () => {
    toast({
      title: "All notifications marked as read",
      description: "All notifications have been marked as read"
    });
  };

  const deleteNotification = (id: string) => {
    toast({
      title: "Notification deleted",
      description: "The notification has been deleted"
    });
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "user":
        return <User className="h-5 w-5 text-blue-500" />;
      case "car":
        return <Car className="h-5 w-5 text-green-500" />;
      case "provider":
        return <Settings className="h-5 w-5 text-purple-500" />;
      case "security":
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case "review":
        return <CheckCircle className="h-5 w-5 text-yellow-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold">Notifications</h2>
          <Badge className="bg-red-500">{notifications.filter(n => !n.read).length}</Badge>
        </div>
        <Button variant="outline" size="sm" onClick={markAllRead}>
          Mark all as read
        </Button>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">
            All <Badge className="ml-2 bg-gray-500">{notifications.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="unread">
            Unread <Badge className="ml-2 bg-red-500">{notifications.filter(n => !n.read).length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="high">
            High Priority <Badge className="ml-2 bg-orange-500">{notifications.filter(n => n.priority === "high").length}</Badge>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div 
                key={notification.id}
                className={`p-4 border rounded-lg ${notification.read ? 'bg-white' : 'bg-blue-50'}`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                      {getIcon(notification.type)}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">
                        {notification.title}
                        {notification.priority === "high" && (
                          <Badge className="ml-2 bg-orange-500">High Priority</Badge>
                        )}
                      </p>
                      <p className="text-xs text-gray-500">{notification.time}</p>
                    </div>
                    <p className="text-gray-600 mt-1">{notification.description}</p>
                    <div className="flex gap-2 mt-2">
                      {!notification.read && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => markAsRead(notification.id)}
                        >
                          Mark as read
                        </Button>
                      )}
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => deleteNotification(notification.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="unread" className="mt-6">
          <div className="space-y-4">
            {notifications.filter(n => !n.read).map((notification) => (
              <div 
                key={notification.id}
                className="p-4 border rounded-lg bg-blue-50"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                      {getIcon(notification.type)}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">
                        {notification.title}
                        {notification.priority === "high" && (
                          <Badge className="ml-2 bg-orange-500">High Priority</Badge>
                        )}
                      </p>
                      <p className="text-xs text-gray-500">{notification.time}</p>
                    </div>
                    <p className="text-gray-600 mt-1">{notification.description}</p>
                    <div className="flex gap-2 mt-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => markAsRead(notification.id)}
                      >
                        Mark as read
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => deleteNotification(notification.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="high" className="mt-6">
          <div className="space-y-4">
            {notifications.filter(n => n.priority === "high").map((notification) => (
              <div 
                key={notification.id}
                className={`p-4 border rounded-lg ${notification.read ? 'bg-white' : 'bg-blue-50'}`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                      {getIcon(notification.type)}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">
                        {notification.title}
                        <Badge className="ml-2 bg-orange-500">High Priority</Badge>
                      </p>
                      <p className="text-xs text-gray-500">{notification.time}</p>
                    </div>
                    <p className="text-gray-600 mt-1">{notification.description}</p>
                    <div className="flex gap-2 mt-2">
                      {!notification.read && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => markAsRead(notification.id)}
                        >
                          Mark as read
                        </Button>
                      )}
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => deleteNotification(notification.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminNotifications;
