import { useState } from "react";
import { Camera, X } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { toast } from "sonner@2.0.3";

interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  location: string;
  bio: string;
}

interface EditProfileDialogProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onSave: (updatedProfile: UserProfile) => void;
}

export function EditProfileDialog({ isOpen, onClose, userProfile, onSave }: EditProfileDialogProps) {
  const [formData, setFormData] = useState<UserProfile>(userProfile);
  const [isUploading, setIsUploading] = useState(false);

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = async (files: File[]) => {
    if (files.length === 0) return;
    
    setIsUploading(true);
    try {
      // Simulate image upload - in a real app, you'd upload to a service
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create mock URL for the uploaded image
      const newAvatarUrl = URL.createObjectURL(files[0]);
      setFormData(prev => ({
        ...prev,
        avatar: newAvatarUrl
      }));
      
      toast.success("Profile picture updated!");
    } catch (error) {
      toast.error("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({
      ...prev,
      avatar: ""
    }));
  };

  const handleSave = () => {
    // Validate required fields
    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }
    
    if (!formData.email.trim()) {
      toast.error("Email is required");
      return;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    onSave(formData);
    toast.success("Profile updated successfully!");
    onClose();
  };

  const handleCancel = () => {
    // Reset form data to original values
    setFormData(userProfile);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto border-border rounded-xl">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Update your profile information and photo
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Profile Picture Section */}
          <div className="space-y-4">
            <Label>Profile Picture</Label>
            
            <div className="flex flex-col items-center space-y-4">
              {/* Current Profile Picture */}
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={formData.avatar} />
                  <AvatarFallback className="text-xl">
                    {formData.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                {formData.avatar && (
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute -top-1 -right-1 h-6 w-6 rounded-full"
                    onClick={handleRemoveImage}
                  >
                    <X size={12} />
                  </Button>
                )}
              </div>

              {/* Simple Upload Button */}
              <div className="flex justify-center">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'image/*';
                    input.onchange = (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0];
                      if (file) {
                        handleImageUpload([file]);
                      }
                    };
                    input.click();
                  }}
                  disabled={isUploading}
                  className="px-6"
                >
                  <Camera size={16} className="mr-2" />
                  {isUploading ? "Uploading..." : formData.avatar ? "Change Photo" : "Upload Photo"}
                </Button>
              </div>
            </div>
          </div>

          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={formData.name.split(' ')[0] || ''}
                onChange={(e) => {
                  const firstName = e.target.value;
                  const lastName = formData.name.split(' ').slice(1).join(' ');
                  handleInputChange('name', `${firstName} ${lastName}`.trim());
                }}
                className="bg-input-background border-border rounded-lg"
                placeholder="Enter first name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={formData.name.split(' ').slice(1).join(' ') || ''}
                onChange={(e) => {
                  const firstName = formData.name.split(' ')[0] || '';
                  const lastName = e.target.value;
                  handleInputChange('name', `${firstName} ${lastName}`.trim());
                }}
                className="bg-input-background border-border rounded-lg"
                placeholder="Enter last name"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="bg-input-background border-border rounded-lg"
              placeholder="Enter email address"
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              className="bg-input-background border-border rounded-lg"
              placeholder="Enter your city, state"
            />
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              className="bg-input-background border-border rounded-lg min-h-[100px] resize-none"
              placeholder="Tell others about yourself and your sustainable journey..."
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground text-right">
              {formData.bio.length}/500 characters
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button 
            onClick={handleSave}
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg"
            disabled={isUploading}
          >
            {isUploading ? "Uploading..." : "Save Changes"}
          </Button>
          <Button 
            variant="outline" 
            onClick={handleCancel}
            className="flex-1 border-border rounded-lg"
            disabled={isUploading}
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}