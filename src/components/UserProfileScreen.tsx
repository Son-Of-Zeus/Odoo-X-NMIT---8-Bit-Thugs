import { useState } from "react";
import { ArrowLeft, Camera, Edit, MapPin } from "lucide-react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { EditProfileDialog } from "./EditProfileDialog";

interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  location: string;
  phoneNumber: string; 
  bio?: string; // Bio can be optional as it's in the edit dialog
}

interface UserProfileScreenProps {
  onNavigate: (screen: string) => void;
  onGoBack: () => void;
  userProfile: UserProfile;
  onUpdateProfile: (updatedProfile: UserProfile) => void;
}

export function UserProfileScreen({ onNavigate, onGoBack, userProfile, onUpdateProfile }: UserProfileScreenProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  // The user object dynamically uses the profile data passed in props
  const user = {
    ...userProfile,
    joinDate: "March 2023",
    totalSales: 24,
    totalPurchases: 18
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-background/95 backdrop-blur">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={onGoBack}
                className="rounded-lg mr-4"
              >
                <ArrowLeft size={20} />
              </Button>
              <h1 className="text-lg font-medium">Profile</h1>
            </div>
            <Button 
              variant="outline" 
              className="rounded-lg"
              onClick={() => setIsEditDialogOpen(true)}
            >
              <Edit size={16} className="mr-2" />
              Edit
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Profile Info & Stats */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-border rounded-xl">
              <CardContent className="p-6 text-center">
                <div className="relative inline-block mb-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback className="text-xl">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full border-2 border-background"
                    onClick={() => setIsEditDialogOpen(true)}
                  >
                    <Camera size={14} />
                  </Button>
                </div>
                <h2 className="text-xl font-medium text-foreground mb-1">
                  {user.name}
                </h2>
                <div className="flex items-center justify-center gap-1 text-muted-foreground mb-2">
                  <MapPin size={14} />
                  <span className="text-sm">{user.location}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border rounded-xl">
              <CardHeader>
                <CardTitle className="text-base">Activity</CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Member since</span>
                    <span className="font-medium">{user.joinDate}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Items sold</span>
                    <Badge variant="secondary" className="bg-accent text-accent-foreground">
                      {user.totalSales}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Items purchased</span>
                    <Badge variant="secondary" className="bg-accent text-accent-foreground">
                      {user.totalPurchases}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Details & Actions */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-border rounded-xl">
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>First Name</Label>
                    <div className="text-sm text-foreground bg-muted rounded-lg px-3 py-2">
                      {user.name.split(' ')[0]}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Last Name</Label>
                    <div className="text-sm text-foreground bg-muted rounded-lg px-3 py-2">
                      {user.name.split(' ').slice(1).join(' ') || 'Not provided'}
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <div className="text-sm text-foreground bg-muted rounded-lg px-3 py-2">
                    {user.email}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <div className="text-sm text-foreground bg-muted rounded-lg px-3 py-2">
                    {user.phoneNumber || 'Not provided'}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Location</Label>
                  <div className="text-sm text-foreground bg-muted rounded-lg px-3 py-2">
                    {user.location || 'Not provided'}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border rounded-xl">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start border-border rounded-lg"
                  onClick={() => onNavigate("my-listings")}
                >
                  View My Listings
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start border-border rounded-lg"
                  onClick={() => onNavigate("purchases")}
                >
                  Purchase History
                </Button>
              </CardContent>
            </Card>

            <div className="flex justify-center mt-6">
              <Button 
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg px-8"
                onClick={() => setIsEditDialogOpen(true)}
              >
                <Edit size={16} className="mr-2" />
                Edit Profile
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Dialog */}
      <EditProfileDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        userProfile={userProfile}
        onSave={onUpdateProfile}
      />
    </div>
  );
}
