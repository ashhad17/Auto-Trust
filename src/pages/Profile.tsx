
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  Settings, 
  Car, 
  Shield, 
  Bell, 
  CreditCard,
  Clock,
  MapPin,
  ChevronRight,
  Lock,
  Key,
  Mail,
  Eye,
  Bookmark
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface UserActivity {
  id: string;
  type: 'view' | 'message' | 'saved' | 'purchase';
  title: string;
  date: Date;
  image?: string;
}

const Profile = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  // Mock user activity
  const [userActivity] = useState<UserActivity[]>([
    {
      id: "1",
      type: "view",
      title: "2018 Toyota Camry",
      date: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      image: "https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=120&h=80",
    },
    {
      id: "2",
      type: "saved",
      title: "2020 Honda Accord",
      date: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=120&h=80",
    },
    {
      id: "3",
      type: "message",
      title: "Contacted Auto Spa Services",
      date: new Date(Date.now() - 1000 * 60 * 60 * 72), // 3 days ago
    },
  ]);
  
  // User settings state
  const [userSettings, setUserSettings] = useState({
    notifications: {
      email: true,
      push: false,
      sms: true,
      offers: false,
    },
    privacy: {
      showProfile: true,
      showActivity: false,
      allowMessaging: true,
    }
  });
  
  // Redirect if not logged in
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);
  
  if (!isAuthenticated) {
    return null; // Will be redirected
  }

  const handleSaveProfile = () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Profile updated",
        description: "Your profile information has been successfully updated."
      });
    }, 1000);
  };

  const handleSaveSettings = () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Settings updated",
        description: "Your account settings have been successfully updated."
      });
    }, 1000);
  };

  const handleUpdatePassword = () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Password updated",
        description: "Your password has been successfully changed."
      });
    }, 1000);
  };

  return (
    <>
      <Helmet>
        <title>My Profile | WheelsTrust</title>
      </Helmet>
      
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center mb-8">
              <div className="w-16 h-16 bg-gray-200 rounded-full mr-4 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop" 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold">My Profile</h1>
                <p className="text-gray-600">
                  Manage your account, listings, and preferences
                </p>
              </div>
            </div>
            
            <Tabs defaultValue="general">
              <TabsList className="mb-8">
                <TabsTrigger value="general">
                  <User className="h-4 w-4 mr-2" />
                  General
                </TabsTrigger>
                <TabsTrigger value="cars">
                  <Car className="h-4 w-4 mr-2" />
                  My Cars
                </TabsTrigger>
                <TabsTrigger value="security">
                  <Shield className="h-4 w-4 mr-2" />
                  Security
                </TabsTrigger>
                <TabsTrigger value="notifications">
                  <Bell className="h-4 w-4 mr-2" />
                  Notifications
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="general">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Personal Information</CardTitle>
                      <CardDescription>Update your personal details and contact information.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={(e) => { e.preventDefault(); handleSaveProfile(); }}>
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="firstName">First Name</Label>
                              <Input id="firstName" defaultValue="John" />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="lastName">Last Name</Label>
                              <Input id="lastName" defaultValue="Doe" />
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input id="email" type="email" defaultValue="john.doe@example.com" />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input id="phone" type="tel" defaultValue="+1 (555) 123-4567" />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="address">Address</Label>
                            <Textarea id="address" defaultValue="123 Main Street, Apt 4B&#10;New York, NY 10001" />
                          </div>
                          
                          <div className="pt-2">
                            <Button type="submit" disabled={loading}>
                              {loading ? "Saving..." : "Save Changes"}
                            </Button>
                          </div>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Profile Photo</CardTitle>
                      <CardDescription>Upload a new profile photo.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center space-x-4">
                        <div className="w-24 h-24 rounded-full overflow-hidden">
                          <img 
                            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=240&auto=format&fit=crop" 
                            alt="Profile" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Button variant="outline">Upload New Photo</Button>
                          <p className="text-xs text-gray-500">
                            JPG, GIF or PNG. Max size 800K.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Activity</CardTitle>
                      <CardDescription>Your recent interactions on WheelsTrust.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {userActivity.map(activity => (
                          <div key={activity.id} className="flex items-center border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                            {activity.image && (
                              <div className="w-12 h-12 rounded overflow-hidden bg-gray-100 mr-3 flex-shrink-0">
                                <img src={activity.image} alt={activity.title} className="w-full h-full object-cover" />
                              </div>
                            )}
                            {!activity.image && (
                              <div className="w-12 h-12 rounded bg-gray-100 mr-3 flex items-center justify-center flex-shrink-0">
                                {activity.type === 'message' && <Mail className="h-6 w-6 text-gray-400" />}
                                {activity.type === 'view' && <Eye className="h-6 w-6 text-gray-400" />}
                                {activity.type === 'saved' && <Bookmark className="h-6 w-6 text-gray-400" />}
                                {activity.type === 'purchase' && <CreditCard className="h-6 w-6 text-gray-400" />}
                              </div>
                            )}
                            <div className="flex-grow">
                              <div className="font-medium">{activity.title}</div>
                              <div className="text-xs text-gray-500 flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                {activity.date.toLocaleDateString()} at {activity.date.toLocaleTimeString([], { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </div>
                            </div>
                            <ChevronRight className="h-4 w-4 text-gray-400" />
                          </div>
                        ))}
                        
                        {userActivity.length === 0 && (
                          <div className="text-center py-6">
                            <p className="text-gray-500">No recent activity to show.</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="cars">
                <Card>
                  <CardHeader>
                    <CardTitle>My Cars</CardTitle>
                    <CardDescription>View and manage your car listings and purchases.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium">My Listings</h3>
                        <Button size="sm" variant="outline">+ New Listing</Button>
                      </div>
                      
                      <div className="text-center py-8">
                        <Car className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-1">No Cars Listed Yet</h3>
                        <p className="text-gray-500 mb-4">You haven't listed any cars for sale yet.</p>
                        <Button onClick={() => navigate('/cars/sell')}>Sell a Car</Button>
                      </div>
                      
                      <div className="border-t border-gray-200 pt-6">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-medium">Saved Cars</h3>
                          <Button size="sm" variant="ghost">View All</Button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="border border-gray-200 rounded-md overflow-hidden flex">
                            <div className="w-1/3 bg-gray-100">
                              <img 
                                src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=120&h=80" 
                                alt="Honda Accord" 
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="w-2/3 p-3">
                              <h4 className="font-medium">2020 Honda Accord</h4>
                              <p className="text-sm text-gray-600 mb-2">$22,500 • 15,000 miles</p>
                              <div className="flex space-x-2">
                                <Button size="sm" variant="ghost" className="h-7 px-2 text-xs">View</Button>
                                <Button size="sm" variant="ghost" className="h-7 px-2 text-xs text-destructive hover:text-destructive">Unsave</Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="security">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Change Password</CardTitle>
                      <CardDescription>Update your account password.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={(e) => { e.preventDefault(); handleUpdatePassword(); }}>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="currentPassword">Current Password</Label>
                            <div className="relative">
                              <Input id="currentPassword" type="password" />
                              <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="newPassword">New Password</Label>
                            <div className="relative">
                              <Input id="newPassword" type="password" />
                              <Key className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm New Password</Label>
                            <div className="relative">
                              <Input id="confirmPassword" type="password" />
                              <Key className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            </div>
                          </div>
                          
                          <div className="pt-2">
                            <Button type="submit" disabled={loading}>
                              {loading ? "Updating..." : "Update Password"}
                            </Button>
                          </div>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Privacy Settings</CardTitle>
                      <CardDescription>Control your privacy preferences.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">Public Profile</h4>
                            <p className="text-sm text-gray-500">Allow others to see your profile</p>
                          </div>
                          <Switch 
                            checked={userSettings.privacy.showProfile}
                            onCheckedChange={(checked) => setUserSettings({
                              ...userSettings,
                              privacy: { ...userSettings.privacy, showProfile: checked }
                            })}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">Activity Visibility</h4>
                            <p className="text-sm text-gray-500">Show your activity to other users</p>
                          </div>
                          <Switch 
                            checked={userSettings.privacy.showActivity}
                            onCheckedChange={(checked) => setUserSettings({
                              ...userSettings,
                              privacy: { ...userSettings.privacy, showActivity: checked }
                            })}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">Direct Messages</h4>
                            <p className="text-sm text-gray-500">Allow other users to send you messages</p>
                          </div>
                          <Switch 
                            checked={userSettings.privacy.allowMessaging}
                            onCheckedChange={(checked) => setUserSettings({
                              ...userSettings,
                              privacy: { ...userSettings.privacy, allowMessaging: checked }
                            })}
                          />
                        </div>
                        
                        <div className="pt-2">
                          <Button onClick={handleSaveSettings} disabled={loading}>
                            {loading ? "Saving..." : "Save Settings"}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-destructive">Danger Zone</CardTitle>
                      <CardDescription>Irreversible account actions.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="border border-gray-200 rounded-md p-4">
                          <h4 className="font-medium mb-1">Delete Account</h4>
                          <p className="text-sm text-gray-500 mb-3">
                            Permanently delete your account and all your data. This action cannot be undone.
                          </p>
                          <Button variant="destructive">Delete My Account</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="notifications">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>Control what notifications you receive and how you receive them.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Email Notifications</h3>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">Email Notifications</h4>
                            <p className="text-sm text-gray-500">Receive important updates via email</p>
                          </div>
                          <Switch 
                            checked={userSettings.notifications.email}
                            onCheckedChange={(checked) => setUserSettings({
                              ...userSettings,
                              notifications: { ...userSettings.notifications, email: checked }
                            })}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">Push Notifications</h4>
                            <p className="text-sm text-gray-500">Receive notifications on your device</p>
                          </div>
                          <Switch 
                            checked={userSettings.notifications.push}
                            onCheckedChange={(checked) => setUserSettings({
                              ...userSettings,
                              notifications: { ...userSettings.notifications, push: checked }
                            })}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">SMS Notifications</h4>
                            <p className="text-sm text-gray-500">Receive text messages for urgent updates</p>
                          </div>
                          <Switch 
                            checked={userSettings.notifications.sms}
                            onCheckedChange={(checked) => setUserSettings({
                              ...userSettings,
                              notifications: { ...userSettings.notifications, sms: checked }
                            })}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">Marketing & Offers</h4>
                            <p className="text-sm text-gray-500">Receive promotional content and special offers</p>
                          </div>
                          <Switch 
                            checked={userSettings.notifications.offers}
                            onCheckedChange={(checked) => setUserSettings({
                              ...userSettings,
                              notifications: { ...userSettings.notifications, offers: checked }
                            })}
                          />
                        </div>
                      </div>
                      
                      <div className="pt-2">
                        <Button onClick={handleSaveSettings} disabled={loading}>
                          {loading ? "Saving..." : "Save Preferences"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default Profile;
