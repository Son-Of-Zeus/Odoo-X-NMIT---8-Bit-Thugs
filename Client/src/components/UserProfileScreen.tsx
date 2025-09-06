import { useState, useEffect } from "react";
import { ArrowLeft, Camera, Edit, MapPin, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { EditProfileDialog } from "./EditProfileDialog"; // Ensure this component exists
import { toast } from "sonner";

// It's best practice to use an environment variable for your API URL.
// In your React project's root, create a .env file with:
// REACT_APP_API_URL=https://8dd5334dfe3f.ngrok-free.app
const API_URL = "https://toolbar-starring-difficult-dreams.trycloudflare.com"

// This interface is aligned with your Prisma User model
interface UserProfile {
  id: number;
  firstName: string;
  lastName?: string;
  email: string;
  location?: string;
  userAddress?: string;
  phone?: string;
  profilePictureUrl?: string;
  createdAt: string;
}

interface UserProfileScreenProps {
  onNavigate: (screen: string) => void;
  onGoBack: () => void;
}

export function UserProfileScreen({ onNavigate, onGoBack }: UserProfileScreenProps) {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('authToken');

      if (!token) {
        setError("Authentication token not found. Please log in.");
        setIsLoading(false);
        toast.error("You are not logged in.");
        return;
      }
      
      try {
        const response = await fetch(`${API_URL}/user/profile`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Send the JWT token
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || `Request failed with status ${response.status}`);
        }
        
        setUserProfile(data.user);
      } catch (err: any) {
        console.error("Profile fetch error:", err);
        setError(err.message);
        toast.error(`Error loading profile: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []); // Empty dependency array ensures this runs only once on mount

  const handleUpdateProfile = (updatedData: Partial<UserProfile>) => {
    if (userProfile) {
      setUserProfile({ ...userProfile, ...updatedData });
      toast.success("Profile updated.");
      // In a real app, you would also send a PATCH request to your API here to save the changes
    }
  };

  // --- Render Logic based on state ---

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !userProfile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
        <h2 className="text-xl font-semibold text-destructive mb-2">Could Not Load Profile</h2>
        <p className="text-muted-foreground">{error}</p>
        <Button onClick={() => onNavigate('login')} className="mt-4">Go to Login</Button>
      </div>
    );
  }

  const fullName = `${userProfile.firstName || ''} ${userProfile.lastName || ''}`.trim();
  const initials = (userProfile.firstName?.[0] || '') + (userProfile.lastName?.[0] || '');

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-background/95 backdrop-blur sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Button variant="ghost" size="icon" onClick={onGoBack} className="rounded-lg mr-4">
                <ArrowLeft size={20} />
              </Button>
              <h1 className="text-lg font-medium">Profile</h1>
            </div>
            <Button variant="outline" className="rounded-lg" onClick={() => setIsEditDialogOpen(true)}>
              <Edit size={16} className="mr-2" />
              Edit
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Profile Card & Activity */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-border rounded-xl">
              <CardContent className="p-6 text-center">
                <div className="relative inline-block mb-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={userProfile.profilePictureUrl} />
                    <AvatarFallback className="text-xl">{initials.toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <Button size="icon" variant="secondary" className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full" onClick={() => setIsEditDialogOpen(true)}>
                    <Camera size={14} />
                  </Button>
                </div>
                <h2 className="text-xl font-semibold text-foreground mb-1">{fullName}</h2>
                <div className="flex items-center justify-center gap-1 text-muted-foreground mb-2">
                  <MapPin size={14} />
                  <span className="text-sm">{userProfile.location || userProfile.userAddress || 'Not provided'}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border rounded-xl">
              <CardHeader><CardTitle className="text-base">Activity</CardTitle></CardHeader>
              <CardContent className="p-6 pt-0">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Member since</span>
                    <span className="font-medium">{new Date(userProfile.createdAt).toLocaleDateString()}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Items sold</span>
                    <Badge variant="secondary">24</Badge> {/* Hardcoded for now */}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Items purchased</span>
                    <Badge variant="secondary">18</Badge> {/* Hardcoded for now */}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Details & Actions */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-border rounded-xl">
              <CardHeader><CardTitle>Personal Information</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><Label>First Name</Label><div className="p-2 bg-muted rounded-md text-sm">{userProfile.firstName}</div></div>
                  <div><Label>Last Name</Label><div className="p-2 bg-muted rounded-md text-sm">{userProfile.lastName || 'N/A'}</div></div>
                </div>
                <div><Label>Email Address</Label><div className="p-2 bg-muted rounded-md text-sm">{userProfile.email}</div></div>
                <div><Label>Phone Number</Label><div className="p-2 bg-muted rounded-md text-sm">{userProfile.phone || 'Not provided'}</div></div>
                <div><Label>Primary Address</Label><div className="p-2 bg-muted rounded-md text-sm">{userProfile.userAddress || 'Not provided'}</div></div>
              </CardContent>
            </Card>

            <Card className="border-border rounded-xl">
              <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start" onClick={() => onNavigate("my-listings")}>View My Listings</Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => onNavigate("purchases")}>Purchase History</Button>
                <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive" onClick={() => { /* Add logout logic here */ }}>Log Out</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Edit Profile Dialog */}
      <EditProfileDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        userProfile={userProfile}
        onSave={handleUpdateProfile}
      />
    </div>
  );
}
